// src/services/user.service.ts
import { prisma } from "../config/prisma";
import { User, Prisma, Role } from "@prisma/client";
import { hashPassword } from "../config/securityConfig";

export const UserService = {
  /**
   * Retorna todos os usuários cadastrados (sem senha).
   */
  getAll: async (): Promise<Omit<User, "password">[]> => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  },

  /**
   * Retorna um usuário específico pelo ID (sem senha).
   */
  getById: async (id: number): Promise<Omit<User, "password"> | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  },

  /**
   * Busca um usuário pelo nome de usuário (com senha, usado no login).
   */
  getByUsername: async (username: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user;
  },

  /**
   * Cria um novo usuário com senha criptografada.
   */
  create: async (payload: {
    username: string;
    password: string;
    role?: Role;
  }): Promise<Omit<User, "password">> => {
    // Verifica se já existe um usuário com o mesmo nome
    const existing = await prisma.user.findUnique({
      where: { username: payload.username },
    });
    if (existing) {
      throw new Error("Usuário já existe");
    }

    // Hash da senha antes de salvar
    const hashedPassword = await hashPassword(payload.password);

    const newUser = await prisma.user.create({
      data: {
        username: payload.username,
        password: hashedPassword,
        role: payload.role || "USER",
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  },

  /**
   * Atualiza os dados de um usuário existente.
   */
  update: async (
    id: number,
    payload: Partial<{ username: string; password: string; role: Role }>
  ): Promise<Omit<User, "password"> | null> => {
    try {
      const dataToUpdate: Partial<User> = {};

      if (payload.username) dataToUpdate.username = payload.username;
      if (payload.password) dataToUpdate.password = await hashPassword(payload.password);
      if (payload.role) dataToUpdate.role = payload.role;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null; // Usuário não encontrado
      }
      throw error;
    }
  },

  /**
   * Exclui um usuário pelo ID.
   */
  delete: async (id: number): Promise<Omit<User, "password"> | null> => {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return deletedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw error;
    }
  },

  /**
   * Garante que existam usuários iniciais (admin e user1).
   */
  ensureInitialUsers: async (): Promise<void> => {
    const adminExists = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!adminExists) {
      await UserService.create({
        username: "admin",
        password: "admin123",
        role: "ADMIN",
      });
      console.log("👑 Usuário administrador criado (admin / admin123)");
    }

    const userExists = await prisma.user.findUnique({
      where: { username: "user1" },
    });

    if (!userExists) {
      await UserService.create({
        username: "user1",
        password: "user123",
        role: "USER",
      });
      console.log("👤 Usuário padrão criado (user1 / user123)");
    }
  },
};
