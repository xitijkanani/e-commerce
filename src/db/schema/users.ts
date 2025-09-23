import { InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: serial().primaryKey(),
  email: text().notNull().unique(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  password: text(),
  picture: text(),
  createdAt: timestamp().defaultNow(),
  emailVerified: boolean().default(false),
  isConnectedToGoogle: boolean().default(false),
  googleId: text(),
});

export type User = InferSelectModel<typeof userTable>;
