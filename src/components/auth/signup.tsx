import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import { SubmitButton } from "../ui/submit-button";

export const SignUp = () => {
  return (
    <div className="w-screen mx-auto  h-screen flex flex-col justify-center items-center bg-[#f5f7f9]">
      <section className="bg-white flex flex-col items-center justify-center gap-7 w-[25%] py-10 rounded-lg shadow-lg">
        <div className="text-left w-4/5 py-5">
          <h1 className="text-[#555] font-light">Please Enter your details</h1>
          <h1 className="font-bold text-4xl">Welcome Back</h1>
        </div>

        <div className="flex flex-col gap-y-4 w-4/5">
          <Input type="email" name="email" placeholder="Email address" />
          <Input type="password" name="password" placeholder="Password" />
        </div>

        <div className="w-4/5">
          <SubmitButton
            label="Sign up"
            loading={<Icons.spinner className="w-6 h-6 animate-spin" />}
            className="bg-[#3a7ff9] w-full hover:bg-[#3a7ff0]"
          />
        </div>
      </section>
    </div>
  );
};
