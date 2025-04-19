import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface TokenPayload {
  id: string;
}

export const requestAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Requisição não autorizada" });
    return;
  }

  let decoded: TokenPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as TokenPayload;
  } catch (err) {
    res.status(401).json({ error: err, message: "Token inválido" });
    return;
  }
  const user = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    res.status(404).json({ message: "Usuário não encontrado" }).end();
    return;
  }
  req.user = user;
  next();
};
