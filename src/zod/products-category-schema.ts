import { z } from "zod";
export const categoryProductSchema = z.object({
  categoryId: z.string().uuid().min(1, { message: "O id da categoria é obrigatório" }),
});

export const createCategoryProductSchema = z.object({
  payload: z.object({
    name: z.string().min(1, { message: "O nome da categoria é obrigatório" }),
  }),
});

export const updateCategoryProductSchema = z
  .object({
    payload: z.object({
      name: z.string().min(1, { message: "O nome da categoria é obrigatório" }),
    }),
  })
  .merge(categoryProductSchema);
