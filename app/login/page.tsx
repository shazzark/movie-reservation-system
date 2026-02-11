import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginClient } from "../../component/auth/login-client";
import { Loading } from "../../component/ui/loading"; // Import the new component

export const metadata: Metadata = {
  title: "Sign In - CineBook",
  description: "Sign in to your CineBook account",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClient />
    </Suspense>
  );
}
