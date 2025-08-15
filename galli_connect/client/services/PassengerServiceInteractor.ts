
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


// Mock database for a driver's routes, keyed by driver ID
export const mockDriverRoutes: Record<string, DriverRoute[]> = {
    'user-123': [ // This ID matches the mock driver from services/api.ts
        {
            id: 'route-123',
            from: 'Peenya Industrial Area',
            to: 'Majestic Bus Stand',
            departureTime: '08:00 AM',
            costPerSeat: 50,
            activeDays: createUpcomingSchedule([
                { dayOffset: 0, seats: 12 },
                { dayOffset: 1, seats: 10 },
                { dayOffset: 2, seats: 12 },
                { dayOffset: 3, seats: 8 },
                { dayOffset: 4, seats: 5 },
                { dayOffset: 5, seats: 12 },
                { dayOffset: 6, seats: 12 },
            ], 12),
            totalSeats: 12,
        },
        {
            id: 'route-456',
            from: 'Electronic City',
            to: 'Marathahalli',
            departureTime: '09:00 AM',
            costPerSeat: 45,
            activeDays: createUpcomingSchedule([
                { dayOffset: 0, seats: 10 },
                { dayOffset: 1, seats: 10 },
                { dayOffset: 2, seats: 9 },
                { dayOffset: 3, seats: 0 },
                { dayOffset: 4, seats: 4 },
                { dayOffset: 5, seats: 10 },
                { dayOffset: 6, seats: 10 },
            ], 10),
            totalSeats: 10,
        }
    ]
};

interface SearchResult {
    driverId: string;
    route: DriverRoute;
}

const searchRoutesByLocation = async (from: string, to: string): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    Object.keys(mockDriverRoutes).forEach(driverId => {
        const routes = mockDriverRoutes[driverId];
        routes.forEach(route => {
            if (route.from.toLowerCase().includes(from.toLowerCase()) && route.to.toLowerCase().includes(to.toLowerCase())) {
                results.push({ driverId, route });
            }
        });
    });
    return delay(results, 600);
};

const bookSeatsForDates = async (driverId: string, routeId: string, dates: string[], seatsToBook: number): Promise<DriverRoute> => {
    const driverRoutes = mockDriverRoutes[driverId];
    if (!driverRoutes) throw new Error("Driver not found");

    const route = driverRoutes.find(r => r.id === routeId);
    if (!route) throw new Error("Route not found");

    // Check if all bookings are possible first
    for (const date of dates) {
        const daySchedule = route.activeDays.find(d => d.date === date);
        if (!daySchedule || daySchedule.availableSeats < seatsToBook) {
            throw new Error(`Booking failed: Not enough seats available on ${date}.`);
        }
    }

    // If all checks pass, update the availability
    dates.forEach(date => {
        const daySchedule = route.activeDays.find(d => d.date === date)!;
        daySchedule.availableSeats -= seatsToBook;
    });

    return delay({ ...route }, 400); // Return updated route
};


// A map to get driver names from IDs for the passenger view
const mockDriverDetails: Record<string, { name: string }> = {
    'user-123': { name: 'Ramesh Kumar' }
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