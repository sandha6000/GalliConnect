
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

export interface Booking {
  bookingId: string;
  driverName: string;
  routeInfo: {
    from: string;
    to: string;
    departureTime: string;
  };
  seats: number;
  dates: string[];
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

export interface DailySchedule {
    date: string; // YYYY-MM-DD
    day: string; // e.g., 'Mon', 'Tue'
    availableSeats: number;
}

export interface DriverRoute {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  costPerSeat: number;
  activeDays: DailySchedule[];
  totalSeats: number;
}

export interface PassengerRouteView extends DriverRoute {
    driverId: string;
    driverName: string;
}

export interface PassengerBookingInfo {
  passengerName: string;
  seats: number;
}

export type RouteBookings = Record<string, PassengerBookingInfo[]>;
