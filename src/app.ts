import express, { Router } from "express";
import productRoutes from "./routes/products";
import authRoutes from "./routes/auth";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRoutes);
app.use("/auth", authRoutes);

export default app;
