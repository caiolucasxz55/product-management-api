// src/controllers/product.controller.ts
import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const data = await ProductService.getAll();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Erro ao buscar produtos",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const product = await ProductService.getById(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      message: "Erro ao buscar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;

    // Validações
    if (!name || !price) {
      return res.status(400).json({ message: "Nome e preço são obrigatórios" });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Preço deve ser um número positivo" });
    }

    // Pega o userId do usuário autenticado (vem do middleware de autenticação)
    const userId = req.user?.id ?? null;

    // Caminho da imagem (caso tenha sido enviada)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await ProductService.create({
      name,
      price: numericPrice,
      description: description ?? null,
      imageUrl,
      userId,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "Erro ao criar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, price, description, imageUrl } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const updates: any = {};

    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;

    if (price !== undefined) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res
          .status(400)
          .json({ message: "Preço deve ser um número positivo" });
      }
      updates.price = numericPrice;
    }

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      updates.imageUrl = imageUrl;
    }

    const updated = await ProductService.update(id, updates);

    if (!updated) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      message: "Erro ao atualizar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await ProductService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      message: "Erro ao deletar produto",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
};
