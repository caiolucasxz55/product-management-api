import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo123";


interface JwtPayloadLite extends JwtPayload {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
}


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadLite;
    }
  }
}


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadLite;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};


export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!req.user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado: apenas administradores podem realizar esta ação" });
  }

  return next();
};
