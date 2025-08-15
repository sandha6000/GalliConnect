
import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import type { DriverRoute, DailySchedule } from '../types';

interface ManageRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: Omit<DriverRoute, 'id'>) => Promise<void>;
  currentRoute: DriverRoute | null;
  isSaving: boolean;
  title: string;
}

interface DayButtonProps {
    day: string; // 'Mon'
    dayOfMonth: string; // '29'
    isSelected: boolean;
    onClick: () => void;
}

const DayButton: React.FC<DayButtonProps> = ({ day, dayOfMonth, isSelected, onClick }) => {
    const baseClasses = "p-2 text-center font-semibold rounded-md transition-all duration-200 flex-1 min-w-[50px] border";
    const selectedClasses = "bg-indigo-600 text-white shadow-sm border-indigo-600";
    const unselectedClasses = "bg-white text-slate-700 hover:bg-slate-100 border-slate-300";
    return (
        <button type="button" onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            <span className="block text-xs font-medium">{day}</span>
            <span className="block text-xl font-bold mt-1">{dayOfMonth}</span>
        </button>
    );
};

// Helpers
const formatDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = date.getDate().toString();
    return { date: dateString, day, dayOfMonth };
};

const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(formatDate(date));
    }
    return days;
};


export const ManageRouteModal: React.FC<ManageRouteModalProps> = ({ isOpen, onClose, onSave, currentRoute, isSaving, title }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [costPerSeat, setCostPerSeat] = useState<number | string>('');
  const [totalSeats, setTotalSeats] = useState<number | string>('');
  
  const [scheduleOptions, setScheduleOptions] = useState<{ date: string; day: string; dayOfMonth: string }[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
        const nextSevenDays = getNextSevenDays();
        
        if (currentRoute) { // Edit mode
      setFrom(currentRoute.from);
      setTo(currentRoute.to);
      setDepartureTime(currentRoute.departureTime);
      setCostPerSeat(currentRoute.costPerSeat);
      setTotalSeats(currentRoute.totalSeats);

            const upcomingScheduleDates = currentRoute.activeDays
                .map(d => new Date(d.date + 'T00:00:00'))
                .filter(d => d >= new Date(new Date().setHours(0, 0, 0, 0)))
                .map(formatDate);

            const combinedOptions = [...nextSevenDays, ...upcomingScheduleDates];
            const uniqueOptions = Array.from(new Set(combinedOptions.map(d => d.date)))
                .map(date => combinedOptions.find(d => d.date === date)!)
                .sort((a, b) => a.date.localeCompare(b.date));
            
            setScheduleOptions(uniqueOptions.slice(0, 14)); // Limit to 2 weeks view max
            setSelectedDates(new Set(currentRoute.activeDays.map(d => d.date)));

        } else { // Add new route mode
      setFrom('');
      setTo('');
      setDepartureTime('08:00 AM');
      setCostPerSeat('');
      setTotalSeats('');
            setScheduleOptions(nextSevenDays);
            setSelectedDates(new Set(nextSevenDays.map(d => d.date))); // Select all by default
        }
    }
  }, [isOpen, currentRoute]);

  const handleDayClick = (date: string) => {
    setSelectedDates(prev => {
        const newSet = new Set(prev);
        if (newSet.has(date)) {
            newSet.delete(date);
        } else {
            newSet.add(date);
        }
        return newSet;
    });
  };

  const handleSave = () => {
    const activeDays: DailySchedule[] = Array.from(selectedDates).map(date => {
        const dayInfo = scheduleOptions.find(opt => opt.date === date)!;
        const existingDay = currentRoute?.activeDays.find(d => d.date === date);
        return {
            date,
            day: dayInfo.day,
            availableSeats: existingDay?.availableSeats ?? Number(totalSeats)
        };
    }).sort((a, b) => a.date.localeCompare(b.date));

    const routeData = {
        from,
        to,
        departureTime,
        costPerSeat: Number(costPerSeat),
        totalSeats: Number(totalSeats),
        activeDays
    };
    onSave(routeData);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="from" label="From" value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g., Peenya Industrial Area" required/>
            <Input id="to" label="To" value={to} onChange={e => setTo(e.target.value)} placeholder="e.g., Majestic Bus Stand" required/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input id="time" label="Departure Time" type="text" value={departureTime} onChange={e => setDepartureTime(e.target.value)} placeholder="e.g., 08:00 AM" required/>
            <Input id="cost" label="Cost/Seat (₹)" type="number" value={costPerSeat} onChange={e => setCostPerSeat(e.target.value)} placeholder="e.g., 50" required min="0"/>
            <Input id="seats" label="Total Seats" type="number" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} placeholder="e.g., 12" required min="1"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Active Days</label>
            <div className="flex flex-wrap gap-2">
                {scheduleOptions.map(dayInfo => (
                   <DayButton 
                        key={dayInfo.date} 
                        day={dayInfo.day}
                        dayOfMonth={dayInfo.dayOfMonth}
                        isSelected={selectedDates.has(dayInfo.date)} 
                        onClick={() => handleDayClick(dayInfo.date)} 
                    />
                ))}
            </div>
             <p className="text-xs text-slate-500 mt-2">Unselect a day to mark yourself as unavailable.</p>
        </div>
        <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>
                Save Route
            </Button>
        </div>
      </form>
    </Modal>
  );
};