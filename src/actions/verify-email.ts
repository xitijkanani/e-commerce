"use server";

import {
    createEmailVerificationRequest,
    deleteEmailVerificationRequestCookie,
    deleteEmailVerificationRequests,
    getEmailVerificationRequestFromRequest,
    sendVerificationEmail,
    setEmailVerificationRequestCookie,
} from "@/lib/server/email-verification";
import { getCurrentSession } from "@/lib/server/session";
import { updateUserEmailAndSetEmailAsVerified } from "@/lib/server/user";
import { FormState, formStateToError, toFormState } from "@/utils/form-message";
import { EmailVerifySchema } from "@/utils/form-schema";

export async function verifyEmailAction(_prev: FormState, formData: FormData) {
    try {
        const otp = formData.get("pin");

        const { session, user } = await getCurrentSession();

        if (session === null)
            return toFormState("ERROR", "Not Authenticated", "/auth/login");

        let verificationRequest =
            await getEmailVerificationRequestFromRequest();

        if (verificationRequest === null)
            return toFormState("ERROR", "Not Authenticated", "/auth/login");

        const code = EmailVerifySchema.parse(otp);

        if (Date.now() >= verificationRequest.expiresAt.getTime()) {
            verificationRequest = await createEmailVerificationRequest(
                verificationRequest.userId,
                verificationRequest.email
            );
            await sendVerificationEmail(
                verificationRequest.email,
                verificationRequest.code
            );

            return toFormState(
                "ERROR",
                "The verification code was expired. We sent another code to your inbox."
            );
        }

        if (verificationRequest.code !== code)
            return toFormState("ERROR", "Incorrect code. Please Try again");

        await deleteEmailVerificationRequests(user.id);
        await updateUserEmailAndSetEmailAsVerified(
            user.id,
            verificationRequest.email
        );
        await deleteEmailVerificationRequestCookie();

        return toFormState("SUCCESS", "You are verified!", "/");
    } catch (err: unknown) {
        return formStateToError(err);
    }
}

export async function resendEmailVerificationCodeAction() {
    try {
        const { session, user } = await getCurrentSession();

        if (session === null)
            return toFormState("ERROR", "Not Authenticated", "/auth/login");

        let verificationRequest =
            await getEmailVerificationRequestFromRequest();

        if (verificationRequest === null) {
            if (user.emailVerified)
                return toFormState("ERROR", "Forbidden", "/");

            verificationRequest = await createEmailVerificationRequest(
                user.id,
                user.email
            );
        } else {
            verificationRequest = await createEmailVerificationRequest(
                user.id,
                user.email
            );
        }

        await sendVerificationEmail(
            verificationRequest.email,
            verificationRequest.code
        );
        await setEmailVerificationRequestCookie(verificationRequest);

        return toFormState("SUCCESS", "A new code was sent to your inbox!");
    } catch (err: unknown) {
        return formStateToError(err);
    }
}
