import express from "express";
import asyncHandler from "express-async-handler";

import {
  createProductCategoryController,
  deleteProductCategoryController,
  findProductCategoryByIdController,
  findProductCategoryController,
  updateProductCategoryController,
} from "../controllers/product-category-controller";
import { requestAuthorization } from "../middlewares/request-authorization";

const productCategoryRouter = express.Router();

/**
 * @swagger
 * /category-products:
 *   get:
 *     summary: Retorna todas as categorias de produtos
 *     tags:
 *       - Category Products
 *     description: Endpoint para listar todas as categorias de produtos de um usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias de produtos
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
 *       401:
 *         description: Usuário não autorizado
 */
productCategoryRouter.get("/", requestAuthorization, asyncHandler(findProductCategoryController));

/**
 * @swagger
 * /category-products/{id}:
 *   get:
 *     summary: Retorna uma categoria de produto pelo ID
 *     tags:
 *       - Category Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para buscar uma categoria de produto específica de um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da categoria de produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria de produto encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       404:
 *         description: Categoria de produto não encontrada
 *       401:
 *         description: Usuário não autorizado
 */
productCategoryRouter.get(
  "/:id",
  requestAuthorization,
  asyncHandler(findProductCategoryByIdController),
);

/**
 * @swagger
 * /category-products:
 *   post:
 *     summary: Cria uma nova categoria de produto
 *     tags:
 *       - Category Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para criar uma nova categoria de produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eletrônicos
 *     responses:
 *       201:
 *         description: Categoria de produto criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 */
productCategoryRouter.post(
  "/",
  requestAuthorization,
  asyncHandler(createProductCategoryController),
);

/**
 * @swagger
 * /category-products/{id}:
 *   put:
 *     summary: Atualiza uma categoria de produto
 *     tags:
 *       - Category Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para atualizar uma categoria de produto existente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da categoria de produto
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eletrônicos Atualizado
 *     responses:
 *       200:
 *         description: Categoria de produto atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Categoria de produto não encontrada
 */
productCategoryRouter.put(
  "/:id",
  requestAuthorization,
  asyncHandler(updateProductCategoryController),
);

/**
 * @swagger
 * /category-products/{id}:
 *   delete:
 *     summary: Deleta uma categoria de produto
 *     tags:
 *       - Category Products
 *     security:
 *       - bearerAuth: []
 *     description: Endpoint para deletar uma categoria de produto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da categoria de produto
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria de produto deletada com sucesso
 *       404:
 *         description: Categoria de produto não encontrada
 */
productCategoryRouter.delete(
  "/:id",
  requestAuthorization,
  asyncHandler(deleteProductCategoryController),
);

export default productCategoryRouter;
