import { createProductSchema, productSchema, updateProductSchema } from "@/zod/product-schema";
import { userSchema } from "@/zod/users-schema";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findProducts = async ({userId}:UserType) => {
  const products = await prisma.products.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });
  return products;
}


type ProductType = UserType & z.infer<typeof productSchema>;
export const findProductById = async ({productId, userId}:ProductType) => {
  const validationSchema = productSchema.safeParse({ productId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const product = await prisma.products.findUnique({
    where: {
      id: productId,
      userId: userId,
    },
  });
  return product;
}


type CreateProductType = UserType & z.infer<typeof createProductSchema>;
export const createProduct = async ({payload, userId}:CreateProductType) => {
  const validationSchema = createProductSchema.safeParse({ payload });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
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
      }
    },
  });
  return product;
}


type UpdateProductType = UserType & z.infer<typeof updateProductSchema>;
export const updateProduct = async ({payload, productId, userId}:UpdateProductType) => {
  const validationSchema = updateProductSchema.safeParse({ payload, productId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const dataProduct = await findProductById({productId, userId});
  if (!dataProduct) throw new Error("Product not found");
  const dataUpdated = {...dataProduct, ...payload};
  const product = await prisma.products.update({
    data: dataUpdated,
    where: {
      id: dataProduct.id,
      userId: userId,
    },
  });
  return product;
}

export const deleteProduct = async ({productId, userId}:ProductType) => {
  const validationSchema = productSchema.safeParse({ productId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const product = await prisma.products.delete({
    where: {
      id: productId,
      userId: userId,
    },
  });
  return product;
}