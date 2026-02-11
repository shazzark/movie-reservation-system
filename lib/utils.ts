import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and twMerge
 * Handles conflicting utility classes and conditional classNames
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency to USD with proper formatting
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Format time to HH:MM format
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj);
}

/**
 * Generate a booking reference number
 */
export function generateBookingReference(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CB-${new Date().getFullYear()}-${timestamp}${random}`;
}

/**
 * Calculate total price with tax
 */
export function calculateTotalWithTax(
  basePrice: number,
  taxRate: number = 0.08,
): number {
  return Math.round(basePrice * (1 + taxRate));
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/.test(phone);
  return phoneRegex && phone.replace(/\D/g, "").length >= 10;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Capitalize first letter of string
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert enum to readable label
 */
export function enumToLabel(enumValue: string): string {
  return enumValue
    .split("_")
    .map((word) => capitalizeFirstLetter(word.toLowerCase()))
    .join(" ");
}

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get seat coordinates from seat code (e.g., "A1" -> row: 0, col: 0)
 */
export function getSeatCoordinates(seatCode: string): {
  row: number;
  col: number;
} {
  const row = seatCode.charCodeAt(0) - 65;
  const col = parseInt(seatCode.slice(1)) - 1;
  return { row, col };
}

/**
 * Get seat code from coordinates
 */
export function getSeatCode(row: number, col: number): string {
  return String.fromCharCode(65 + row) + (col + 1);
}

/**
 * Format runtime in minutes to HH:MM format
 */
export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Get rating color based on IMDb score
 */
export function getRatingColor(rating: number): string {
  if (rating >= 8) return "text-green-400";
  if (rating >= 7) return "text-yellow-400";
  if (rating >= 6) return "text-orange-400";
  return "text-red-400";
}

/**
 * Get seat status badge color
 */
export function getSeatStatusColor(status: string): string {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "booked":
      return "bg-red-500";
    case "selected":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}
