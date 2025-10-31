import { Request, Response } from "express";
import { UserService } from "../services/user.service";


export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await UserService.getAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ message: "Erro interno ao buscar usuários" });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const user = await UserService.getById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ message: "Erro interno ao buscar usuário" });
  }
};


export const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username e senha são obrigatórios" });
  }

  try {
    const newUser = await UserService.create({ username, password, role });
    return res.status(201).json(newUser);
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    const message =
      error.message === "Usuário já existe"
        ? "Já existe um usuário com esse nome"
        : "Erro interno ao criar usuário";

    return res.status(error.message === "Usuário já existe" ? 409 : 500).json({ message });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  const id = Number(req.params.id);
  const { username, password, role } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const updated = await UserService.update(id, { username, password, role });

    if (!updated) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ message: "Erro interno ao atualizar usuário" });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const deleted = await UserService.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({
      message: `Usuário '${deleted.username}' foi excluído com sucesso.`,
    });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return res.status(500).json({ message: "Erro interno ao excluir usuário" });
  }
};
