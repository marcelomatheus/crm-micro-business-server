import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { ApiError } from "../utils/api-error";
import { userSchema, userSchemaUpdate } from "../zod-schemas/users-schema";
const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findUserById = async ({ userId }: UserType) => {
  const user = await prisma.user.findUnique({
    select: {
      email: true,
      id: true,
      name: true,
    },
    where: {
      id: userId,
    },
  });
  if (!user) throw new ApiError("Usuário não encontrado", 404);
  return user;
};

type UserUpdateType = z.infer<typeof userSchemaUpdate>;
export const updateUser = async ({ payload, userId }: UserUpdateType) => {
  const validationSchema = userSchemaUpdate.safeParse({ payload, userId });
  if (!validationSchema.success) throw new ApiError(validationSchema.error.message);
  const userData = await findUserById({ userId });
  const dataUpdated = { ...userData, ...payload };
  const user = await prisma.user.update({
    data: {
      email: dataUpdated.email,
      name: dataUpdated.name,
    },
    where: {
      id: userId,
    },
  });
  return user;
};

export const deleteUser = async ({ userId }: UserType) => {
  await findUserById({ userId });
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return user;
};
