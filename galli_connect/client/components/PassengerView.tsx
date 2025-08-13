
import React, { useState, useCallback } from 'react';
import type { Shuttle, Booking } from '../types';
import { findShuttles, bookSeat } from '../services/api';
import { ShuttleCard } from './ShuttleCard';
import { Spinner } from './common/Spinner';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { BookingConfirmation } from './BookingConfirmation';

const RouteFinder: React.FC<{ onSearch: (from: string, to: string) => void; isLoading: boolean }> = ({ onSearch, isLoading }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  
  const popularRoutes = [
      { from: 'Peenya Industrial Area', to: 'Majestic Bus Stand' },
      { from: 'Electronic City', to: 'Marathahalli' },
  ];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (from && to) {
      onSearch(from, to);
    }
  };

  const handlePopularRouteClick = (pFrom: string, pTo: string) => {
    setFrom(pFrom);
    setTo(pTo);
    onSearch(pFrom, pTo);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Where do you want to go?</h2>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From"
          className="md:col-span-2 w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          className="md:col-span-2 w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Button type="submit" isLoading={isLoading} className="md:col-span-1 h-full">
          Search
        </Button>
      </form>
      <div className="mt-4">
          <span className="text-sm text-slate-600 mr-2">Popular routes:</span>
          {popularRoutes.map((route, idx) => (
              <button key={idx} onClick={() => handlePopularRouteClick(route.from, route.to)} className="text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-full px-3 py-1 mr-2 mb-2 transition">
                  {route.from} &rarr; {route.to}
              </button>
          ))}
      </div>
    </div>
  );
};

export const PassengerView: React.FC = () => {
  const [shuttles, setShuttles] = useState<Shuttle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  const handleSearch = useCallback(async (from: string, to: string) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setShuttles([]);
    setBookingResult(null);
    try {
      const results = await findShuttles(from, to);
      setShuttles(results);
    } catch (err) {
      setError('Failed to fetch shuttles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBookClick = (shuttle: Shuttle) => {
    setSelectedShuttle(shuttle);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
      if (!selectedShuttle) return;
      setIsBooking(true);
      setError(null);
      try {
          const booking = await bookSeat(selectedShuttle.id, 1); // Simplified to 1 seat
          setBookingResult(booking);
          setIsBookingModalOpen(false);
      } catch(err) {
          setError("Failed to book seat. It might have been taken.");
      } finally {
          setIsBooking(false);
      }
  }
  
  const resetView = () => {
    setBookingResult(null);
    setShuttles([]);
    setSearched(false);
  }

  if (bookingResult) {
      return <BookingConfirmation booking={bookingResult} onNewBooking={resetView} />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <RouteFinder onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <Spinner text="Finding your ride..."/>}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {!isLoading && searched && shuttles.length === 0 && (
        <div className="text-center mt-8 py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700">No shuttles found</h3>
            <p className="text-slate-500 mt-2">Try searching for a different route or check back later.</p>
        </div>
      )}
      
      {shuttles.length > 0 && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Shuttles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shuttles.map(shuttle => (
                    <ShuttleCard key={shuttle.id} shuttle={shuttle} onBook={handleBookClick} />
                ))}
            </div>
        </div>
      )}

      {selectedShuttle && (
        <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Confirm Your Booking">
            <div>
                <h3 className="text-lg font-bold">{selectedShuttle.name}</h3>
                <p className="text-slate-600">{selectedShuttle.route.join(' → ')}</p>
                <p className="text-slate-600">Departure: {selectedShuttle.departureTime}</p>
                <div className="my-4 py-4 border-t border-b">
                    <div className="flex justify-between items-center text-lg font-medium">
                        <span>Price per Seat</span>
                        <span>₹{selectedShuttle.price}</span>
                    </div>
                </div>
                 <Button onClick={handleConfirmBooking} isLoading={isBooking} className="w-full">
                    Pay ₹{selectedShuttle.price} and Confirm
                </Button>
                {error && <p className="text-center text-red-500 mt-2 text-sm">{error}</p>}
            </div>
        </Modal>
      )}
    </div>
  );
};
