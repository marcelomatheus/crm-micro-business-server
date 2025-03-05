import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    if (user) return res.status(404).json({ message: "User already exists" });
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
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const validationSchema = loginSchema.safeParse(req.body);
    if (!validationSchema.success) return handleMessageResponse(validationSchema.error.message, res);
    
    const { email, password } = req.body;
    const dataUser = await prisma.user.findUnique({where: {email}});
    if (!dataUser) return res.status(404).json({ message: "User not found" });
    const validPassword = await bcrypt.compare(password, dataUser.password);
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid password or email" });
    }
    const token = jwt.sign({ id: dataUser.id }, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Login success", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
