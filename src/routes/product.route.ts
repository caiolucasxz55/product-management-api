// src/routes/product.route.ts
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middlewares/auth.mid";
import { upload } from "../middlewares/upload.mid"; // ← novo import

const router = Router();

// Endpoints públicos
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Endpoints restritos a administradores
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"), 
  createProduct
);

router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
