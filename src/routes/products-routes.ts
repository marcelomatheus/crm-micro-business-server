import express from "express";
import asyncHandler from "express-async-handler";

import {
  createProductController,
  deleteProductController,
  findProductByIdController,
  findProductsController,
  updateProductController,
} from "../controllers/products-controller";
import { requestAuthorization } from "../middlewares/request-authorization";

const productsRouter = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para listar todos os produtos de um usuário
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                   price:
 *                     type: number
 *       401:
 *         description: Usuário não autorizado
 */
productsRouter.get("/", requestAuthorization, asyncHandler(findProductsController));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para buscar um produto específico de um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Usuário não autorizado
 */
productsRouter.get("/:id", requestAuthorization, asyncHandler(findProductByIdController));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para criar um novo produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Produto A
 *               price:
 *                 type: number
 *                 example: 100.50
 *               quantity:
 *                 type: number
 *                 example: 10
 *               categoryId:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       400:
 *         description: Dados inválidos
 */
productsRouter.post("/", requestAuthorization, asyncHandler(createProductController));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags:
 *       - Products
 *     description: Endpoint para atualizar um produto existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
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
 *               - price
 *               - quantity
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Produto Atualizado
 *               price:
 *                 type: number
 *                 example: 150.00
 *               quantity:
 *                 type: number
 *                 example: 15
 *               categoryId:
 *                 type: string
 *                 example: 67890
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 */
productsRouter.put("/:id", requestAuthorization, asyncHandler(updateProductController));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para deletar um produto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       404:
 *         description: Produto não encontrado
 */
productsRouter.delete("/:id", requestAuthorization, asyncHandler(deleteProductController));

export default productsRouter;
