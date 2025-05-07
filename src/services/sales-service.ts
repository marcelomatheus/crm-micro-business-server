import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { ApiError } from "../utils/api-error";
import { createSalesSchema, salesSchema, updateSalesSchema } from "../zod-schemas/sales-schema";
import { userSchema } from "../zod-schemas/users-schema";

const prisma = new PrismaClient();

type UserType = z.infer<typeof userSchema>;
export const findSales = async ({ userId }: UserType) => {
  const sales = await prisma.sales.findMany({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    where: {
      userId: userId,
    },
  });

  const salesWithProducts = await prisma.salesProduct.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      sales: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        select: {
          createdAt: true,
          id: true,
          rating: true,
          total: true,
        },
      },
    },
    where: {
      salesId: {
        in: sales.map((sale: { id: string }) => sale.id),
      },
    },
  });

  return salesWithProducts;
};

type SalesType = UserType & z.infer<typeof salesSchema>;
export const findSaleById = async ({ customerId, userId }: SalesType) => {
  const validationSchema = salesSchema.safeParse({ customerId, userId });
  if (!validationSchema.success) throw new ApiError(validationSchema.error.message);
  const sale = await prisma.sales.findUnique({
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      id: customerId,
      userId: userId,
    },
  });
  if (!sale) throw new ApiError("Venda não encontrada", 404);
  return sale;
};

type CreateSalesType = UserType & z.infer<typeof createSalesSchema>;
export const createSales = async ({ payload, userId }: CreateSalesType) => {
  const dataValidation = createSalesSchema.safeParse({ payload, userId });
  if (!dataValidation.success) throw new ApiError(dataValidation.error.message);

  const sale = await prisma.sales.create({
    data: {
      customer: {
        connect: {
          id: payload.customerId,
        },
      },
      rating: payload.rating,
      total: payload.total,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  const saleProducts = await prisma.salesProduct.createMany({
    data: payload.products.map((product) => {
      return {
        productId: product.id,
        quantity: product.quantity,
        salesId: sale.id,
      };
    }),
  });

  return saleProducts;
};

interface productType {
  id?: string | undefined;
  quantity?: number | undefined;
}

type UpdateSalesType = UserType & z.infer<typeof updateSalesSchema>;
export const updateSales = async ({ customerId, payload, userId }: UpdateSalesType) => {
  const dataSale = await findSaleById({ customerId, userId });
  const dataUpdated = { ...dataSale, ...payload };

  const sale = await prisma.sales.update({
    data: {
      customer: {
        connect: {
          id: dataUpdated.customerId,
        },
      },
      rating: dataUpdated.rating,
      total: dataUpdated.total,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    where: {
      id: dataSale.id,
    },
  });
  if (!dataUpdated.products) {
    new ApiError("Não há produtos nesta venda", 400);
    return;
  }
  const saleProducts = await prisma.salesProduct.updateMany({
    data: dataUpdated.products.map((product: productType | undefined) => {
      return {
        productId: product?.id,
        quantity: product?.quantity,
        salesId: sale.id,
      };
    }),
  });

  return saleProducts;
};

export const deleteSales = async ({ customerId, userId }: SalesType) => {
  const validationSchema = salesSchema.safeParse({ customerId, userId });
  if (!validationSchema.success) throw new ApiError(validationSchema.error.message);
  const sale = await prisma.sales.delete({
    where: {
      id: customerId,
      userId: userId,
    },
  });
  return sale;
};
