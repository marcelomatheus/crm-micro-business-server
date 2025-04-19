import express from "express";
import { Request, Response } from "express";
const salesRouter = express.Router();
import {
  createSales,
  deleteSales,
  findSaleById,
  findSales,
  updateSales,
} from "../services/sales-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import { createSalesSchema, salesSchema, updateSalesSchema } from "../zod-schemas/sales-schema";
import { userSchema } from "../zod-schemas/users-schema";

export const findSalesController = async (req: Request, res: Response) => {
  const input = { userId: req.header.arguments.userId };
  const validation = userSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findSales(validation.data);
  res.status(200).json({ data, success: true });
};

export const findSaleByIdController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    userId: req.header.arguments.userId,
  };
  const validation = salesSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findSaleById(validation.data);
  res.status(200).json({ data, success: true });
};

export const createSaleController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
    userId: req.header.arguments.userId,
  };
  const validation = createSalesSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await createSales(validation.data);
  res.status(201).json({ data, success: true });
};

export const updateSaleController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    payload: req.body,
    userId: req.header.arguments.userId,
  };
  const validation = updateSalesSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);
  const data = await updateSales(validation.data);
  res.status(200).json({ data, success: true });
};

export const deleteSaleController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    userId: req.user?.id,
  };
  const validation = salesSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  await deleteSales(validation.data);
  res.status(200).json({ success: true });
};

export default salesRouter;
