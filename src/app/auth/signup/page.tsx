import { SignUp } from "@/components/auth/signup";
import { getCurrentSession } from "@/lib/server/session";
import { redirect } from "next/navigation";

export default async function page() {
    // const { session, user } = await getCurrentSession();

    // if (session !== null) {
    //     if (!user.emailVerified) return redirect("/");
    // }

    return <SignUp />;
}
