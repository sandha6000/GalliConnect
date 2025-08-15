import React from 'react';
import type { PassengerRouteView } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { CLOCK_ICON, LOCATION_ICON, SEAT_ICON } from '../constants';

interface ShuttleCardProps {
  route: PassengerRouteView;
  onBook: (route: PassengerRouteView) => void;
  onBookSingleDay: (route: PassengerRouteView, date: string) => void;
  bookingStatus: Record<string, 'loading' | undefined>;
}

const getAvailabilityColor = (available: number, total: number) => {
    const ratio = total > 0 ? available / total : 0;
    if (ratio > 0.5) return 'bg-green-100 text-green-800';
    if (ratio > 0.25) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
};


export const ShuttleCard: React.FC<ShuttleCardProps> = ({ route, onBook, onBookSingleDay, bookingStatus }) => {
  const today = new Date().toISOString().split('T')[0];
  const upcomingDays = route.activeDays.filter(day => day.date >= today);
  const canBook = upcomingDays.some(d => d.availableSeats > 0);

  return (
    <Card className="transition-all duration-300 hover:shadow-xl flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center text-slate-700 font-semibold text-lg">
                <span className="text-primary">{LOCATION_ICON}</span>
                <p className="ml-2">{route.from} &rarr; {route.to}</p>
            </div>
            <p className="text-sm text-slate-500 mt-1">Driver: <span className="font-medium">{route.driverName}</span></p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₹{route.costPerSeat}</p>
            <p className="text-xs text-slate-500">per seat</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-slate-600">
            {CLOCK_ICON}
                <p className="ml-2">Departs at {route.departureTime}</p>
          </div>
          <div className="flex items-center text-slate-600">
            {SEAT_ICON}
                <p className="ml-2 font-medium">{route.totalSeats} Total Seats</p>
            </div>
        </div>
         <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-1">Upcoming Availability:</p>
            <p className="text-xs text-slate-500 mb-3">Click a date for a single-day booking.</p>
            <div className="flex flex-wrap gap-2">
                {upcomingDays.length > 0 ? upcomingDays.slice(0, 7).map(schedule => {
                        const displayDate = new Date(schedule.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const statusKey = `${route.id}-${schedule.date}`;
                        const isLoading = bookingStatus[statusKey] === 'loading';
                        const isDisabled = schedule.availableSeats === 0 || isLoading;
                    
                    return (
                        <button
                            key={schedule.date}
                            type="button"
                            onClick={() => !isDisabled && onBookSingleDay(route, schedule.date)}
                            disabled={isDisabled}
                            aria-label={`Book for ${schedule.day}, ${displayDate}`}
                            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center min-w-[130px] ${getAvailabilityColor(schedule.availableSeats, route.totalSeats)} ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'}`}
                        >
                             {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Booking...</span>
                                </>
                            ) : (
                                <span>{schedule.day}, {displayDate} ({schedule.availableSeats} left)</span>
                            )}
                        </button>
                    );
                }) : <p className="text-sm text-slate-500">No upcoming active days.</p>}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-4">
        <Button
          className="w-full"
          onClick={() => onBook(route)}
          disabled={!canBook}
        >
          {canBook ? 'Book Multiple Days' : 'No Seats Available'}
        </Button>
      </div>
    </Card>
  );
};