
export enum UserMode {
  PASSENGER = 'PASSENGER',
  DRIVER = 'DRIVER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserMode;
}

export interface Shuttle {
  id: string;
  name: string;
  driverName: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  route: [string, string];
}

export interface Booking {
  bookingId: string;
  shuttle: Shuttle;
  seats: number;
  totalPrice: number;
}

export interface TripRequest {
  id: string;
  from: string;
  to: string;
  time: string; // e.g., "08:00 AM"
}

export interface DemandHotspot {
  location: string;
  demandScore: number;
  summary: string;
}

export interface OptimizedRouteData {
  routeName: string;
  stops: string[];
  estimatedDuration: string;
  summary: string;
}

export interface AiAnalysisResult {
  demandHotspots: DemandHotspot[];
  optimizedRoute: OptimizedRouteData;
}