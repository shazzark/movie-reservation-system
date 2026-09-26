export function theaterSeatCapacity(rows: number, seatsPerRow: number): number {
  if (!Number.isInteger(rows) || rows < 1 || rows > 40 || !Number.isInteger(seatsPerRow) || seatsPerRow < 1 || seatsPerRow > 40) {
    throw new Error("Theater layout must use whole numbers from 1 to 40.");
  }
  return rows * seatsPerRow;
}

export function validateMovieRemoval(hasShowtimeReferences: boolean, hasBookingReferences: boolean): void {
  if (hasShowtimeReferences || hasBookingReferences) {
    throw new Error("Cannot permanently delete a movie with showtimes or reservations. Deactivate it instead.");
  }
}

export function validateTheaterEdit(layoutChanged: boolean, hasShowtimeReferences: boolean): void {
  if (layoutChanged && hasShowtimeReferences) {
    throw new Error("Seat layout cannot change while showtimes refer to this theater.");
  }
}

export function validateTheaterRemoval(hasShowtimeReferences: boolean, hasBookingReferences: boolean): void {
  if (hasShowtimeReferences || hasBookingReferences) {
    throw new Error("Cannot delete a theater referenced by showtimes or reservations.");
  }
}

export function validateNewShowtimeDate(startTime: Date, now = new Date()): void {
  if (!Number.isFinite(startTime.getTime()) || startTime <= now) throw new Error("Showtime must be in the future.");
}

export function validateShowtimeEdit(currentStart: Date, nextStart: Date | undefined, reservationCount: number, now = new Date()): void {
  if (currentStart <= now) throw new Error("Past showtimes cannot be edited.");
  if (nextStart) {
    validateNewShowtimeDate(nextStart, now);
    if (reservationCount > 0 && nextStart.getTime() !== currentStart.getTime()) {
      throw new Error("Schedule cannot change after reservations exist.");
    }
  }
}

export function validateShowtimeRemoval(startTime: Date, reservationCount: number, now = new Date()): void {
  if (reservationCount > 0) throw new Error("Showtime cannot be removed while reservation records refer to it.");
  if (startTime <= now) throw new Error("Past showtimes are retained for history.");
}
