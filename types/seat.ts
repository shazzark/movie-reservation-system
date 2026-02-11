export interface Seat {
  id: string; // This is a virtual ID (e.g., "A1")
  showtimeId: string;
  row: string;
  seatNumber: number;
  isAvailable: boolean;
  isSelected?: boolean;
  type: "regular" | "premium" | "disabled";
}
