import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

import { handleMessageResponse } from "../utils/handle-message";

const prisma = new PrismaClient();

const registerSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().email({ message: "Email inválido" }),
    name: z.string(),
    password: z.string().min(8, { message: "Senha deve ter mais de 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não são iguais",
    path: ["confirm"],
  });
interface RegisterBody {
  body: {
    confirmPassword: string;
    email: string;
    name: string;
    password: string;
  };
}

export const register = async (req: Request<RegisterBody>, res: Response) => {
  try {
    const validationSchema = registerSchema.safeParse(req.body);
    if (!validationSchema.success) {
      return handleMessageResponse(validationSchema.error.message, res);
    }

    const { email, name, password } = validationSchema.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) return res.status(404).json({ message: "Este usuário já existe" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const dataUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });
    return res.status(201).json(dataUser);
  } catch (error) {
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "A senha deve ter mais de 8 caracteres" }),
});

export const login = async (req: Request, res: Response) => {
  try {
    const validationSchema = loginSchema.safeParse(req.body);
    if (!validationSchema.success)
      return handleMessageResponse(validationSchema.error.message, res);

    const { email, password } = req.body;
    const dataUser = await prisma.user.findUnique({ where: { email } });
    if (!dataUser) return res.status(404).json({ message: "Usuário não encontrado" });
    const validPassword = await bcrypt.compare(password, dataUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Senha ou e-mail inválidos" });
    }
    const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET ?? "");
    return res.status(200).json({ message: "Login bem sucedido", token });
  } catch (error) {
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

interface GoogleAuthBody {
  body: {
    code: string;
  };
}

export const googleAuth = async (req: Request<GoogleAuthBody>, res: Response) => {
  try {
    const { code } = req.body;
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });
    if (!tokens.id_token) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const ticket = await client.verifyIdToken({
      audience: process.env.GOOGLE_CLIENT_ID,
      idToken: tokens.id_token,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const user = await verifyExistsUser(payload.sub);
    if (!user) {
      const dataUser = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          password: randomUUID(),
        },
      });
      await prisma.googleUser.create({
        data: {
          sub: payload.sub,
          user: {
            connect: {
              id: dataUser.id,
            },
          },
        },
      });
    }
    const dataUser = await prisma.googleUser.findUnique({
      where: {
        sub: payload.sub,
      },
    });
    if (!dataUser) {
      return res.status(401).json({ message: "Token inválido" });
    }
    const token = jwt.sign({ userId: dataUser.userId }, process.env.JWT_SECRET ?? "");
    res.status(200).json({ message: "Autenticação bem sucedida", token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error, message: "Internal Server Error" });
  }
};

const verifyExistsUser = (sub: string) => {
  return prisma.googleUser.findUnique({
    where: {
      sub: sub,
    },
  });
};
