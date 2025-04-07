import { z } from "zod";

export const userSchema = z.object({
  userId: z.string().uuid().min(1, { message: "O id do usuário é obrigatório" }),
});

export const userSchemaUpdate = z
  .object({
    payload: z.object({
      email: z.string().email({ message: "Email inválido" }).optional(),
      name: z.string().min(1, { message: "O nome é obrigatório" }).optional(),
    }),
  })
  .merge(userSchema);
