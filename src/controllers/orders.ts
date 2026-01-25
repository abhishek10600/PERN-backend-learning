import { Request, Response } from "express";
import { db } from "../db/index";
import { orderItemsTable, ordersTable } from "../db/ordersSchema";
import { productsTable } from "../db/productsSchema";
import { eq, inArray } from "drizzle-orm";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productsIds = items.map((item: any) => item.productId);

    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productsIds));

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    const order = await db.transaction(async (tx) => {
      const [createdOrder] = await tx
        .insert(ordersTable)
        .values({ userId })
        .returning();

      const orderItems = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          orderId: createdOrder.id,
          productId: product!.id,
          quantity: item.quantity,
          price: product!.price,
        };
      });

      await tx.insert(orderItemsTable).values(orderItems);

      return createOrder;
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const listMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 1️⃣ Get orders
    const orders = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId));

    // 2️⃣ For each order, get items + product details
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select({
            id: orderItemsTable.id,
            quantity: orderItemsTable.quantity,
            price: orderItemsTable.price,
            product: {
              id: productsTable.id,
              name: productsTable.name,
              image: productsTable.image,
            },
          })
          .from(orderItemsTable)
          .leftJoin(
            productsTable,
            eq(orderItemsTable.productId, productsTable.id),
          )
          .where(eq(orderItemsTable.orderId, order.id));

        return {
          ...order,
          items,
        };
      }),
    );

    res.status(200).json({
      success: true,
      orders: ordersWithItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const listAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await db.select().from(ordersTable);

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
