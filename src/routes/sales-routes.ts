import express from "express";
import asyncHandler from "express-async-handler";

import {
  createSaleController,
  deleteSaleController,
  findSaleByIdController,
  findSalesController,
  updateSaleController,
} from "../controllers/sales-controller";
import { requestAuthorization } from "../middlewares/request-authorization";

const salesRouter = express.Router();

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Retorna todas as vendas
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para listar todas as vendas de um usuário
 *     responses:
 *       200:
 *         description: Lista de vendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   total:
 *                     type: number
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Usuário não autorizado
 */
salesRouter.get("/", requestAuthorization, asyncHandler(findSalesController));

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Retorna uma venda pelo ID
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para buscar uma venda específica de um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da venda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 total:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Usuário não autorizado
 */
salesRouter.get("/:id", requestAuthorization, asyncHandler(findSaleByIdController));

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Cria uma nova venda
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para criar uma nova venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - total
 *               - products
 *             properties:
 *               customerId:
 *                 type: string
 *               total:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
salesRouter.post("/", requestAuthorization, asyncHandler(createSaleController));

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Atualiza uma venda
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para atualizar uma venda existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da venda
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - total
 *             properties:
 *               total:
 *                 type: number
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Venda não encontrada
 */
salesRouter.put("/:id", requestAuthorization, asyncHandler(updateSaleController));

/**
 * @swagger
 * /sales/{id}:
 *   delete:
 *     summary: Deleta uma venda
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para deletar uma venda
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da venda
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Venda deletada com sucesso
 *       404:
 *         description: Venda não encontrada
 */
salesRouter.delete("/:id", requestAuthorization, asyncHandler(deleteSaleController));

export default salesRouter;
