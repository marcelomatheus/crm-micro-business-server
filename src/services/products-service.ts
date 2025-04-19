import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { ApiError } from "../utils/api-error";
import {
  createProductSchema,
  productSchema,
  updateProductSchema,
} from "../zod-schemas/product-schema";
import { userSchema } from "../zod-schemas/users-schema";

type CreateProductType = UserType & z.infer<typeof createProductSchema>;

type ProductType = UserType & z.infer<typeof productSchema>;

type UpdateProductType = UserType & z.infer<typeof updateProductSchema>;

type UserType = z.infer<typeof userSchema>;

const prisma = new PrismaClient();

export const findProducts = async ({ userId }: UserType) => {
  const products = await prisma.products.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });
  return products;
};

export const findProductById = async ({ productId, userId }: ProductType) => {
  const product = await prisma.products.findUnique({
    where: {
      id: productId,
      userId: userId,
    },
  });
  if (!product) throw new ApiError("Produto não encontrado", 404);
  return product;
};

export const createProduct = async ({ payload, userId }: CreateProductType) => {
  const product = await prisma.products.create({
    data: {
      category: {
        connect: {
          id: payload.categoryId,
        },
      },
      image: payload.image,
      name: payload.name,
      price: payload.price,
      quantity: payload.quantity,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return product;
};

export const updateProduct = async ({ payload, productId, userId }: UpdateProductType) => {
  const dataProduct = await findProductById({ productId, userId });

  const dataUpdated = { ...dataProduct, ...payload };

  const product = await prisma.products.update({
    data: dataUpdated,
    where: {
      id: dataProduct.id,
      userId: userId,
    },
  });

  return product;
};

export const deleteProduct = async ({ productId, userId }: ProductType) => {
  const product = await prisma.products.delete({
    where: {
      id: productId,
      userId: userId,
    },
  });
  return product;
};
