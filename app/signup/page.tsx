import type { Metadata } from "next";
import { SignupClient } from "../../component/auth/signup-client";
import { Suspense } from "react";
import { Loading } from "../../component/ui/loading"; // Import the new component
// @/components/auth/signup-client

export const metadata: Metadata = {
  title: "Sign Up - CineBook",
  description: "Create a new CineBook account to start booking movies",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupClient />
    </Suspense>
  );
}
