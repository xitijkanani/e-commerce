"use server";

import { checkEmailAvailability } from "@/lib/server/email";
import {
    createEmailVerificationRequest,
    sendVerificationEmail,
} from "@/lib/server/email-verification";
import {
    createSession,
    generateSessionToken,
    SessionFlags,
    setSessionTokenCookie,
} from "@/lib/server/session";
import { createUser } from "@/lib/server/user";
import { FormState, formStateToError, toFormState } from "@/utils/form-message";
import { SignUpSchema } from "@/utils/form-schema";

export async function signUpAction(_: FormState, data: FormData) {
    try {
        const userData = {
            email: data.get("email"),
            password: data.get("password"),
        };

        const res = SignUpSchema.parse(userData);

        const isEmailAvailable = await checkEmailAvailability(res.email);

        if (!isEmailAvailable)
            return toFormState("ERROR", "Email is already in use");

        const user = await createUser(res.email, res.password);

        const emailVerificationRequest = await createEmailVerificationRequest(
            user.id,
            user.email
        );

        await sendVerificationEmail(
            emailVerificationRequest.email,
            emailVerificationRequest.code
        );

        const sessionFlags: SessionFlags = {
            twoFactorVerified: false,
        };

        const sessionToken = generateSessionToken();
        const session = await createSession(
            sessionToken,
            user.id,
            sessionFlags
        );

        await setSessionTokenCookie(sessionToken, session.expiresAt);

        return toFormState(
            "SUCCESS",
            "Account created successfully",
            "/auth/verify-email"
        );
    } catch (error: unknown) {
        console.error("error is", error);
        return formStateToError(error);
    }
}
