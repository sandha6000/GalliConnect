import React, { useState, useCallback, useMemo } from 'react';
import type { PassengerRouteView, Booking, DailySchedule } from '../types';
import { findRoutes, bookRouteForDates } from '../services/PassengerServiceInteractor';
import { ShuttleCard } from './ShuttleCard';
import { Spinner } from './common/Spinner';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { BookingConfirmation } from './BookingConfirmation';

interface DayButtonProps {
    day: string; // 'Mon'
    dayOfMonth: string; // '29'
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
    availableSeats: number;
}

const DayButton: React.FC<DayButtonProps> = ({ day, dayOfMonth, isSelected, onClick, disabled, availableSeats }) => {
    const baseClasses = "relative p-2 text-center font-semibold rounded-md transition-all duration-200 flex-1 min-w-[60px] border disabled:opacity-50 disabled:cursor-not-allowed";
    const selectedClasses = "bg-primary text-white shadow-sm border-primary";
    const unselectedClasses = "bg-white text-slate-700 hover:bg-slate-100 border-slate-300";
    return (
        <button type="button" onClick={onClick} disabled={disabled} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <span className="block text-xs font-medium">{day}</span>
            <span className="block text-xl font-bold mt-1">{dayOfMonth}</span>
            <span className={`absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white text-primary-dark' : 'bg-slate-200 text-slate-600'}`}>
                {availableSeats}
            </span>
        </button>
    );
};


const RouteFinder: React.FC<{
  from: string;
  to: string;
  setFrom: (val: string) => void;
  setTo: (val: string) => void;
  onSearch: (from: string, to: string) => void;
  isLoading: boolean;
}> = ({ from, to, setFrom, setTo, onSearch, isLoading }) => {
  
  const popularRoutes = [
      { from: 'Peenya Industrial Area', to: 'Majestic Bus Stand' },
      { from: 'Electronic City', to: 'Marathahalli' },
  ];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
      onSearch(from, to);
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
          className="md:col-span-2 w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-primary focus:border-primary"
        />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          className="md:col-span-2 w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-primary focus:border-primary"
        />
        <Button type="submit" isLoading={isLoading} className="md:col-span-1 h-full">
          Search
        </Button>
      </form>
      <div className="mt-4">
          <span className="text-sm text-slate-600 mr-2">Popular routes:</span>
          {popularRoutes.map((route, idx) => (
              <button key={idx} onClick={() => handlePopularRouteClick(route.from, route.to)} className="text-sm text-primary hover:text-primary-hover bg-primary-light hover:bg-orange-200 rounded-full px-3 py-1 mr-2 mb-2 transition">
                  {route.from} &rarr; {route.to}
              </button>
          ))}
      </div>
    </div>
  );
};

