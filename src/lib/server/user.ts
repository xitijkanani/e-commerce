import { userTable } from "@/db/schema/users";
import { generateRandomRecoveryCode } from "../utils";
import { encryptString } from "./encryption";
import { hashPassword } from "./password";
import db from "@/db";
import { and, eq } from "drizzle-orm";

export async function createUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);

    const row = await db
        .insert(userTable)
        .values({
            email: email,
            password: hashedPassword,
            recoveryCode: encryptedRecoveryCode,
        })
        .returning();

    if (row.length === 0 || row === null) throw new Error("Unexpected Error");

    const user = {
        id: row[0].id,
        email: row[0].email,
        isVerified: false,
        registered2FA: false,
    };

    return user;
}

export async function updateUserPassword(userId: number, password: string) {
    const passwordHash = await hashPassword(password);

    await db
        .update(userTable)
        .set({ password: passwordHash })
        .where(eq(userTable.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(
    userId: number,
    email: string
) {
    await db
        .update(userTable)
        .set({ email: email, emailVerified: true })
        .where(eq(userTable.id, userId));
}

export async function setUserEmailVerifiedIfEmailMatches(
    userId: number,
    email: string
) {
    const result = await db
        .update(userTable)
        .set({ emailVerified: true })
        .where(and(eq(userTable.id, userId), eq(userTable.email, email)))
        .returning();

    return result.length > 0;
}
