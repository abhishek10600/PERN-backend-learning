import express from "express";
import { loginUser, registerUser, registerSeller } from "../controllers/auth";

const router = express.Router();

import { z } from "zod";
import { validateData } from "../middlewares/validationMiddleware";

const registerUserSchema = z
  .object({
    email: z.email(),
    password: z.string().min(2),
    name: z.string(),
    address: z.string().optional(),
    role: z.enum(["user", "seller", "admin"]).default("user"),
  })
  .strict();

const loginUserSchema = z
  .object({
    email: z.email(),
    password: z.string(),
  })
  .strict();

router.post("/register", validateData(registerUserSchema), registerUser);
router.post(
  "/register-seller",
  validateData(registerUserSchema),
  registerSeller,
);
router.post("/login", validateData(loginUserSchema), loginUser);

export default router;
