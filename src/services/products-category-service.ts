import {
  categoryProductSchema,
  createCategoryProductSchema,
  updateCategoryProductSchema,
} from "@/zod/products-category-schema";
import { userSchema } from "@/zod/users-schema";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findCategoryProducts = async ({ userId }: UserType) => {
  const categoryProducts = await prisma.categoryProducts.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });
  return categoryProducts;
};

type CategoryProductType = UserType & z.infer<typeof categoryProductSchema>;
export const findCategoryProductById = async ({ categoryId, userId }: CategoryProductType) => {
  const validationSchema = categoryProductSchema.safeParse({ categoryId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const categoryProduct = await prisma.categoryProducts.findUnique({
    where: {
      id: categoryId,
      userId: userId,
    },
  });
  return categoryProduct;
};

type CreateCategoryProductType = UserType & z.infer<typeof createCategoryProductSchema>;
export const createCategoryProduct = async ({ payload, userId }: CreateCategoryProductType) => {
  const validationSchema = createCategoryProductSchema.safeParse({ payload });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const categoryProduct = await prisma.categoryProducts.create({
    data: {
      name: payload.name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return categoryProduct;
};

type UpdateCategoryProductType = UserType & z.infer<typeof updateCategoryProductSchema>;
export const updateCategoryProduct = async ({
  categoryId,
  payload,
  userId,
}: UpdateCategoryProductType) => {
  const validationSchema = updateCategoryProductSchema.safeParse({ categoryId, payload });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const dataCategoryProduct = await findCategoryProductById({ categoryId, userId });
  if (!dataCategoryProduct) throw new Error("Category product not found");
  const dataUpdated = { ...dataCategoryProduct, ...payload };
  const categoryProduct = await prisma.categoryProducts.update({
    data: dataUpdated,
    where: {
      id: dataCategoryProduct.id,
      userId: userId,
    },
  });
  return categoryProduct;
};

export const deleteCategoryProduct = async ({ categoryId, userId }: CategoryProductType) => {
  const validationSchema = categoryProductSchema.safeParse({ categoryId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const categoryProduct = await prisma.categoryProducts.delete({
    where: {
      id: categoryId,
      userId: userId,
    },
  });
  return categoryProduct;
};
