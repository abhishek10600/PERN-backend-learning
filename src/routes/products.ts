import { Router } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
} from "../controllers/products";

const router = Router();

router.get("/", listProducts);

router.get("/:id", getProductById);

router.post("/", createProduct);

export default router;
