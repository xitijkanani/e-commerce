"use server";

import { getEmailVerificationRequestFromRequest } from "@/lib/server/email-verification";
import { getCurrentSession } from "@/lib/server/session";
import { formStateToError, toFormState } from "@/utils/form-message";

export async function verifyEmailAction(
    _prev: ActionResult,
    formData: FormData
) {
    try {
        const code = formData.get("pin");

        const { session, user } = await getCurrentSession();

        if (session === null) return toFormState("ERROR", "Not Authenticated");

        let verificatioRequest = await getEmailVerificationRequestFromRequest();

        if (verificatioRequest === null)
            return toFormState("ERROR", "Not Authenticated");

        return toFormState("SUCCESS", "Success");
    } catch (err: unknown) {
        return formStateToError(err);
    }
}

interface ActionResult {
    message: string;
}
