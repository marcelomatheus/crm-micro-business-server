import { Request, Response } from "express";

export function errorHandler(
  err: { message?: string; stack?: string; status?: number },
  req: Request,
  res: Response,
) {
  console.error(`[Error] ${req.method} ${req.originalUrl}`, err);

  const status = err.status ?? 500;
  const message = err.message ?? "Internal Server Error";

  res.status(status).json({
    error: {
      message,
    },
    success: false,
  });
}
