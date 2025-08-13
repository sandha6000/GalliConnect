
import React from 'react';
import type { Booking } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { BUS_ICON } from '../constants';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onNewBooking }) => {
  return (
    <Card className="max-w-md mx-auto mt-8 text-center animate-fade-in">
        <div className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Booking Confirmed!</h2>
            <p className="mt-2 text-slate-600">Your seat is reserved. Get ready for a comfortable ride.</p>

            <div className="mt-6 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg text-indigo-700 flex items-center">{BUS_ICON} <span className="ml-2">{booking.shuttle.name}</span></h3>
                <p className="text-slate-600 mt-2"><strong>Route:</strong> {booking.shuttle.route.join(' to ')}</p>
                <p className="text-slate-600"><strong>Time:</strong> {booking.shuttle.departureTime} - {booking.shuttle.arrivalTime}</p>
                <p className="text-slate-600"><strong>Seats Booked:</strong> {booking.seats}</p>
                <p className="text-slate-800 font-bold mt-2"><strong>Total Paid:</strong> ₹{booking.totalPrice}</p>
                <p className="text-slate-600 mt-4 text-sm">Booking ID: <span className="font-mono bg-slate-200 px-1 rounded">{booking.bookingId}</span></p>
            </div>

             <Button onClick={onNewBooking} variant="secondary" className="mt-8 w-full">
                Book Another Trip
            </Button>
        </div>
    </Card>
  );
};
