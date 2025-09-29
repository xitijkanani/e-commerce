import { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    customType,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

const bytea = customType<{
    data: Uint8Array;
    notNull: false;
    default: false;
}>({
    dataType() {
        return "bytea";
    },
});

export const userTable = pgTable("users", {
    id: serial().primaryKey(),
    email: text().notNull().unique(),
    password: text(),
    picture: text(),
    createdAt: timestamp().defaultNow(),
    emailVerified: boolean().default(false),
    totpKey: bytea(),
    recoveryCode: bytea().notNull(),
    googleId: text(),
});

export const emailVerificationRequestTable = pgTable(
    "email_verification_request",
    {
        id: text().primaryKey(),
        userId: integer()
            .notNull()
            .references(() => userTable.id, {
                onUpdate: "cascade",
                onDelete: "cascade",
            }),
        email: text().notNull(),
        code: text().notNull(),
        expiresAt: timestamp("expires_at", {
            withTimezone: true,
            mode: "date",
        }).notNull(),
    }
);

export const sessionTable = pgTable("session", {
    id: text().primaryKey(),
    userId: integer()
        .notNull()
        .references(() => userTable.id, {
            onUpdate: "cascade",
            onDelete: "cascade",
        }),
    expiresAt: timestamp("expires_at", {
        withTimezone: true,
        mode: "date",
    }).notNull(),
    twoFactorVerified: boolean().default(false),
});

export type User = InferSelectModel<typeof userTable>;
export type EmailVerificationRequest = InferSelectModel<
    typeof emailVerificationRequestTable
>;
export type Session = InferSelectModel<typeof sessionTable>;
