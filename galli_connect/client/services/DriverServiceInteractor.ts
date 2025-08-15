
import type { DriverRoute,RouteBookings } from '../types';

// Simulate network latency
const delay = <T,>(data: T, ms = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
};

export const getDriverRoutes = async (driverId: string): Promise<DriverRoute[]> => {
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
        activeDays: route.active_days,
        totalSeats:route.total_seats
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
        activeDays: data.activeDays,
        totalSeats:data.totalSeats
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
        activeDays: data.active_days,
        totalSeats:data.total_seats

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

export const getRouteBookings = async (
    driverId: string,
    routeId: string
): Promise<RouteBookings> => {
    console.log(`Fetching bookings for route ${routeId} for driver ${driverId}`);

    const response = await fetch(`/api/driver/${driverId}/routes/${routeId}/bookings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch route bookings');
    }

    const data = await response.json();
    return data as RouteBookings;
};

