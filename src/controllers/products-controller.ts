import express from "express";
import { Request, Response } from "express";
const productsRouter = express.Router();
import {
  createProduct,
  deleteProduct,
  findProductById,
  findProducts,
  updateProduct,
} from "../services/products-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import {
  createProductSchema,
  productSchema,
  updateProductSchema,
} from "../zod-schemas/product-schema";
import { userSchema } from "../zod-schemas/users-schema";

export const findProductsController = async (req: Request, res: Response) => {
  const input = { userId: req.header.arguments.userId };
  const validation = userSchema.safeParse(input);

  if (!validation.success) throw new Error(handleMessageZod(validation.error.message));

  const data = await findProducts(validation.data);
  res.status(200).json({ data, success: true });
};

export const findProductByIdController = async (req: Request, res: Response) => {
  const input = {
    productId: req.params.id,
    userId: req.user?.id,
  };
  const validation = productSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findProductById(validation.data);
  res.status(200).json({ data, success: true });
};

export const createProductController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
    userId: req.user?.id,
  };
  const validation = createProductSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await createProduct(validation.data);
  res.status(201).json({ data, success: true });
};

export const updateProductController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
    productId: req.params.id,
    userId: req.user?.id,
  };
  const validation = updateProductSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await updateProduct(validation.data);
  res.status(200).json({ data, success: true });
};

// Controller para deletar produto
export const deleteProductController = async (req: Request, res: Response) => {
  const input = {
    productId: req.params.id,
    userId: req.user?.id,
  };
  const validation = productSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  await deleteProduct(validation.data);
  res.status(200).json({ success: true });
};

export default productsRouter;
