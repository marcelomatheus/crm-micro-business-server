import { z } from "zod";

export const salesSchema = z.object({
  customerId: z.string().uuid().min(1, { message: "O id do cliente é obrigatório" }),
});

export const createSalesSchema = z.object({
  payload: z.object({
    customerId: z.string().uuid().min(1, { message: "O id do cliente é obrigatório" }),
    products: z.array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().min(1),
      }),
    ),
    rating: z.number().min(0).max(5),
    total: z.number().min(0),
  }),
});

export const updateSalesSchema = z
  .object({
    payload: z.object({
      products: z.array(
        z.object({
          id: z.string().uuid(),
          quantity: z.number().min(1),
        }),
      ),
      rating: z.number().min(0).max(5),
      total: z.number().min(0),
    }),
  })
  .merge(salesSchema);
