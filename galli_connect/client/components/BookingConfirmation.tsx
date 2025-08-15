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
    <Card className="max-w-lg mx-auto mt-8 text-center animate-fade-in">
        <div className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-800">Booking Confirmed!</h2>
            <p className="mt-2 text-slate-600">Your seats are reserved. Get ready for a comfortable ride.</p>

            <div className="mt-6 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-lg text-primary-dark flex items-center">{BUS_ICON} <span className="ml-2">{booking.driverName}'s Shuttle</span></h3>
                <p className="text-slate-600 mt-2"><strong>Route:</strong> {booking.routeInfo.from} to {booking.routeInfo.to}</p>
                <p className="text-slate-600"><strong>Time:</strong> {booking.routeInfo.departureTime}</p>
                <p className="text-slate-600"><strong>Seats Booked:</strong> {booking.seats}</p>
                
                <div className="mt-3 pt-3 border-t">
                    <strong className="text-slate-700">Booked Dates:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {booking.dates.map(date => (
                            <span key={date} className="bg-primary-light text-primary-dark text-sm font-semibold px-3 py-1 rounded-full">
                                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-slate-800 font-bold mt-4 pt-3 border-t"><strong>Total Paid:</strong> ₹{booking.totalPrice}</p>
                <p className="text-slate-600 mt-4 text-sm">Booking ID: <span className="font-mono bg-slate-200 px-1 rounded">{booking.bookingId}</span></p>
            </div>

             <Button onClick={onNewBooking} variant="secondary" className="mt-8 w-full">
                Book Another Trip
            </Button>
        </div>
    </Card>
  );
};