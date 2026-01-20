import { Request, Response } from "express";

export const listProducts = (req: Request, res: Response) => {
  console.log(process.env.DATABASE_URL);
  res.send("list of all products");
};

export const getProductById = (req: Request, res: Response) => {
  console.log(req.params.id);
  res.send("product by id");
};

export const createProduct = (req: Request, res: Response) => {
  res.send("product created successfully");
};

export const updateProduct = (req: Request, res: Response) => {
  res.send("product updated successfully");
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  res.send("product deleted successfully");
};
