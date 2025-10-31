
import dotenv from "dotenv";
import { connectDatabase, prisma } from "./config/prisma";
import { applySecurityConfig } from "./config/securityConfig";
import app from "./app";
import express from "express";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3001;
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://localhost:3001", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.options("*", cors());


app.use(express.json());

async function startServer() {
  try {
    // 🔄 Aplica migrations automaticamente em ambiente de desenvolvimento
    if (process.env.NODE_ENV !== "production") {
      console.log("🔄 Aplicando migrations do Prisma...");
      const { execSync } = await import("child_process");
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    }
    // 🔐 Configura middlewares de segurança globais
    applySecurityConfig(app);

    // 🌐 Conecta ao banco de dados
    await connectDatabase();

    // 🚀 Inicia o servidor
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// 🧹 Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n👋 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n👋 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export default app;
