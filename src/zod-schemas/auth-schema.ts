import { z } from "zod";
export const registerSchema = z
  .object(
    {
      payload: z.object({
        confirmPassword: z.string(),
        email: z.string().email({ message: "Email inválido" }),
        name: z.string({ message: "O nome é obrigatório" }),
        password: z.string().min(8, { message: "Senha deve ter mais de 8 caracteres" }),
      }),
    },
    { message: "O payload está incompleto" },
  )
  .refine((data) => data.payload.password === data.payload.confirmPassword, {
    message: "Senhas não são iguais",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  payload: z.object(
    {
      email: z.string({ message: "O email é obrigatório" }).email({ message: "E-mail inválido" }),
      password: z
        .string({ message: "A senha é obrigatória" })
        .min(8, { message: "A senha deve ter mais de 8 caracteres" }),
    },
    { message: "O payload está incompleto" },
  ),
});

export const googleAuthSchema = z.object({
  payload: z.object({
    code: z.string().min(1, { message: "O code se sessão é obrigatório" }),
  }),
});
