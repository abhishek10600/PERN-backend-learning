import { Router } from "express";
import {
  createOrder,
  listMyOrders,
  listAllOrders,
} from "../controllers/orders";
import { verifyUser, verifySeller } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validationMiddleware";

// *******This is the best approach*******
// we can create validation using zod.
import { z } from "zod";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      }),
    )
    .min(1),
});

const router = Router();

router.post(
  "/create-order",
  verifyUser,
  validateData(createOrderSchema),
  createOrder,
);

router.get("/my-orders", verifyUser, listMyOrders);
router.get("/all-orders", verifyUser, verifySeller, listAllOrders);

export default router;
