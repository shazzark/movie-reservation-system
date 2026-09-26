export class BookingError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BookingError";
    this.status = status;
  }
}

export interface SeatLayout {
  rows: number;
  seatsPerRow: number;
  totalSeats: number;
}

export function rowLabel(index: number): string {
  let value = index + 1;
  let label = "";
  while (value > 0) {
    value -= 1;
    label = String.fromCharCode(65 + (value % 26)) + label;
    value = Math.floor(value / 26);
  }
  return label;
}

export function validateSeatLayout(layout: SeatLayout, showtimeSeats: number): void {
  const { rows, seatsPerRow, totalSeats } = layout;
  if (
    !Number.isSafeInteger(rows) || rows < 1 ||
    !Number.isSafeInteger(seatsPerRow) || seatsPerRow < 1 ||
    !Number.isSafeInteger(totalSeats) || totalSeats !== rows * seatsPerRow ||
    showtimeSeats !== totalSeats
  ) {
    throw new BookingError("Showtime seat layout is not configured correctly", 409);
  }
}

export function validateSeats(input: unknown, layout: SeatLayout): string[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new BookingError("Select at least one seat", 400);
  }
  if (input.length > layout.totalSeats) {
    throw new BookingError("Too many seats selected", 400);
  }

  const valid = new Set<string>();
  for (let row = 0; row < layout.rows; row += 1) {
    for (let seat = 1; seat <= layout.seatsPerRow; seat += 1) {
      valid.add(`${rowLabel(row)}${seat}`);
    }
  }

  const selected = new Set<string>();
  for (const seat of input) {
    if (typeof seat !== "string" || !valid.has(seat)) {
      throw new BookingError("One or more selected seats are invalid", 400);
    }
    if (selected.has(seat)) {
      throw new BookingError("Duplicate seats are not allowed", 400);
    }
    selected.add(seat);
  }
  return [...selected];
}

export function calculateTotalPrice(price: number, seatCount: number): number {
  const cents = Math.round(price * 100);
  if (!Number.isFinite(price) || price <= 0 || Math.abs(cents / 100 - price) > 0.000001 ||
      !Number.isSafeInteger(cents) || !Number.isSafeInteger(seatCount) || seatCount < 1 ||
      !Number.isSafeInteger(cents * seatCount)) {
    throw new BookingError("Showtime price is not configured correctly", 409);
  }
  return (cents * seatCount) / 100;
}

export function bookingOwnerFilter(id: string, userId: string, role: string) {
  return role === "admin" ? { _id: id } : { _id: id, userId };
}
