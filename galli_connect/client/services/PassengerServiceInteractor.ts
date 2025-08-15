
import type { Booking, PassengerRouteView, DriverRoute } from '../types';

// Simulate network latency
const delay = <T,>(data: T, ms = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

// Helper to generate date-specific schedules for mock data
const createUpcomingSchedule = (days: { dayOffset: number, seats: number }[], totalSeats: number) => {
    return days.map(({ dayOffset, seats }) => {
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        return {
            date: date.toISOString().split('T')[0],
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            availableSeats: seats,
        };
    });
};

interface SearchResult {
    driverId: string;
    route: DriverRoute;
}



export const bookSeatsForDates = async (
    driverId: string,
    routeId: string,
    dates: string[],
    seatsToBook: number
): Promise<DriverRoute> => {
    const response = await fetch('/api/book-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, routeId, dates, seatsToBook }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Booking failed');
    }

    return await response.json();
};


export const findRoutes = async (from: string, to: string): Promise<PassengerRouteView[]> => {
    console.log(`Searching for routes from ${from} to ${to}`);

    const response = await fetch('/api/routes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch routes');
    }

    const passengerRoutes: PassengerRouteView[] = await response.json();
    return passengerRoutes;
};

export const bookRouteForDates = async (
    driverId: string, 
    route: PassengerRouteView, 
    dates: string[], 
    seats: number
): Promise<Booking> => {
  
  if (dates.length === 0) {
      throw new Error("No dates selected for booking.");
  }
  
  // This will update the "database" and throw an error if booking fails
  await bookSeatsForDates(driverId, route.id, dates, seats);
  
  const totalPrice = route.costPerSeat * seats * dates.length;

  const booking: Booking = {
    bookingId: `BK-${Date.now()}`,
    driverName: route.driverName,
    routeInfo: {
        from: route.from,
        to: route.to,
        departureTime: route.departureTime,
    },
    seats,
    dates,
    totalPrice,
  };
  return delay(booking, 1000);
};