"use client";

import { FormState } from "@/utils/form-message";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { toast } from "sonner";

export const useToastMessage = (formState: FormState, redirect?: string) => {
    const prevTimeStamp = useRef(formState.timestamp);
    const router = useRouter();

    const showToast =
        formState.message && formState.timestamp !== prevTimeStamp.current;

    useEffect(() => {
        if (showToast) {
            if (formState.status === "ERROR") toast.error(formState.message);
            else {
                toast.success(formState.message);
                if (redirect)
                    setTimeout(() => {
                        router.push(redirect);
                    }, 1500);
            }

            prevTimeStamp.current = formState.timestamp;
        }
    }, [formState, showToast, redirect, router]);
};
