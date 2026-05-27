export const UserRole = {
  USER: "ROLE_USER",
  THEATRE_ADMIN: "ROLE_THEATRE",
  SUPER_ADMIN: "ROLE_ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthResponse {
  token: string;
}

export interface DecodedToken {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface Movie {
  id: string;
  title: string;
  language: string;
  genre: string;
  durationMinutes: number;
  deleted: boolean;
  createdAt: string;
  poster: string;
  posterUrl: string;
}

export interface Theatre {
  id: string;
  name: string;
  locationId: string;
  totalSeats: number;
}

export interface Show {
  showId: number;
  movieId: string;
  theatreId: string;
  showTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
}

export interface Booking {
  bookingId: number;
  showId: number;
  movieId: string;
  theatreId: string;
  seatNumbers: string[];
  totalAmount: number;
  status: string;
  bookedAt: string;
}
export interface Review {
  reviewId: string;
  movieId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
