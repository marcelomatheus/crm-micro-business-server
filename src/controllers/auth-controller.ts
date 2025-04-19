import { Request, Response } from "express";

import { googleAuth, login, register } from "../services/auth-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import { googleAuthSchema, loginSchema, registerSchema } from "../zod-schemas/auth-schema";

export const registerController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
  };
  const validation = registerSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await register(validation.data);
  res.status(201).json({ data, success: true });
};

export const loginController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
  };
  const validation = loginSchema.safeParse(input);

  if (!validation.success)
    throw new ApiError(handleMessageZod(handleMessageZod(validation.error.message)), 400);

  const data = await login(validation.data);
  res.status(200).json({ success: true, token: data });
};

export const googleAuthController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
  };
  const validation = googleAuthSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await googleAuth(validation.data);
  res.status(200).json({ data, success: true });
};
