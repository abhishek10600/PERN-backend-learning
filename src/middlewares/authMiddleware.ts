import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index";
import { usersTable } from "../db/usersSchema";
import { eq } from "drizzle-orm";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
    // console.log(decoded);

    const user = await db
      .select({
        id: usersTable.id,
        email: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, decoded?.id));

    // console.log(user);

    if (user.length === 0) {
      return res.status(401).json({
        success: true,
        message: "access denied",
      });
    }
    // console.log({ user });
    req.user = user[0];
    next();
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    console.log(user);
    const role = user.role;
    console.log(role);
    if (role !== "seller") {
      return res.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }
    next();
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};
