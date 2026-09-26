export type Showtime = {
  _id: string; // MongoDB ObjectId as a string
  movieId: string;
  theaterId: string;
  startTime: Date | string;
  price: number;
  format: string;
  totalSeats: number;
  bookedSeats: string[]; // e.g., ["A1", "A2"]
  theaterName?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ShowtimeDetails = {
  showtime: Showtime & { pricePerSeat: number };
  theater: import("./theater").Theater;
  theaterName: string;
};
