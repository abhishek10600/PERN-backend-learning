import { Router } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products";
import { validateData } from "../middlewares/validationMiddleware";

// *******This is the best approach*******
// we can create validation using zod.
import { z } from "zod";
import { verifyUser, verifySeller } from "../middlewares/authMiddleware";

const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number({ message: "price must be a number" }),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number({ message: "price must be a number" }).optional(),
});

// creating validation schema using the table schema using drizzle-zod (only for learning)

// drizzle-zod is required only if we use this.
// import { createInsertSchema, createSelectSchema } from "drizzle-zod";
// import { productsTable } from "../db/productsSchema";
// import { z } from "zod";

// const createProductSchema = createInsertSchema(productsTable).omit({
//   id: true,
// });

// type ProductType = z.infer<typeof createProductSchema>;

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  validateData(createProductSchema),
  verifyUser,
  verifySeller,
  createProduct,
);
router.put("/:id", validateData(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);
export default router;
