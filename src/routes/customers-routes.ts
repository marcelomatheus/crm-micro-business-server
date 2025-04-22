import express from "express";
import asyncHandler from "express-async-handler";

import {
  createCustomerController,
  deleteCustomerController,
  findCustomerByIdController,
  findCustomersController,
  updateCustomerController,
} from "../controllers/customers-controller";
import { requestAuthorization } from "../middlewares/request-authorization";

const customersRouter = express.Router();

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags:
 *       - Customers
 *     description: Endpoint para listar todos os clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
customersRouter.get("/", requestAuthorization, asyncHandler(findCustomersController));

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags:
 *       - Customers
 *     description: Endpoint para buscar um cliente pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado com sucesso
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
 *         description: Cliente não encontrado
 */
customersRouter.get("/:id", requestAuthorization, asyncHandler(findCustomerByIdController));

/**
 * @swagger
 * /customer:
 *   post:
 *     summary: Cria um novo cliente
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para criar um novo cliente
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
 *                 description: Nome do cliente
 *                 example: Maria Oliveira
 *               email:
 *                 type: string
 *                 description: Email do cliente
 *                 example: maria@email.com
 *               phone:
 *                 type: string
 *                 description: Telefone do cliente
 *                 example: "3899987856"
 *               notes:
 *                 type: string
 *                 description: Observações sobre o cliente
 *                 example: "Cliente fiel"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 name:
 *                   type: string
 *                   example: Maria Oliveira
 *                 email:
 *                   type: string
 *                   example: maria@email.com
 *                 phone:
 *                   type: string
 *                   example: "3899987856"
 *       400:
 *         description: Dados inválidos
 */
customersRouter.post("/", requestAuthorization, asyncHandler(createCustomerController));

/**
 * @swagger
 * /customer/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para atualizar os dados de um cliente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente
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
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
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
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 */
customersRouter.put("/:id", requestAuthorization, asyncHandler(updateCustomerController));

/**
 * @swagger
 * /customer/{id}:
 *   delete:
 *     summary: Deleta um cliente
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para deletar um cliente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente deletado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
customersRouter.delete("/:id", requestAuthorization, asyncHandler(deleteCustomerController));

export default customersRouter;
