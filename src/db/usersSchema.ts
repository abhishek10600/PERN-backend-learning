import {
  pgTable,
  integer,
  varchar,
  text,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "seller", "admin"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: userRoleEnum().notNull().default("user"),
  name: varchar({ length: 255 }),
  address: text(),
});
