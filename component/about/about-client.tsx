import Image from "next/image";
import { Armchair, Clapperboard, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

const capabilities = [
  {
    icon: Clapperboard,
    title: "Discover screenings",
    description: "Browse active movies and upcoming showtimes saved in CineBook.",
  },
  {
    icon: Armchair,
    title: "Reserve real seats",
    description: "Choose from a theater's configured layout. Seat availability and price are checked on the server when you confirm.",
  },
  {
    icon: ShieldCheck,
    title: "Manage the catalog",
    description: "Administrators manage movies, theaters, showtimes, and reservations through a protected CMS.",
  },
];

export function AboutClient() {
  return (
    <div>
      <section className="bg-linear-to-b from-card to-background py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-4">About CineBook</Badge>
          <h1 className="mb-6 text-4xl font-bold text-foreground sm:text-5xl">
            A movie reservation system
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            CineBook is a portfolio project for exploring movie discovery, seat selection, and database-backed reservations. Its customer experience and admin CMS use the same movie, theater, showtime, and booking records.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            What CineBook demonstrates
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full border-border p-6">
                <Icon className="mb-4 size-9 text-primary" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
            Payments, email delivery, and live seat updates are not part of this demo. A confirmed reservation records a booking; it does not collect payment.
          </p>
        </div>
      </section>

      <section aria-labelledby="tmdb-attribution" className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:gap-8">
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="The Movie Database (TMDB)">
            <Image
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
              alt="TMDB"
              width={76}
              height={76}
              unoptimized
              className="size-16"
            />
          </a>
          <div>
            <h2 id="tmdb-attribution" className="text-lg font-semibold">Movie metadata attribution</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
              This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
