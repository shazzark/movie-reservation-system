import Link from "next/link";
import type { Metadata } from "next";
import { CustomerShell } from "@/component/layout/customer-shell";
import { Button } from "@/component/ui/button";
import { Card } from "@/component/ui/card";

export const metadata: Metadata = { title: "Password Help - CineBook" };

export default function ForgotPasswordPage() {
  return (
    <CustomerShell>
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
        <Card className="space-y-4 p-8">
          <h1 className="text-2xl font-bold">Password recovery is unavailable</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Password reset email is not configured for this CineBook demo. No reset message has been sent.
          </p>
          <Button asChild><Link href="/login">Return to sign in</Link></Button>
        </Card>
      </div>
    </CustomerShell>
  );
}