export const PassengerView: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [driverRoutes, setDriverRoutes] = useState<PassengerRouteView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<PassengerRouteView | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  const [singleBookingStatus, setSingleBookingStatus] = useState<Record<string, 'loading'>>({});

  const executeSearch = useCallback(async (searchFrom: string, searchTo: string) => {
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setDriverRoutes([]);
    setBookingResult(null);
    setSingleBookingStatus({}); // Reset on new search
    try {
      const results = await findRoutes(searchFrom, searchTo);
      setDriverRoutes(results);
    } catch (err) {
      setError('Failed to fetch routes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchSubmit = (searchFrom: string, searchTo: string) => {
      if (searchFrom && searchTo) {
          executeSearch(searchFrom, searchTo);
      }
  };

  const handleBookSingleDay = async (route: PassengerRouteView, date: string) => {
    const statusKey = `${route.id}-${date}`;
    setSingleBookingStatus(prev => ({ ...prev, [statusKey]: 'loading' }));
    setError(null);
    try {
        const booking = await bookRouteForDates(route.driverId, route, [date], 1);
        setBookingResult(booking);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Booking failed. The seat may have been taken.");
        // On error, remove loading status so user can retry
        setSingleBookingStatus(prev => {
            const newState = { ...prev };
            delete newState[statusKey];
            return newState;
        });
    }
  };


  const handleBookClick = (route: PassengerRouteView) => {
    setSelectedRoute(route);
    const today = new Date().toISOString().split('T')[0];
    const defaultSelection = route.activeDays
      .filter(d => d.date >= today && d.availableSeats > 0)
      .map(d => d.date);
    setSelectedDates(new Set(defaultSelection));
    setIsBookingModalOpen(true);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    })
  };

  const handleConfirmBooking = async () => {
      if (!selectedRoute || selectedDates.size === 0) return;
      setIsBooking(true);
      setError(null);
      try {
          const booking = await bookRouteForDates(selectedRoute.driverId, selectedRoute, Array.from(selectedDates), 1); // Simplified to 1 seat
          setBookingResult(booking);
          setIsBookingModalOpen(false);
      } catch(err) {
          setError(err instanceof Error ? err.message : "Failed to book seat. It might have been taken.");
      } finally {
          setIsBooking(false);
      }
  }
  
  const resetView = () => {
    setBookingResult(null);
    // After booking, refresh the search results to show updated availability
    if (from && to) {
        executeSearch(from, to);
    } else {
        // Fallback for an unlikely edge case
        setDriverRoutes([]);
    setSearched(false);
        setFrom('');
        setTo('');
    }
  }

  const totalPrice = useMemo(() => {
    if (!selectedRoute) return 0;
    return selectedRoute.costPerSeat * selectedDates.size;
  }, [selectedRoute, selectedDates]);

  if (bookingResult) {
      return <BookingConfirmation booking={bookingResult} onNewBooking={resetView} />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <RouteFinder 
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        onSearch={handleSearchSubmit} 
        isLoading={isLoading} 
      />

      {isLoading && <Spinner text="Finding your ride..."/>}

      {error && !isBookingModalOpen && <p className="text-center text-red-500 mt-4">{error}</p>}

      {!isLoading && searched && driverRoutes.length === 0 && (
        <div className="text-center mt-8 py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700">No routes found for this location</h3>
            <p className="text-slate-500 mt-2">Try searching for a different route or check back later.</p>
        </div>
      )}
      
      {driverRoutes.length > 0 && (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Available Drivers & Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {driverRoutes.map(route => (
                    <ShuttleCard 
                        key={route.id} 
                        route={route} 
                        onBook={handleBookClick}
                        onBookSingleDay={handleBookSingleDay}
                        bookingStatus={singleBookingStatus}
                    />
                ))}
            </div>
        </div>
      )}

      {selectedRoute && (
        <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Select Your Travel Dates">
            <div>
                <h3 className="text-lg font-bold">{selectedRoute.from} &rarr; {selectedRoute.to}</h3>
                <p className="text-slate-600">with {selectedRoute.driverName}</p>
                
                <div className="my-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Toggle days to book</label>
                    <div className="flex flex-wrap gap-2">
                        {selectedRoute.activeDays
                          .filter(d => d.date >= new Date().toISOString().split('T')[0])
                          .slice(0, 7)
                          .map(dayInfo => {
                            const dayOfMonth = new Date(dayInfo.date + 'T00:00:00').getDate().toString();
                            return (
                               <DayButton 
                                    key={dayInfo.date} 
                                    day={dayInfo.day}
                                    dayOfMonth={dayOfMonth}
                                    isSelected={selectedDates.has(dayInfo.date)} 
                                    onClick={() => handleDateSelect(dayInfo.date)} 
                                    disabled={dayInfo.availableSeats === 0}
                                    availableSeats={dayInfo.availableSeats}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="my-4 py-4 border-t border-b">
                    <div className="flex justify-between items-center text-lg font-medium">
                        <span>Price per Seat</span>
                        <span>₹{selectedRoute.costPerSeat}</span>
                    </div>
                     <div className="flex justify-between items-center text-lg font-medium mt-2">
                        <span>Selected Days</span>
                        <span>{selectedDates.size}</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold mt-2 text-primary-dark">
                        <span>Total Price</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>
                 <Button onClick={handleConfirmBooking} isLoading={isBooking} className="w-full" disabled={selectedDates.size === 0}>
                    {selectedDates.size > 0 ? `Pay ₹${totalPrice} and Confirm` : 'Please select a date'}
                </Button>
                {error && <p className="text-center text-red-500 mt-2 text-sm">{error}</p>}
            </div>
        </Modal>
      )}
    </div>
  );
};