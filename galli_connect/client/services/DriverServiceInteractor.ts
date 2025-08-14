import type { DriverRoute, WeekDay } from '../types';

// Simulate network latency
const delay = <T,>(data: T, ms = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

// Mock database for a driver's routes, keyed by driver ID
const mockDriverRoutes: Record<string, DriverRoute[]> = {
    'user-123': [ // This ID matches the mock driver from services/api.ts
    {
        id: 'route-123',
        from: 'Peenya Industrial Area',
        to: 'Majestic Bus Stand',
        departureTime: '08:00 AM',
        costPerSeat: 50,
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as WeekDay[],
    },
    {
        id: 'route-456',
        from: 'Electronic City',
        to: 'Marathahalli',
        departureTime: '09:00 AM',
        costPerSeat: 45,
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as WeekDay[],
    }
    ]
};

export const getDriverRoutes = async (driverId: number): Promise<DriverRoute[]> => {
    console.log(`Fetching current routes for driver ${driverId}...`);

    const response = await fetch(`/api/get-driver-routes/${driverId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch driver routes: ${response.statusText}`);
    }

    const data = await response.json();
    return data.routes.map((route: any) => ({
        id: route.id,
        from: route.from_location,
        to: route.to_location,
        departureTime: route.departure_time,
        costPerSeat: parseFloat(route.cost_per_seat),
        activeDays: route.active_days
    }));
};


export const addDriverRoute = async (
    driverId: number,
    routeData: Omit<DriverRoute, 'id'>
): Promise<DriverRoute> => {
    console.log(`Adding new route for driver ${driverId}:`, routeData);

    const response = await fetch('/api/add-driver-route/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            driverId,
            ...routeData
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add driver route: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        id: data.id,
        from: data.from,
        to: data.to,
        departureTime: data.departureTime,
        costPerSeat: data.costPerSeat,
        activeDays: data.activeDays
    };
};


export const updateDriverRoute = async (driverId: number, routeData: DriverRoute): Promise<DriverRoute> => {
    console.log(`Updating route for driver ${driverId}:`, routeData);

    const response = await fetch(`/api/update-driver-route/${driverId}/${routeData.id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from_location: routeData.from,
            to_location: routeData.to,
            departure_time: routeData.departureTime,
            cost_per_seat: routeData.costPerSeat,
            active_days: routeData.activeDays
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update route: ${response.statusText}`);
    }

    const data = await response.json();

    return {
        id: data.id,
        from: data.from_location,
        to: data.to_location,
        departureTime: data.departure_time,
        costPerSeat: parseFloat(data.cost_per_seat),
        activeDays: data.active_days
    };
};


export const deleteDriverRoute = async (driverId: number, routeId: number): Promise<void> => {
    console.log(`Deleting route ${routeId} for driver ${driverId}`);

    const response = await fetch(`/api/delete-driver-route/${driverId}/${routeId}/`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to delete route: ${response.statusText}`);
}
};

