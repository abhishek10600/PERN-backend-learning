import express, { Router } from "express";
import productRoutes from "./routes/products";

const app = express();

app.use("/products", productRoutes);

export default app;
