import type { Movie, Theater, Showtime, Seat } from "../lib/types";

export const movies: Movie[] = [
  {
    id: "1",
    title: "Cosmic Voyage",
    genre: ["Sci-Fi", "Adventure"],
    description:
      "An epic journey through the cosmos exploring distant galaxies and ancient civilizations.",
    posterUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
    rating: 8.5,
    duration: 148,
    releaseDate: "2024-01-15",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Anne Hathaway"],
  },
  {
    id: "2",
    title: "Shadow Protocol",
    genre: ["Thriller", "Action"],
    description:
      "A spy thriller where nothing is as it seems. Follow the elite agents on their most dangerous mission.",
    posterUrl:
      "https://images.unsplash.com/photo-1489599849228-ed2edc828ecf?w=300&h=450&fit=crop",
    rating: 7.8,
    duration: 132,
    releaseDate: "2024-02-10",
    director: "Denis Villeneuve",
    cast: ["Tom Cruise", "Charlize Theron"],
  },
  {
    id: "3",
    title: "Echoes of Tomorrow",
    genre: ["Drama", "Romance"],
    description:
      "A touching love story that transcends time and space, challenging what we know about fate.",
    posterUrl:
      "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=300&h=450&fit=crop",
    rating: 8.2,
    duration: 125,
    releaseDate: "2024-03-01",
    director: "Greta Gerwig",
    cast: ["Timothée Chalamet", "Zendaya"],
  },
  {
    id: "4",
    title: "The Last Guardian",
    genre: ["Fantasy", "Adventure"],
    description:
      "A legendary warrior must unite fractured kingdoms against an ancient evil rising from the shadows.",
    posterUrl:
      "https://images.unsplash.com/photo-1488900128323-21503f7d34d6?w=300&h=450&fit=crop",
    rating: 8.0,
    duration: 156,
    releaseDate: "2024-03-20",
    director: "Peter Jackson",
    cast: ["Henry Cavill", "Anya Taylor-Joy"],
  },
  {
    id: "5",
    title: "Code Breaker",
    genre: ["Thriller", "Drama"],
    description:
      "Based on true events: hackers race against time to prevent a digital apocalypse.",
    posterUrl:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop",
    rating: 7.6,
    duration: 119,
    releaseDate: "2024-04-05",
    director: "Aaron Sorkin",
    cast: ["Rami Malek", "Saoirse Ronan"],
  },
  {
    id: "6",
    title: "Dancing Through Life",
    genre: ["Musical", "Comedy"],
    description:
      "A feel-good musical about a group of street dancers competing in the world championships.",
    posterUrl:
      "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop",
    rating: 7.9,
    duration: 114,
    releaseDate: "2024-04-15",
    director: "Jon M. Chu",
    cast: ["Ryan Gosling", "Zoe Saldana"],
  },
];

export const theaters: Theater[] = [
  {
    id: "theater-1",
    name: "Grand Cinema Palace",
    location: "123 Main St, Downtown",
    totalSeats: 150,
    rows: 10,
    seatsPerRow: 15,
  },
  {
    id: "theater-2",
    name: "Silver Screen Luxe",
    location: "456 Park Ave, Uptown",
    totalSeats: 120,
    rows: 8,
    seatsPerRow: 15,
  },
  {
    id: "theater-3",
    name: "Elite IMAX Experience",
    location: "789 Broadway, Arts District",
    totalSeats: 180,
    rows: 12,
    seatsPerRow: 15,
  },
];

export const showtimes: Showtime[] = [
  {
    id: "showtime-1",
    movieId: "1",
    theaterId: "theater-1",
    startTime: "2024-12-20T10:30:00Z",
    endTime: "2024-12-20T12:58:00Z",
    pricePerSeat: 12,
    availableSeats: 95,
    totalSeats: 150,
  },
  {
    id: "showtime-2",
    movieId: "1",
    theaterId: "theater-1",
    startTime: "2024-12-20T14:00:00Z",
    endTime: "2024-12-20T16:28:00Z",
    pricePerSeat: 14,
    availableSeats: 45,
    totalSeats: 150,
  },
  {
    id: "showtime-3",
    movieId: "1",
    theaterId: "theater-2",
    startTime: "2024-12-20T18:30:00Z",
    endTime: "2024-12-20T20:58:00Z",
    pricePerSeat: 15,
    availableSeats: 30,
    totalSeats: 120,
  },
  {
    id: "showtime-4",
    movieId: "2",
    theaterId: "theater-2",
    startTime: "2024-12-20T19:00:00Z",
    endTime: "2024-12-20T21:12:00Z",
    pricePerSeat: 14,
    availableSeats: 60,
    totalSeats: 120,
  },
  {
    id: "showtime-5",
    movieId: "3",
    theaterId: "theater-3",
    startTime: "2024-12-20T20:00:00Z",
    endTime: "2024-12-20T22:05:00Z",
    pricePerSeat: 13,
    availableSeats: 120,
    totalSeats: 180,
  },
];

export const generateSeats = (
  showtimeId: string,
  rows: number,
  seatsPerRow: number,
): Seat[] => {
  const seats: Seat[] = [];
  const rowLabels = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      const isBooked = Math.random() > 0.7; // 30% of seats are booked
      const seatType =
        j > 12 ? "premium" : i === 0 || i === rows - 1 ? "disabled" : "regular";

      seats.push({
        id: `seat-${rowLabels[i]}-${j}`,
        showtimeId,
        row: rowLabels[i],
        seatNumber: j,
        isAvailable: !isBooked,
        type: seatType,
      });
    }
  }

  return seats;
};
