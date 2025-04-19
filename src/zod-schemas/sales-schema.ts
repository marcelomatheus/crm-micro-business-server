import { z } from "zod";

import { userSchema } from "./users-schema";
export const salesSchema = z
  .object({
    customerId: z.string({ message: "O id do cliente é obrigatório" }),
  })
  .merge(userSchema);

export const createSalesSchema = z
  .object({
    payload: z.object({
      customerId: z.string({ message: "O id do cliente é obrigatório" }),
      products: z
        .array(
          z.object({
            id: z.string(),
            quantity: z.number().int().min(1),
          }),
        )
        .min(1),
      rating: z.number().min(0).max(5),
      total: z.number().min(0),
    }),
  })
  .merge(userSchema);

export const updateSalesSchema = z
  .object({
    payload: z.object({
      products: z
        .array(
          z
            .object({
              id: z.string({ message: "O id do produto é obrigatório" }),
              quantity: z.number().min(1),
            })
            .optional(),
        )
        .optional(),
      rating: z.number().int().min(0).max(5).optional(),
      total: z.number().min(0).optional(),
    }),
  })
  .merge(salesSchema)
  .merge(userSchema);
