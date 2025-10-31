import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

dotenv.config();

const app = express();

console.log('🔵 Iniciando app.ts...');
console.log('🌐 CORS_ORIGIN:', process.env.CORS_ORIGIN || 'não definido');

// 🔥 MIDDLEWARE DE DEBUG - VER TODAS AS REQUISIÇÕES
app.use((req: Request, _res: Response, next: NextFunction): void => {
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('   Origin:', req.headers.origin || 'sem origin');
  next();
});

// 🔥 CORS MANUAL - MODO AGRESSIVO
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin || '*';
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Respondendo OPTIONS para:', req.path);
    res.status(204).end();
    return;
  }
  
  next();
});

// 🔥 CORS biblioteca (redundante, mas garantia)
app.use(cors({
  origin: true, // Aceita qualquer origem
  credentials: true,
  optionsSuccessStatus: 204
}));

console.log('✅ CORS configurado');

// 🧩 Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Body parsers configurados');

// 🌍 Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

console.log('✅ Rotas registradas');

// 🩵 Health check
app.get("/", (_req, res) => {
  res.json({ 
    status: "ok",
    message: "beStorage API — funcionando",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cors: "enabled",
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint para CORS
app.get("/test-cors", (_req, res) => {
  res.json({ message: "CORS está funcionando!" });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

console.log('✅ app.ts configurado completamente');

export default app;