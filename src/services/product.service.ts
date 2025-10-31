// src/services/product.service.ts
import { prisma } from "../config/prisma";
import { Product, Prisma } from "@prisma/client";

export const ProductService = {
  /**
   * Lista todos os produtos cadastrados.
   */
  getAll: async (): Promise<Product[]> => {
    const products = await prisma.product.findMany({
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return products;
  },

  /**
   * Busca um produto específico pelo ID.
   */
  getById: async (id: number): Promise<Product | null> => {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
    });
    return product;
  },

  /**
   * Cria um novo produto no banco de dados.
   */
  create: async (
    payload: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> => {
    const newProduct = await prisma.product.create({
      data: {
        name: payload.name,
        price: payload.price,
        description: payload.description,
        imageUrl: payload.imageUrl, 
        userId: payload.userId,
      },
      include: {
        user: {
          select: { id: true, username: true, role: true },
        },
      },
    });
    return newProduct;
  },

  /**
   * Atualiza um produto existente.
   */
  update: async (
    id: number,
    payload: Partial<Product>
  ): Promise<Product | null> => {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name: payload.name,
          price: payload.price,
          description: payload.description,
          imageUrl: payload.imageUrl, // ✅ permite atualizar a imagem
          userId: payload.userId,
        },
        include: {
          user: {
            select: { id: true, username: true, role: true },
          },
        },
      });
      return updatedProduct;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null; // Produto não encontrado
      }
      throw error;
    }
  },

  /**
   * Exclui um produto do banco de dados.
   */
  delete: async (id: number): Promise<Product | null> => {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id },
      });
      return deletedProduct;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  },
};
