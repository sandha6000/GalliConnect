
import React from 'react';
import type { DriverRoute } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { LOCATION_ICON, CLOCK_ICON, SEAT_ICON } from '../constants';

interface DriverRouteCardProps {
    route: DriverRoute;
    onEdit: (route: DriverRoute) => void;
    onDelete: (routeId: string) => void;
    onViewBookings: (route: DriverRoute) => void;
    isDeleting: boolean;
}

const getAvailabilityColor = (available: number, total: number) => {
    const ratio = total > 0 ? available / total : 0;
    if (ratio > 0.5) return 'bg-green-100 text-green-800';
    if (ratio > 0.25) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
};

export const DriverRouteCard: React.FC<DriverRouteCardProps> = ({ route, onEdit, onDelete, onViewBookings, isDeleting }) => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingDays = route.activeDays.filter(day => day.date >= today);

    return (
        <Card>
            <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center text-slate-700 font-semibold text-lg">
                            <span className="text-indigo-600">{LOCATION_ICON}</span>
                            <p className="ml-2">{route.from} &rarr; {route.to}</p>
                        </div>
                        <div className="flex items-center gap-x-6 mt-2">
                            <div className="flex items-center text-slate-600">
                            {CLOCK_ICON}
                            <p className="ml-2">Departs at {route.departureTime}</p>
                        </div>
                             <div className="flex items-center text-slate-600">
                                {SEAT_ICON}
                                <p className="ml-2 font-medium">{route.totalSeats} Seats</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">₹{route.costPerSeat}</p>
                        <p className="text-xs text-slate-500">per seat</p>
                    </div>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4">
                    <div className="flex justify-between items-center">
                         <div>
                            <p className="text-sm font-semibold text-slate-700 mb-2">Upcoming Availability:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {upcomingDays.length > 0 ? upcomingDays.slice(0, 7).map(schedule => {
                                     const displayDate = new Date(schedule.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    return (
                                        <span key={schedule.date} className={`px-2.5 py-1 text-xs font-bold rounded-full ${getAvailabilityColor(schedule.availableSeats, route.totalSeats)}`}>
                                            {schedule.day}, {displayDate} ({schedule.availableSeats} left)
                                    </span>
                                    );
                                }) : <p className="text-sm text-slate-500">No upcoming active days.</p>}
                            </div>
                        </div>
                        <div className="flex gap-2 items-center flex-shrink-0">
                            <Button variant="ghost" onClick={() => onViewBookings(route)}>View Bookings</Button>
                            <Button variant="secondary" onClick={() => onEdit(route)}>Edit</Button>
                            <Button 
                                variant="ghost" 
                                className="text-red-600 hover:bg-red-50 focus:ring-red-500"
                                onClick={() => onDelete(route.id)}
                                isLoading={isDeleting}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};