import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { OAuth2Client } from "google-auth-library";
import { handleMessageResponse } from "../utils/handle-message";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: "Email inválido" }),
    password: z
      .string()
      .min(8, { message: "Senha deve ter mais de 8 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não são iguais",
    path: ["confirm"],
  });
type RegisterBody = {
  body: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
};

export const register = async (
  req: Request<RegisterBody>,
  res: Response
): Promise<any> => {
  try {
    const validationSchema = registerSchema.safeParse(req.body);
    if (!validationSchema.success) {
      return handleMessageResponse(validationSchema.error.message, res);
    }

    const { name, email, password } = validationSchema.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user)
      return res.status(404).json({ message: "Este usuário já existe" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const dataUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    delete dataUser.password;
    return res.status(201).json(dataUser);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter mais de 8 caracteres" }),
});

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const validationSchema = loginSchema.safeParse(req.body);
    if (!validationSchema.success)
      return handleMessageResponse(validationSchema.error.message, res);

    const { email, password } = req.body;
    const dataUser = await prisma.user.findUnique({ where: { email } });
    if (!dataUser)
      return res.status(404).json({ message: "Usuário não encontrado" });
    const validPassword = await bcrypt.compare(password, dataUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Senha ou e-mail inválidos" });
    }
    const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Login bem sucedido", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

type GoogleAuthBody = {
  body: {
    code: string;
  };
};

export const googleAuth = async (req: Request<GoogleAuthBody>, res: Response): Promise<any> => {
  try {
    const { code } = req.body;
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    const { tokens } = await client.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const user = await verifyExistsUser(payload.sub);
    if (!user) {
      const dataUser = await prisma.user.create({
        data: {
          email: payload.email,
          name: (payload.name),
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

    const token = jwt.sign({ id: dataUser.userId }, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Autenticação bem sucedida", token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const verifyExistsUser = (sub: string) => {
  return prisma.googleUser.findUnique({
    where: {
      sub: sub,
    },
  });
};
