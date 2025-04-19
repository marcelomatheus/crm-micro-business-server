import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { ApiError } from "../utils/api-error";
import {
  createCustomerSchema,
  customerSchema,
  updateCustomerSchema,
} from "../zod-schemas/customers-schema";
import { userSchema } from "../zod-schemas/users-schema";
const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findCustomers = async ({ userId }: UserType) => {
  const customers = await prisma.customers.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });
  return customers;
};

type CustomerType = z.infer<typeof customerSchema>;
export const findCustomerById = async ({ customerId, userId }: CustomerType) => {
  const customer = await prisma.customers.findUnique({
    where: {
      id: customerId,
      userId: userId,
    },
  });
  if (!customer) throw new ApiError("Customer not found", 404);
  return customer;
};

type CreateCustomerType = z.infer<typeof createCustomerSchema>;
export const createCustomer = async ({ payload, userId }: CreateCustomerType) => {
  const customer = await prisma.customers.create({
    data: {
      email: payload.email,
      name: payload.name,
      phone: payload.phone,
      status: payload.status,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return customer;
};

type UpdateCustomerType = z.infer<typeof updateCustomerSchema>;
export const updateCustomer = async ({ customerId, payload, userId }: UpdateCustomerType) => {
  const dataCustomer = await findCustomerById({ customerId, userId });
  const dataUpdated = { ...dataCustomer, ...payload };
  const customer = await prisma.customers.update({
    data: {
      address:
        dataUpdated.address?.city && dataUpdated.address.country && dataUpdated.address.state
          ? {
              set: {
                city: dataUpdated.address.city,
                country: dataUpdated.address.country,
                state: dataUpdated.address.state,
                street: dataUpdated.address.street ?? null,
                zip: dataUpdated.address.zip ?? null,
              },
            }
          : undefined,
      email: dataUpdated.email,
      name: dataUpdated.name,
      phone: dataUpdated.phone,
      status: dataUpdated.status,
    },
    where: {
      id: dataCustomer.id,
      userId: userId,
    },
  });
  return customer;
};

export const deleteCustomer = async ({ customerId, userId }: CustomerType) => {
  await findCustomerById({ customerId, userId });
  const customer = await prisma.customers.delete({
    where: {
      id: customerId,
      userId: userId,
    },
  });
  return customer;
};
