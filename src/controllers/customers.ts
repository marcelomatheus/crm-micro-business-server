import express from "express";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
const customersRouter = express.Router();
import { requestAuthorization } from "@/middlewares/request-authorization";
import {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  findCustomers,
  updateCustomer,
} from "@/services/customers-service";

customersRouter.get(
  "/",
  requestAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const data = await findCustomers(req.header.arguments.userId);
    res.status(200).json({ data, success: true });
  }),
);

customersRouter.get(
  "/:id",
  requestAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const { id: customerId } = req.params;
    const userId = req.header.arguments.userId;
    const data = await findCustomerById({ customerId, userId });
    res.status(200).json({ data, success: true });
  }),
);

customersRouter.post(
  "/",
  requestAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const userId = req.header.arguments.userId;
    const data = await createCustomer({ payload, userId });
    res.status(201).json({ data, success: true });
  }),
);

customersRouter.put(
  "/:id",
  requestAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const { id: customerId } = req.params;
    const userId = req.header.arguments.userId;
    const data = await updateCustomer({ customerId, payload, userId });
    res.status(200).json({ data, success: true });
  }),
);

customersRouter.delete(
  "/:id",
  requestAuthorization,
  asyncHandler(async (req: Request, res: Response) => {
    const { id: customerId } = req.params;
    const userId = req.header.arguments.userId;
    await deleteCustomer({ customerId, userId });
    res.status(200).json({ success: true });
  }),
);

export default customersRouter;
