import db from "@/db";
import {
    EmailVerificationRequest,
    emailVerificationRequestTable,
} from "@/db/schema/users";
import { encodeBase32 } from "@oslojs/encoding";
import { and, eq } from "drizzle-orm";
import { generateRandomOTP } from "../utils";
import { cookies } from "next/headers";
import { getCurrentSession } from "./session";

export async function getEmailVerificationRequest(userId: number, id: string) {
    const row = await db
        .select()
        .from(emailVerificationRequestTable)
        .where(
            and(
                eq(emailVerificationRequestTable.id, id),
                eq(emailVerificationRequestTable.userId, userId)
            )
        );

    if (row.length === 0) return null;

    return row[0];
}

export async function createEmailVerificationRequest(
    userId: number,
    email: string
) {
    await deleteEmailVerificationRequests(userId);

    const idBytes = new Uint8Array(20);
    crypto.getRandomValues(idBytes);
    const id = encodeBase32(idBytes).toLowerCase();

    const code = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    const row = await db
        .insert(emailVerificationRequestTable)
        .values({ id, userId, code, email, expiresAt })
        .returning();

    return row[0];
}

export async function deleteEmailVerificationRequests(userId: number) {
    await db
        .delete(emailVerificationRequestTable)
        .where(eq(emailVerificationRequestTable.userId, userId));
}

export async function sendVerificationEmail(email: string, code: string) {
    console.log(`Sending verification email to ${email} with code: ${code}`);
}

export async function setEmailVerificationRequestCookie(
    request: EmailVerificationRequest
) {
    (await cookies()).set("email_verification", request.id, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: request.expiresAt,
    });
}

export async function deleteEmailVerificationRequestCookie() {
    (await cookies()).set("email_verification", "", {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
    });
}

export async function getEmailVerificationRequestFromRequest() {
    const { user } = await getCurrentSession();
    if (user === null) return null;

    const id = (await cookies()).get("email_verification")?.value ?? null;
    if (id === null) return null;

    const request = await getEmailVerificationRequest(user.id, id);
    if (request === null) await deleteEmailVerificationRequestCookie();

    return request;
}

// export const sendVerificationEmailBucket = new Expiring
