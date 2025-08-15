import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Spinner } from './common/Spinner';
import { getRouteBookings } from '../services/DriverServiceInteractor';
import type { DriverRoute, RouteBookings } from '../types';

interface ViewBookingsModalProps {
    currentUser:string;
  isOpen: boolean;
  onClose: () => void;
  route: DriverRoute | null;
}

export const ViewBookingsModal: React.FC<ViewBookingsModalProps> = ({ isOpen, onClose, route,currentUser }) => {
    const [bookings, setBookings] = useState<RouteBookings>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && route) {
            const fetchBookings = async () => {
                setIsLoading(true);
                setError(null);
                setSelectedDate(null);
                try {
                    // In a real app, you would pass the current user's ID.
                    const result = await getRouteBookings(currentUser.id, route.id);
                    setBookings(result);
                } catch (e) {
                    setError("Failed to load booking details.");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBookings();
        }
    }, [isOpen, route]);

    if (!route) return null;

    const today = new Date().toISOString().split('T')[0];
    const upcomingDays = route.activeDays.filter(day => day.date >= today);

    const handleDateClick = (date: string) => {
        setSelectedDate(current => (current === date ? null : date));
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Bookings for ${route.from} → ${route.to}`}>
            {isLoading ? <Spinner text="Loading booking details..." /> :
             error ? <p className="text-red-500 text-center">{error}</p> :
             (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
                    {upcomingDays.length === 0 && <p className="text-slate-500 text-center py-4">No upcoming active days for this route.</p>}
                    {upcomingDays.map(schedule => {
                        const bookingsForDate = bookings[schedule.date] || [];
                        const seatsBooked = bookingsForDate.reduce((sum, b) => sum + b.seatsBooked, 0);
                        const isSelected = selectedDate === schedule.date;

                        return (
                            <div key={schedule.date}>
                                <button 
                                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${isSelected ? 'bg-primary-light/50 border-orange-300 shadow-sm' : 'bg-white hover:bg-slate-50 border-slate-200'}`}
                                    onClick={() => handleDateClick(schedule.date)}
                                    aria-expanded={isSelected}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">
                                                {new Date(schedule.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-lg ${seatsBooked > 0 ? 'text-primary' : 'text-slate-600'}`}>{seatsBooked} / {route.totalSeats}</p>
                                            <p className="text-xs text-slate-500">Seats Filled</p>
                                        </div>
                                    </div>
                                </button>
                                {isSelected && (
                                    <div className="bg-slate-50 p-4 mt-[-2px] rounded-b-lg border border-t-0 border-orange-200 animate-fade-in">
                                        <h4 className="font-semibold text-sm text-slate-700 mb-2">Passengers Booked:</h4>
                                        {bookingsForDate.length > 0 ? (
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {bookingsForDate.map((booking, index) => (
                                                    <li key={index} className="text-slate-600">
                                                        {booking.passengerName} ({booking.seatsBooked} {booking.seatsBooked > 1 ? 'seats' : 'seat'})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">No bookings for this date yet.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
             )
            }
        </Modal>
    );
};