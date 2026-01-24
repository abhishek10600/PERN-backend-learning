import { Request, Response } from "express";
import { db } from "../db/index";
import { usersTable } from "../db/usersSchema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, address, role } = req.body;

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log({ existingUser });

    if (existingUser.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        name,
        address,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        name: usersTable.name,
        address: usersTable.address,
      });

    return res.status(201).json({
      success: true,
      user: createdUser[0],
      message: "user registered successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (user.length === 0) {
      return res.status(401).json({
        success: true,
        message: "user not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user[0].password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "invalid password",
      });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "12d" },
    );

    const { password: _, ...safeUser } = user[0];

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        accessToken: token,
      },
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const registerSeller = async (req: Request, res: Response) => {
  try {
    const { email, name, password, address, role } = req.body;

    const existingSeller = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    console.log({ existingSeller });

    if (existingSeller.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "seller with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdSeller = await db
      .insert(usersTable)
      .values({
        email,
        password: hashedPassword,
        name,
        address,
        role: "seller",
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        name: usersTable.name,
        address: usersTable.address,
      });

    return res.status(201).json({
      success: true,
      user: createdSeller[0],
      message: "seller registered successfully",
    });
  } catch (error: unknown) {
    console.log(error);
    res.status(500).json(error);
  }
};
