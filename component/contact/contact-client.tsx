import Link from "next/link";

export function ContactClient() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">Contact and help</h1>
      <p className="mt-4 text-muted-foreground">
        CineBook is a portfolio demonstration and does not currently provide a
        support inbox or contact form.
      </p>

      <section aria-labelledby="help-heading" className="mt-10 space-y-6">
        <h2 id="help-heading" className="text-xl font-semibold">Using this demo</h2>
        <div>
          <h3 className="font-medium">Does a reservation charge me?</h3>
          <p className="mt-1 text-muted-foreground">No. Reservations do not collect payment.</p>
        </div>
        <div>
          <h3 className="font-medium">Can I cancel a reservation?</h3>
          <p className="mt-1 text-muted-foreground">
            Signed-in users can cancel their own confirmed reservations before
            the screening starts from <Link className="underline underline-offset-4" href="/profile">Booking History</Link>.
          </p>
        </div>
        <div>
          <h3 className="font-medium">Can I reset a forgotten password?</h3>
          <p className="mt-1 text-muted-foreground">Password reset email is not configured in this demo.</p>
        </div>
      </section>
    </div>
  );
}
