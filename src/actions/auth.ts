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
import { formStateToError, toFormState } from "@/utils/form-message";
import { SignUpSchema } from "@/utils/form-schema";
import { redirect } from "next/navigation";

export async function signUpAction(_: ActionResult, data: FormData) {
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

        console.log("the code is", emailVerificationRequest.code);

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

        return toFormState("SUCCESS", "Account created successfully");
        // return redirect("/auth/2fa/setup");
    } catch (error: unknown) {
        console.error("error is", error);
        return formStateToError(error);
    }
}

interface ActionResult {
    message: string;
}
