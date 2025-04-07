import { z } from "zod";
export const productSchema = z.object({
  productId: z.string().uuid().min(1, { message: "O id do produto é obrigatório" }),
});

export const createProductSchema = z.object({
  payload: z.object({
    categoryId: z.string().uuid().min(1, { message: "O id da categoria é obrigatório" }),
    image: z.string().optional(),
    name: z.string().min(1, { message: "O nome do produto é obrigatório" }),
    price: z.number().min(0, { message: "O preço do produto é obrigatório" }),
    quantity: z.number().min(0, { message: "A quantidade do produto é obrigatória" }),
  }),
});

export const updateProductSchema = z
  .object({
    payload: z.object({
      categoryId: z.string().uuid().min(1, { message: "O id da categoria é obrigatório" }),
      image: z.string().optional(),
      name: z.string().min(1, { message: "O nome do produto é obrigatório" }),
      price: z.number().min(0, { message: "O preço do produto é obrigatório" }),
      quantity: z.number().min(0, { message: "A quantidade do produto é obrigatória" }),
    }),
  })
  .merge(productSchema);
