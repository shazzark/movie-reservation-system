export type Showtime = {
  _id: string; // MongoDB ObjectId as a string
  movieId: string;
  theaterId: string;
  startTime: Date | string;
  price: number;
  format: string;
  totalSeats: number;
  bookedSeats: string[]; // e.g., ["A1", "A2"]
  createdAt?: Date;
  updatedAt?: Date;
};
