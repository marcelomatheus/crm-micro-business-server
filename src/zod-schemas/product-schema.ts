import { z } from "zod";

import { userSchema } from "./users-schema";
export const productSchema = z
  .object({
    productId: z.string({ message: "O id do produto é obrigatório" }),
  })
  .merge(userSchema);

export const createProductSchema = z
  .object({
    payload: z.object({
      categoryId: z.string({ message: "O id da categoria é obrigatório" }),
      image: z.string().optional(),
      name: z.string({ message: "O nome do produto é obrigatório" }),
      price: z.number({ message: "O preço do produto é obrigatório" }),
      quantity: z
        .number({ message: "A quantidade do produto é obrigatória" })
        .int({ message: "A quantidade deve ser um número inteiro" }),
    }),
  })
  .merge(userSchema);

export const updateProductSchema = z
  .object({
    payload: z.object({
      categoryId: z.string({ message: "O id da categoria é obrigatório" }),
      image: z.string().optional(),
      name: z.string().optional(),
      price: z.number().optional(),
      quantity: z
        .number({ message: "A quantidade do produto é obrigatória" })
        .int({ message: "A quantidade deve ser um número inteiro" })
        .optional(),
    }),
  })
  .merge(productSchema)
  .merge(userSchema);
