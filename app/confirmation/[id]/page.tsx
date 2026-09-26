import type { Metadata } from "next";
import { CustomerShell } from "@/component/layout/customer-shell";
import { ConfirmationClient } from "../../../component/booking/confirmation-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Booking Confirmed - CineBook",
  description: "Your movie booking has been confirmed",
};

export default async function ConfirmationPage({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <CustomerShell>
      <ConfirmationClient bookingId={id} />
    </CustomerShell>
  );
}
