"use client";

import { ClipboardEvent, useActionState, useState } from "react";
import { Icons } from "../ui/icons";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { SubmitButton } from "../ui/submit-button";
import { verifyEmailAction } from "@/actions/verify-email";
import { EMPTY_STATE_FORM } from "@/utils/form-message";

export function EmailVerificationForm() {
    const [state, formAction, pending] = useActionState(
        verifyEmailAction,
        EMPTY_STATE_FORM
    );

    const [pin, setPin] = useState("");

    const formatText = (text: string) => text.toUpperCase().slice(0, 8);

    const handleChange = (e: string) => {
        const newValue = formatText(e);
        setPin(newValue);
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text");
        const formatted = formatText(pasted);
        setPin(formatted);
    };

    return (
        <section className="w-4/5 mt-20 mx-auto h-full flex flex-col items-center">
            <div className="space-y-2">
                <form action={formAction}>
                    <h1 className="text-left">One-Time Password</h1>
                    <InputOTP
                        name="pin"
                        maxLength={8}
                        autoFocus
                        value={pin}
                        onChange={handleChange}
                        onPaste={handlePaste}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                        </InputOTPGroup>
                        <div className="mt-3">
                            <h6 className="text-sm">
                                Please enter the one-time password sent to your
                                email.
                            </h6>
                        </div>
                    </InputOTP>
                    <SubmitButton
                        label="Submit"
                        pending={false}
                        loading={
                            <Icons.spinner className="w-6 h-6 animate-spin" />
                        }
                        className="mt-2"
                    />
                </form>
            </div>
        </section>
    );
}
