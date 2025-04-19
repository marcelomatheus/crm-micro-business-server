import express from "express";
import { Request, Response } from "express";

import { deleteUser, findUserById, updateUser } from "../services/user-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import { userSchema, userSchemaUpdate } from "../zod-schemas/users-schema";

const userRouter = express.Router();
export const findUserByIdController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const validation = userSchema.safeParse({ userId });

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const user = await findUserById({ userId: validation.data.userId });
  if (!user.id) {
    res.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  res.status(200).json({ success: true, user });
};

export const updateUserController = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const payload = req.body;

  const validation = userSchemaUpdate.safeParse({ payload, userId });

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const updatedUser = await updateUser({
    payload: validation.data.payload,
    userId: validation.data.userId,
  });
  res.status(200).json({ success: true, user: updatedUser });
};

export const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const validation = userSchema.safeParse({ userId });

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  await deleteUser({ userId: validation.data.userId });
  res.status(200).json({ success: true });
};

export default userRouter;
