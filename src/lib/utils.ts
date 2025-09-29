import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    encodeBase32LowerCaseNoPadding,
    encodeBase32UpperCaseNoPadding,
} from "@oslojs/encoding";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateRandomOTP() {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);

    const code = encodeBase32UpperCaseNoPadding(bytes);
    return code;
}

export function generateRandomRecoveryCode() {
    const recoveryCodeBytes = new Uint8Array(10);
    crypto.getRandomValues(recoveryCodeBytes);

    const recoveryCode = encodeBase32LowerCaseNoPadding(recoveryCodeBytes);
    return recoveryCode;
}
