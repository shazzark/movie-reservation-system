import type { Metadata } from "next";
import { Navigation } from "../../../component/navigation";
import { Footer } from "../../../component/footer";
import { ConfirmationClient } from "../../../component/booking/confirmation-client";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ seats: string }>;
}

export const metadata: Metadata = {
  title: "Booking Confirmed - CineBook",
  description: "Your movie booking has been confirmed",
};

export default async function ConfirmationPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { seats } = await searchParams;
  const seatIds = seats ? seats.split(",") : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        <ConfirmationClient showtimeId={id} seatIds={seatIds} />
      </main>
      <Footer />
    </div>
  );
}
