export interface SeedDatabaseState {
  hasBookings?: boolean;
  movies: number;
  showtimes: number;
  theaters: number;
}

export function validateSeedDatabaseState(state: SeedDatabaseState): void {
  if (state.hasBookings || state.movies > 0 || state.showtimes > 0 || state.theaters > 0) {
    throw new Error("Seeding is only available when the catalog is empty.");
  }
}
