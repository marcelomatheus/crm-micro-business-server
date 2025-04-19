import { z } from "zod";

import { userSchema } from "./users-schema";
export const productCategorySchema = z
  .object({
    categoryId: z.string({ message: "O id da categoria é obrigatório" }),
  })
  .merge(userSchema);

export const createProductCategorySchema = z
  .object({
    payload: z.object({
      name: z.string({ message: "O nome da categoria é obrigatório" }),
    }),
  })
  .merge(userSchema);

export const updateProductCategorySchema = z
  .object({
    payload: z.object({
      name: z.string({ message: "O nome da categoria é obrigatório" }),
    }),
  })
  .merge(productCategorySchema)
  .merge(userSchema);
