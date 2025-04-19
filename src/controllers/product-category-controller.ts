import express from "express";
import { Request, Response } from "express";
const ProductCategoryRouter = express.Router();

import {
  createProductCategory,
  deleteProductCategory,
  findProductCategoryById,
  findProductsCategory,
  updateProductCategory,
} from "../services/products-category-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import {
  createProductCategorySchema,
  productCategorySchema,
  updateProductCategorySchema,
} from "../zod-schemas/products-category-schema";
import { userSchema } from "../zod-schemas/users-schema";

export const findProductCategoryController = async (req: Request, res: Response) => {
  const input = { userId: req.user?.id };
  const validation = userSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findProductsCategory(validation.data);
  res.status(200).json({ data, success: true });
};

export const findProductCategoryByIdController = async (req: Request, res: Response) => {
  const input = {
    categoryId: req.params.id,
    userId: req.user?.id,
  };
  const validation = productCategorySchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findProductCategoryById(validation.data);
  res.status(200).json({ data, success: true });
};

export const createProductCategoryController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
    userId: req.user?.id,
  };
  const validation = createProductCategorySchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await createProductCategory(validation.data);
  res.status(201).json({ data, success: true });
};

export const updateProductCategoryController = async (req: Request, res: Response) => {
  const input = {
    categoryId: req.params.id,
    payload: req.body,
    userId: req.user?.id,
  };
  const validation = updateProductCategorySchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);
  const data = await updateProductCategory(validation.data);
  res.status(200).json({ data, success: true });
};

export const deleteProductCategoryController = async (req: Request, res: Response) => {
  const input = {
    categoryId: req.params.id,
    userId: req.user?.id,
  };
  const validation = productCategorySchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  await deleteProductCategory(validation.data);
  res.status(200).json({ success: true });
};

export default ProductCategoryRouter;
