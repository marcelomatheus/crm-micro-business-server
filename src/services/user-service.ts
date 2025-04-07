import { userSchema, userSchemaUpdate } from "@/zod/users-schema";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

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
  return user;
};

type UserUpdateType = z.infer<typeof userSchemaUpdate>;
export const updateUser = async ({ payload, userId }: UserUpdateType) => {
  const validationSchema = userSchemaUpdate.safeParse({ payload, userId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const userData = await findUserById({ userId });
  if (!userData) throw new Error("Usuário não encontrado");
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
  const userExist = await findUserById({ userId });
  if (!userExist) throw new Error("Usuário não encontrado");
  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return user;
};
