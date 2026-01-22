import { Request, Response } from "express";
import { db } from "../db/index";
import { productsTable } from "../db/productsSchema";
import { eq } from "drizzle-orm";

export const listProducts = async (req: Request, res: Response) => {
  try {
    // partial select where we can specify which feilds we want from the table
    // const products = await db
    //   .select({
    //     id: productsTable.id,
    //     name: productsTable.name,
    //   })
    //   .from(productsTable);
    // res.status(200).json({
    //   products,
    // });

    //select all from the table
    const products = await db.select().from(productsTable);
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "invalid product id",
      });
    }
    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));
    if (product.length === 0) {
      res.status(404).json({
        success: false,
        message: "product with this id not found",
      });
    }

    res.status(200).json({
      success: true,
      product: product[0],
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;
    const product = await db
      .insert(productsTable)
      .values({
        name,
        description,
        price,
      })
      .returning();

    // console.log(product);

    return res.status(201).json({
      success: true,
      product: product[0],
      message: "product created successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body;
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "invalid product id",
      });
    }

    const updatedProduct = await db
      .update(productsTable)
      .set({
        name,
        description,
        price,
      })
      .where(eq(productsTable.id, productId))
      .returning();

    if (updatedProduct.length === 0) {
      res.status(404).json({
        successs: false,
        message: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: updatedProduct[0],
      message: "product updated successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      res.status(400).json({
        success: false,
        message: "invalid product id",
      });
    }

    const deletedProduct = await db
      .delete(productsTable)
      .where(eq(productsTable.id, productId))
      .returning();

    if (deletedProduct.length === 0) {
      res.status(404).json({
        success: false,
        message: "product was not found",
      });
    }

    res.status(204).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};
