import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 8);
  const userPassword = await bcrypt.hash("user123", 8);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { username: "user1" },
    update: {},
    create: {
      username: "user1",
      password: userPassword,
      role: "USER",
    },
  });
}

main()
  .then(() => console.log("✅ Usuários mockados criados com sucesso!"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
