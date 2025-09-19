import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

const SignUp = () => {
  return (
    <div className="flex w-screen h-screen items-center flex-col justify-center bg-cyan-200 text-black">
      <div className="w-2/5 flex flex-col items-center gap-6 bg-cyan-50 p-10 border-radius-2">
        <h1 className="text-2xl">Sign Up Page</h1>

        <form className="space-y-2">
          <Input placeholder="Username" id="username" />

          <Input placeholder="Email" id="email" />
          <Input placeholder="Password" id="password" />

          <SubmitButton
            className="w-full"
            label="Submit"
            loading={<Icons.spinner className="h-5 w-5 animate-spin" />}
          />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
