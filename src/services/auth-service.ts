import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";
import * as jwt from "jsonwebtoken";
import { z } from "zod";

import { googleAuthSchema, loginSchema } from "../zod-schemas/auth-schema";

const prisma = new PrismaClient();
import { ApiError } from "../utils/api-error";
import { registerSchema } from "../zod-schemas/auth-schema";

type RegisterType = z.infer<typeof registerSchema>;
export const register = async ({ payload: { email, name, password } }: RegisterType) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) throw new ApiError("Usuário já existe", 409);
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
  return dataUser;
};

type LoginType = z.infer<typeof loginSchema>;
export const login = async ({ payload: { email, password } }: LoginType) => {
  const dataUser = await prisma.user.findUnique({ where: { email } });
  if (!dataUser) throw new ApiError("Usuário não encontrado", 404);

  const validPassword = await bcrypt.compare(password, dataUser.password);
  if (!validPassword) throw new ApiError("Senha inválida ou usuário inválidos", 401);

  const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET ?? "");
  return token;
};

type GoogleAuthType = z.infer<typeof googleAuthSchema>;
export const googleAuth = async ({ payload: { code } }: GoogleAuthType) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  const { tokens } = await client.getToken({
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });

  if (!tokens.id_token) throw new ApiError("Token inválido", 401);
  const ticket = await client.verifyIdToken({
    audience: process.env.GOOGLE_CLIENT_ID,
    idToken: tokens.id_token,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) throw new ApiError("Token inválido", 401);

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
  if (!dataUser) throw new ApiError("Usuário não encontrado", 404);
  const token = jwt.sign({ userId: dataUser.userId }, process.env.JWT_SECRET ?? "");
  return token;
};

const verifyExistsUser = (sub: string) => {
  return prisma.googleUser.findUnique({
    where: {
      sub: sub,
    },
  });
};
