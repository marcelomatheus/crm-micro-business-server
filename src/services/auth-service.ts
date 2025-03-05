import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import z from "zod";
import { handleMessageResponse } from "../utils/handle-message";
const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
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
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const validation = registerSchema.safeParse(req.body);
    const { name, email, password } = req.body;
    if (!validation.success) {
      return handleMessageResponse(validation.error.message, res);
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) return res.status(404).json({ message: "User already exists" });
    const dataUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });
    delete dataUser.password;
    return res.status(201).json(dataUser);
  } catch (error) {
    next(error);
  }
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) return handleMessageResponse(validation.error.message, res);
    
    const { email, password } = req.body;
    const dataUser = await prisma.user.findUnique({where: {email}});
    if (!dataUser) return res.status(404).json({ message: "User not found" });
    if (dataUser.password !== password) return res.status(401).json({ message: "Invalid password" });
    return res.status(200).json({ message: "Login success" });
  } catch (error) {
    next(error);
  }
};
