import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.mid";

const router = Router();

// Endpoints públicos (apenas leitura de dados próprios ou listagem para admins)
router.get("/", authenticate, authorizeAdmin, getAllUsers);
router.get("/:id", authenticate, getUserById);

// Endpoints restritos a administradores
router.post("/", authenticate, authorizeAdmin, createUser);
router.put("/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/:id", authenticate, authorizeAdmin, deleteUser);

export default router;
