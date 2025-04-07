import { createCustomerSchema, customerSchema, updateCustomerSchema } from "@/zod/customers-schema";
import { userSchema } from "@/zod/users-schema";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findCustomers = async ({ userId }: UserType) => {
  const validationSchema = userSchema.safeParse({ userId });
  if (!validationSchema.success) {
    throw new Error(validationSchema.error.message);
  }
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
  const validationSchema = customerSchema.safeParse({ customerId, userId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const customer = await prisma.customers.findUnique({
    where: {
      id: customerId,
      userId: userId,
    },
  });
  if (!customer) throw new Error("Customer not found");
  return customer;
};

type CreateCustomerType = z.infer<typeof createCustomerSchema>;
export const createCustomer = async ({ payload, userId }: CreateCustomerType) => {
  const validationSchema = createCustomerSchema.safeParse({ payload, userId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const customer = await prisma.customers.create({
    data: {
      address: payload.address,
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
  const validationSchema = updateCustomerSchema.safeParse({ customerId, userId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const dataCustomer = await findCustomerById({ customerId, userId });
  const dataUpdated = { ...dataCustomer, ...payload };
  const customer = await prisma.customers.update({
    data: dataUpdated,
    where: {
      id: dataCustomer.id,
      userId: userId,
    },
  });
  return customer;
};

export const deleteCustomer = async ({ customerId, userId }: CustomerType) => {
  const validationSchema = customerSchema.safeParse({ customerId, userId });
  if (!validationSchema.success) throw new Error(validationSchema.error.message);
  const dataCustomer = await findCustomerById({ customerId, userId });
  if (!dataCustomer.id) throw new Error("Customer not found");
  const customer = await prisma.customers.delete({
    where: {
      id: customerId,
      userId: userId,
    },
  });
  return customer;
};
