
import React from 'react';
import type { Shuttle } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { CLOCK_ICON, LOCATION_ICON, SEAT_ICON } from '../constants';

interface ShuttleCardProps {
  shuttle: Shuttle;
  onBook: (shuttle: Shuttle) => void;
}

export const ShuttleCard: React.FC<ShuttleCardProps> = ({ shuttle, onBook }) => {
  const seatAvailabilityColor = shuttle.availableSeats / shuttle.totalSeats > 0.5
    ? 'text-green-600'
    : shuttle.availableSeats > 0 ? 'text-amber-600' : 'text-red-600';

  return (
    <Card className="transition-all duration-300 hover:shadow-xl">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{shuttle.name}</h3>
            <p className="text-sm text-slate-500">Driver: {shuttle.driverName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">₹{shuttle.price}</p>
            <p className="text-xs text-slate-500">per seat</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-slate-600">
            {LOCATION_ICON}
            <p className="ml-2 font-medium">{shuttle.route[0]} &rarr; {shuttle.route[1]}</p>
          </div>
          <div className="flex items-center text-slate-600">
            {CLOCK_ICON}
            <p className="ml-2">{shuttle.departureTime} - {shuttle.arrivalTime}</p>
          </div>
          <div className="flex items-center text-slate-600">
            {SEAT_ICON}
            <p className={`ml-2 font-semibold ${seatAvailabilityColor}`}>
              {shuttle.availableSeats} of {shuttle.totalSeats} seats available
            </p>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-4">
        <Button
          className="w-full"
          onClick={() => onBook(shuttle)}
          disabled={shuttle.availableSeats === 0}
        >
          {shuttle.availableSeats > 0 ? 'Book Now' : 'Sold Out'}
        </Button>
      </div>
    </Card>
  );
};
