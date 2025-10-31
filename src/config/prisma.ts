import { PrismaClient } from "@prisma/client";

// Singleton para evitar múltiplas instâncias do Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Função para conectar ao banco
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Conectado ao banco de dados com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra o processo se não conseguir conectar
  }
};

// Função para desconectar do banco
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  } catch (error) {
    console.error("Erro ao desconectar:", error);
  }
};