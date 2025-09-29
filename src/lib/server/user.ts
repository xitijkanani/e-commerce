import { userTable } from "@/db/schema/users";
import { generateRandomRecoveryCode } from "../utils";
import { encryptString } from "./encryption";
import { hashPassword } from "./password";
import db from "@/db";

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
