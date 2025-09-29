import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black p-6">
            <Link className="text-white " href="/auth/signup">
                {" "}
                Go to Sign up Page
            </Link>
            <Link className="text-white " href="/auth/verify-email">
                {" "}
                Go to Email verification Page
            </Link>
        </div>
    );
}
