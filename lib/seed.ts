// lib/seed.ts
import { MovieModel } from "../models/movie";
import { ShowtimeModel } from "../models/showtime";
import { TheaterModel } from "../models/theater";
import { handleDbConnection } from "./dbHandler";
import mongoose from "mongoose";
import { validateSeedDatabaseState } from "./seed-rules";

export async function seedMovies() {
  try {
    await handleDbConnection();

    const [movieCount, showtimeCount, theaterCount] = await Promise.all([
      MovieModel.countDocuments(),
      ShowtimeModel.countDocuments(),
      TheaterModel.countDocuments(),
    ]);
    validateSeedDatabaseState({ movies: movieCount, showtimes: showtimeCount, theaters: theaterCount });

    // Generate ObjectIDs for the seeded theaters.
    const theaterIds = [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId(),
    ];

    await TheaterModel.insertMany([
      {
        _id: theaterIds[0],
        name: "Grand Cinema Palace",
        location: "Downtown",
        totalSeats: 150,
        rows: 10,
        seatsPerRow: 15,
      },
      {
        _id: theaterIds[1],
        name: "Silver Screen Luxe",
        location: "Westside Mall",
        totalSeats: 120,
        rows: 8,
        seatsPerRow: 15,
      },
      {
        _id: theaterIds[2],
        name: "Elite IMAX Experience",
        location: "North Point",
        totalSeats: 180,
        rows: 12,
        seatsPerRow: 15,
      },
    ]);

    // Insert the sample movies.
    const moviesToInsert = [
      {
        title: "Cosmic Voyage",
        genre: ["Sci-Fi", "Adventure"],
        description:
          "An epic journey through the cosmos exploring distant galaxies.",
        posterUrl: "/images/cosmic-voyage.jpg",
        rating: 8.5,
        duration: 148,
        releaseDate: new Date("2024-01-15"),
        director: "Christopher Nolan",
        cast: ["Leonardo DiCaprio", "Anne Hathaway"],
        seatsAvailable: 150,
        isActive: true,
      },
      {
        title: "Shadow Protocol",
        genre: ["Thriller", "Action"],
        description:
          "A spy thriller where nothing is as it seems. Follow the elite agents.",
        posterUrl: "/images/shadow-protocol.jpg",
        rating: 7.8,
        duration: 132,
        releaseDate: new Date("2024-02-10"),
        director: "Denis Villeneuve",
        cast: ["Tom Cruise", "Charlize Theron"],
        seatsAvailable: 120,
        isActive: true,
      },
      {
        title: "Echoes of Tomorrow",
        genre: ["Drama", "Romance"],
        description: "A touching love story that transcends time and space.",
        posterUrl: "/images/Echoes-of-Tomorrow.jpg",
        rating: 8.2,
        duration: 125,
        releaseDate: new Date("2024-03-01"),
        director: "Greta Gerwig",
        cast: ["Timothée Chalamet", "Zendaya"],
        seatsAvailable: 180,
        isActive: true,
      },
      {
        title: "The Last Guardian",
        genre: ["Fantasy", "Adventure"],
        description: "A legendary warrior must unite fractured kingdoms.",
        posterUrl: "/images/the-last-guardian.jpg",
        rating: 8.0,
        duration: 156,
        releaseDate: new Date("2024-03-20"),
        director: "Peter Jackson",
        cast: ["Henry Cavill", "Anya Taylor-Joy"],
        seatsAvailable: 200,
        isActive: true,
      },
      {
        title: "Code Breaker",
        genre: ["Thriller", "Drama"],
        description:
          "Hackers race against time to prevent a digital apocalypse.",
        posterUrl: "/images/Code-Breaker.jpg",
        rating: 7.6,
        duration: 119,
        releaseDate: new Date("2024-04-05"),
        director: "Aaron Sorkin",
        cast: ["Rami Malek", "Saoirse Ronan"],
        seatsAvailable: 100,
        isActive: true,
      },
      {
        title: "Dancing Through Life",
        genre: ["Musical", "Comedy"],
        description: "A feel-good musical about street dancers competing.",
        posterUrl: "/images/Dancing-Through-Life.avif",
        rating: 7.9,
        duration: 114,
        releaseDate: new Date("2024-04-15"),
        director: "Jon M. Chu",
        cast: ["Ryan Gosling", "Zoe Saldana"],
        seatsAvailable: 110,
        isActive: true,
      },
    ];

    const createdMovies = await MovieModel.insertMany(moviesToInsert);

    // Create sample showtimes using the inserted records' IDs.
    const today = new Date();
    today.setDate(today.getDate() + 1);

    const showtimesToInsert = [
      {
        movieId: createdMovies[0]._id, // Cosmic Voyage
        theaterId: theaterIds[0], // Grand Cinema Palace
        startTime: new Date(new Date(today).setHours(10, 30, 0, 0)),
        price: 12.0,
        totalSeats: 150,
        bookedSeats: [],
        format: "IMAX",
      },
      {
        movieId: createdMovies[0]._id, // Cosmic Voyage
        theaterId: theaterIds[0], // Grand Cinema Palace
        startTime: new Date(new Date(today).setHours(14, 0, 0, 0)),
        price: 14.0,
        totalSeats: 150,
        bookedSeats: [],
        format: "2D",
      },
      {
        movieId: createdMovies[1]._id, // Shadow Protocol
        theaterId: theaterIds[1], // Silver Screen Luxe
        startTime: new Date(new Date(today).setHours(19, 0, 0, 0)),
        price: 14.0,
        totalSeats: 120,
        bookedSeats: [],
        format: "Digital",
      },
      {
        movieId: createdMovies[2]._id, // Echoes of Tomorrow
        theaterId: theaterIds[2], // Elite IMAX
        startTime: new Date(new Date(today).setHours(20, 0, 0, 0)),
        price: 13.0,
        totalSeats: 180,
        bookedSeats: [],
        format: "2D",
      },
      {
        movieId: createdMovies[3]._id, // The Last Guardian
        theaterId: theaterIds[0], // Grand Cinema Palace
        startTime: new Date(new Date(today).setHours(21, 0, 0, 0)),
        price: 15.0,
        totalSeats: 150,
        bookedSeats: [],
        format: "3D",
      },
    ];

    await ShowtimeModel.insertMany(showtimesToInsert);
  } catch (error) {
    throw error;
  }
}
