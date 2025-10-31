// src/config/securityConfig.ts
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"
import { Express } from "express"


const JWT_SECRET = process.env.JWT_SECRET || "segredo123"
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"]
const SALT_ROUNDS = 10

export interface JwtPayloadLite extends JwtPayload {
  id: number
  username: string
  role: string
}

export const signJwt = (payload: JwtPayloadLite): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN }
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, options)
}

export const verifyJwt = (token: string): JwtPayloadLite => {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayloadLite
}

export const hashPassword = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(plain, salt)
}

export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash)
}


export const applySecurityConfig = (app: Express) => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  )

  
  app.use(
  cors({
    origin: "*", // Libera para todos os domínios (somente para desenvolvimento)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
  })
  app.use("/api", limiter)

}
