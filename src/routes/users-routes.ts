import express from "express";
import asyncHandler from "express-async-handler";

import {
  deleteUserController,
  findUserByIdController,
  updateUserController,
} from "../controllers/user-controller";
import { requestAuthorization } from "../middlewares/request-authorization";

const userRouter = express.Router();
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para buscar um usuário específico
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Usuário não autorizado
 */
userRouter.get("/:id", requestAuthorization, asyncHandler(findUserByIdController));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza as informações do usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para atualizar um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
userRouter.put("/:id", requestAuthorization, asyncHandler(updateUserController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para deletar um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
userRouter.delete("/:id", requestAuthorization, asyncHandler(deleteUserController));

export default userRouter;
