import { z } from "zod";

import { userSchema } from "./users-schema";
export const customerSchema = z
  .object({
    customerId: z.string({ message: "O id do cliente é obrigatório" }),
  })
  .merge(userSchema);

export const createCustomerSchema = z
  .object({
    payload: z.object({
      address: z
        .object({
          city: z.string({ message: "A cidade é obrigatória" }),
          country: z.string({ message: "O país é obrigatório" }),
          state: z.string({ message: "O estado é obrigatório" }),
          street: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
      email: z.string().email({ message: "Email inválido" }),
      name: z.string({ message: "O nome do cliente é obrigatório" }),
      notes: z.string().optional(),
      phone: z.string({ message: "O telefone do cliente é obrigatório" }),
      status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
    }),
  })
  .merge(userSchema);

export const updateCustomerSchema = z
  .object({
    payload: z.object({
      address: z
        .object({
          city: z.string().optional(),
          country: z.string().optional(),
          state: z.string().optional(),
          street: z.string().optional(),
          zip: z.string().optional(),
        })
        .optional(),
      email: z.string().email({ message: "Email inválido" }).optional(),
      name: z.string().optional(),
      notes: z.string().optional(),
      phone: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE").optional(),
    }),
  })
  .merge(userSchema)
  .merge(customerSchema);
