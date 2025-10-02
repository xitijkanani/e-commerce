import { useState, useActionState } from "react";
import { useToastMessage } from "@/hooks/useToastMessage";
import { signUpAction } from "@/actions/auth";
import { EMPTY_STATE_FORM } from "@/utils/form-message";
import { Input } from "../ui/input";
import { SubmitButton } from "../ui/submit-button";
import { FieldError } from "../ui/field-error";
import { Icons } from "../ui/icons";
import { EyeOffIcon, EyeIcon } from "lucide-react";

export function LoginForm() {
    const [state, formAction, pending] = useActionState(
        signUpAction,
        EMPTY_STATE_FORM
    );

    const [isVisible, setIsVisible] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });

    useToastMessage(state);

    return (
        <div className="w-screen mx-auto  h-screen flex flex-col justify-center items-center bg-[#f5f7f9]">
            <section className="bg-white flex flex-col items-center justify-center gap-7 w-[25%] py-10 rounded-lg shadow-lg">
                <div className="text-left w-4/5 py-5">
                    <h1 className="text-[#555] font-light">
                        Please Enter your details
                    </h1>
                    <h1 className="font-bold text-4xl text-header">
                        Welcome Back
                    </h1>
                </div>
                <form
                    action={formAction}
                    className="w-[400px] flex flex-col items-center space-y-4"
                >
                    <div className="flex flex-col gap-y-4 w-4/5">
                        <div>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formValues.email}
                                onChange={(e) =>
                                    setFormValues({
                                        ...formValues,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <FieldError formState={state} name="username" />
                        </div>
                        <div>
                            <div className="flex items-center">
                                <Input
                                    type={isVisible ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formValues.password}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            password: e.target.value,
                                        })
                                    }
                                />
                                <span
                                    className="-ml-10 cursor-pointer"
                                    onClick={() => setIsVisible((val) => !val)}
                                >
                                    {isVisible ? (
                                        <EyeOffIcon className="h-6 e-6" />
                                    ) : (
                                        <EyeIcon className="h-6 w-6" />
                                    )}
                                </span>
                            </div>
                            <FieldError formState={state} name="password" />
                        </div>
                    </div>

                    <div className="w-4/5">
                        <SubmitButton
                            label="Sign up"
                            pending={pending}
                            loading={
                                <Icons.spinner className="w-6 h-6 animate-spin" />
                            }
                            className="bg-[#3a7ff9] w-full hover:bg-[#236bdd]"
                        />
                    </div>
                </form>
            </section>
        </div>
    );
}
