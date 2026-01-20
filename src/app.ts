import express, { Router } from "express";
import productRoutes from "./routes/products";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRoutes);

export default app;
