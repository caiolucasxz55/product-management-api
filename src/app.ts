import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

dotenv.config();

const app = express();

// 🔥 CORS - PRIMEIRA COISA SEMPRE
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware explícito para requisições OPTIONS (preflight)
app.options("*", cors());

// 🧩 Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌍 Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// 🩵 Health check
app.get("/", (_req, res) => {
  res.send("🔵 beStorage API — funcionando ✅");
});

app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    cors: process.env.CORS_ORIGIN || "localhost"
  });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

export default app;