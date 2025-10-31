import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import productRoutes from "./routes/product.route";
import { errorHandler } from "./middlewares/errorHandler";
import path from "path";

dotenv.config();

const app = express();

// 🧩 Configurações básicas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌍 Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// 🩵 Health check
app.get("/", (_req, res) => {
  res.send(" beStorage API — funcionando ");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

export default app;
