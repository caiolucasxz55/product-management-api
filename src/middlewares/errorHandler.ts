// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Erro capturado:", err);

  const status = err.status || 500;
  const message = err.message || "Erro interno do servidor";
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  return sendError(res, message, status, stack);
};
