import { z } from "zod";

export const SignUpSchema = z.object({
    email: z.email("Please Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(
            new RegExp(".*[A-Z].*"),
            "Password must contain at least one uppercase letter"
        )
        .regex(
            new RegExp(".*[a-z].*"),
            "Password must contain at least one lowercase letter"
        )
        .regex(
            new RegExp(".*\\d.*"),
            "Password must contain at least one number"
        )
        .regex(
            new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
            "Password must contain at least one special character"
        ),
});

export const EmailVerifySchema = z
    .string()
    .min(8, "Code must be 8 characters long")
    .max(8, "Code must be 8 characters long")
    .regex(new RegExp("^[A-Z0-9]+$"), "Invalid Code");
