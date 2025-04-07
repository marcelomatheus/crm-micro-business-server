import { z } from "zod";
export const registerSchema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().email({ message: "Email inválido" }),
    name: z.string(),
    password: z.string().min(8, { message: "Senha deve ter mais de 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não são iguais",
    path: ["confirm"],
  });
