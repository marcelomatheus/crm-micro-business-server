import { googleAuth, login, register } from "@/services/auth-service";
import cors from "cors";
import express from "express";
const router = express.Router();

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
  }),
);
router.use(express.json());

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz o login do usuário
 *     tags:
 *       - Auth
 *     description: Endpoint para realizar login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456abcd
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjM0MzUwNzQxfQ.7J9
 *       400:
 *         description: Campos obrigatórios faltando
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Senha inválida
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra o usuário
 *     tags:
 *       - Auth
 *     description: Endpoint para cadastrar o usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 example: User
 *               email:
 *                 type: string
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 example: 123456abcd
 *               confirmPassword:
 *                 type: string
 *                 example: 123456abcd
 *     responses:
 *       200:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Campos obrigatórios faltando
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Senha inválida
 */
router.post("/register", register);

/**
 * @swagger
 * /register/google-auth:
 *   post:
 *     summary: Autenticação com Google
 *     tags:
 *       - Auth
 *     description: Endpoint para autenticar o usuário com Google
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: 4/SDFS6DV14X8CASFSD
 *     responses:
 *       200:
 *         description: Autenticação bem sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Autenticação bem sucedida
 *                 token:
 *                   type: string
 *       500:
 *         description: Erro Interno do Servidor
 */
router.post("/register/google-auth", googleAuth);

export default router;
