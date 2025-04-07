import { userSchema } from "@/zod/users-schema";
import { z } from "zod";
export const customerSchema = z
  .object({
    customerId: z.string().uuid().min(1, { message: "O id do cliente é obrigatório" }),
  })
  .merge(userSchema);

export const createCustomerSchema = z
  .object({
    payload: z.object({
      address: z
        .object({
          city: z.string().min(1, { message: "A cidade é obrigatória" }),
          country: z.string().min(1, { message: "O país é obrigatório" }),
          state: z.string().min(1, { message: "O estado é obrigatório" }),
          street: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
      email: z.string().email({ message: "Email inválido" }),
      name: z.string().min(1, { message: "O nome do cliente é obrigatório" }),
      phone: z.string().min(1, { message: "O telefone do cliente é obrigatório" }),
      status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
    }),
  })
  .merge(userSchema);

export const updateCustomerSchema = z
  .object({
    payload: z.object({
      address: z
        .object({
          city: z.string().min(1, { message: "A cidade é obrigatória" }),
          country: z.string().min(1, { message: "O país é obrigatório" }),
          state: z.string().min(1, { message: "O estado é obrigatório" }),
          street: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
      email: z.string().email({ message: "Email inválido" }).optional(),
      name: z.string().min(1, { message: "O nome do cliente é obrigatório" }).optional(),
      phone: z.string().min(1, { message: "O telefone do cliente é obrigatório" }).optional(),
      status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE").optional(),
    }),
  })
  .merge(userSchema)
  .merge(customerSchema);
