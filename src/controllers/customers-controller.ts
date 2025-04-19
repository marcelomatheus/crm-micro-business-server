import express from "express";
import { Request, Response } from "express";
const customersRouter = express.Router();
import {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  findCustomers,
  updateCustomer,
} from "../services/customers-service";
import { ApiError } from "../utils/api-error";
import { handleMessageZod } from "../utils/handle-message-zod";
import {
  createCustomerSchema,
  customerSchema,
  updateCustomerSchema,
} from "../zod-schemas/customers-schema";
import { userSchema } from "../zod-schemas/users-schema";

export const findCustomersController = async (req: Request, res: Response) => {
  const input = { userId: req.user?.id };
  const validation = userSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findCustomers(validation.data);
  res.status(200).json({ data, success: true });
};

export const findCustomerByIdController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    userId: req.user?.id,
  };
  const validation = customerSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await findCustomerById(validation.data);
  res.status(200).json({ data, success: true });
};

export const createCustomerController = async (req: Request, res: Response) => {
  const input = {
    payload: req.body,
    userId: req.user?.id,
  };
  const validation = createCustomerSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  const data = await createCustomer(validation.data);
  res.status(201).json({ data, success: true });
};

export const updateCustomerController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    payload: req.body,
    userId: req.user?.id,
  };
  const validation = updateCustomerSchema.safeParse(input);
  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);
  const data = await updateCustomer(validation.data);
  res.status(200).json({ data, success: true });
};

export const deleteCustomerController = async (req: Request, res: Response) => {
  const input = {
    customerId: req.params.id,
    userId: req.user?.id,
  };
  const validation = customerSchema.safeParse(input);

  if (!validation.success) throw new ApiError(handleMessageZod(validation.error.message), 400);

  await deleteCustomer(validation.data);
  res.status(200).json({ success: true });
};

export default customersRouter;
