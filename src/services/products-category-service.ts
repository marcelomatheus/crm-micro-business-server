import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { ApiError } from "../utils/api-error";
import {
  createProductCategorySchema,
  productCategorySchema,
  updateProductCategorySchema,
} from "../zod-schemas/products-category-schema";
import { userSchema } from "../zod-schemas/users-schema";

type CreateProductCategoryType = UserType & z.infer<typeof createProductCategorySchema>;

type ProductCategoryType = UserType & z.infer<typeof productCategorySchema>;

type UpdateProductCategoryType = UserType & z.infer<typeof updateProductCategorySchema>;

type UserType = z.infer<typeof userSchema>;

const prisma = new PrismaClient();

export const findProductsCategory = async ({ userId }: UserType) => {
  const productCategory = await prisma.productCategory.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });
  return productCategory;
};

export const findProductCategoryById = async ({ categoryId, userId }: ProductCategoryType) => {
  const productCategory = await prisma.productCategory.findUnique({
    where: {
      id: categoryId,
      userId: userId,
    },
  });
  if (!productCategory) throw new ApiError("Categoria de produto não encontrada", 404);
  return productCategory;
};

export const createProductCategory = async ({ payload, userId }: CreateProductCategoryType) => {
  const productCategory = await prisma.productCategory.create({
    data: {
      name: payload.name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return productCategory;
};

export const updateProductCategory = async ({
  categoryId,
  payload,
  userId,
}: UpdateProductCategoryType) => {
  const dataProductCategory = await findProductCategoryById({ categoryId, userId });

  const dataUpdated = { ...dataProductCategory, ...payload };

  const productCategory = await prisma.productCategory.update({
    data: dataUpdated,
    where: {
      id: dataProductCategory.id,
      userId: userId,
    },
  });

  return productCategory;
};

export const deleteProductCategory = async ({ categoryId, userId }: ProductCategoryType) => {
  await findProductCategoryById({ categoryId, userId });
  const productCategory = await prisma.productCategory.delete({
    where: {
      id: categoryId,
      userId: userId,
    },
  });
  return productCategory;
};
