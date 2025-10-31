// src/utils/apiResponse.ts
import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export const sendSuccess = <T>(res: Response, data: T, message = "OK", status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const sendError = (res: Response, message = "Erro interno", status = 500, error?: any) => {
  return res.status(status).json({ success: false, message, error });
};
