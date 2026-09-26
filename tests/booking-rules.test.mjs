import test from "node:test";
import assert from "node:assert/strict";
import {
  BookingError,
  bookingOwnerFilter,
  calculateTotalPrice,
  rowLabel,
  validateSeatLayout,
  validateSeats,
} from "../lib/booking-rules.ts";
import {
  theaterSeatCapacity,
  validateNewShowtimeDate,
  validateShowtimeEdit,
  validateShowtimeRemoval,
} from "../lib/admin-cms-rules.ts";

const layout = { rows: 2, seatsPerRow: 3, totalSeats: 6 };

test("a valid booking selection uses the theater's actual seat grid and server price", () => {
  assert.doesNotThrow(() => validateSeatLayout(layout, 6));
  const seats = validateSeats(["A1", "B3"], layout);
  assert.deepEqual(seats, ["A1", "B3"]);
  assert.equal(calculateTotalPrice(12.75, seats.length), 25.5);
});

test("empty, duplicate, malformed, and out-of-layout seats are rejected", () => {
  for (const seats of [[], ["A1", "A1"], ["C1"], ["A4"], ["A01"], [42]]) {
    assert.throws(() => validateSeats(seats, layout), BookingError);
  }
});

test("a changed or invalid theater layout cannot be booked", () => {
  assert.throws(() => validateSeatLayout(layout, 5), /layout/);
  assert.throws(() => validateSeatLayout({ ...layout, totalSeats: 5 }, 5), /layout/);
});

test("seat labels beyond row Z remain unique", () => {
  assert.equal(rowLabel(25), "Z");
  assert.equal(rowLabel(26), "AA");
  assert.deepEqual(validateSeats(["AA1"], { rows: 27, seatsPerRow: 1, totalSeats: 27 }), ["AA1"]);
});

test("the server rejects invalid ticket prices", () => {
  for (const price of [0, -1, 1.234, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateTotalPrice(price, 1), BookingError);
  }
});

test("normal users are scoped to their own booking; admins may access any", () => {
  assert.deepEqual(bookingOwnerFilter("booking-id", "user-id", "user"), { _id: "booking-id", userId: "user-id" });
  assert.deepEqual(bookingOwnerFilter("booking-id", "admin-id", "admin"), { _id: "booking-id" });
});

test("theater capacity is derived from bounded integer layout dimensions", () => {
  assert.equal(theaterSeatCapacity(8, 12), 96);
  assert.throws(() => theaterSeatCapacity(0, 12), /whole numbers/);
  assert.throws(() => theaterSeatCapacity(2.5, 12), /whole numbers/);
});

test("showtime dates and edits preserve existing reservations", () => {
  const now = new Date("2030-01-01T00:00:00Z");
  const start = new Date("2030-01-02T00:00:00Z");
  assert.doesNotThrow(() => validateNewShowtimeDate(start, now));
  assert.throws(() => validateNewShowtimeDate(now, now), /future/);
  assert.doesNotThrow(() => validateShowtimeEdit(start, undefined, 2, now));
  assert.throws(() => validateShowtimeEdit(start, new Date("2030-01-03T00:00:00Z"), 1, now), /reservations/);
  assert.throws(() => validateShowtimeEdit(new Date("2029-12-31T00:00:00Z"), undefined, 0, now), /Past/);
});

test("showtimes are removable only before they start and without reservation references", () => {
  const now = new Date("2030-01-01T00:00:00Z");
  assert.doesNotThrow(() => validateShowtimeRemoval(new Date("2030-01-02T00:00:00Z"), 0, now));
  assert.throws(() => validateShowtimeRemoval(new Date("2030-01-02T00:00:00Z"), 1, now), /reservation records/);
  assert.throws(() => validateShowtimeRemoval(new Date("2029-12-31T00:00:00Z"), 0, now), /history/);
});
