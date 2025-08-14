import React, { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import type { DriverRoute, WeekDay } from '../types';
import { WeekDay as WeekDayEnum } from '../types';

interface ManageRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (route: Omit<DriverRoute, 'id'>) => Promise<void>;
  currentRoute: DriverRoute | null;
  isSaving: boolean;
  title: string;
}

const DayButton: React.FC<{ day: WeekDay; isSelected: boolean; onClick: () => void }> = ({ day, isSelected, onClick }) => {
    const baseClasses = "px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex-1";
    const selectedClasses = "bg-indigo-600 text-white shadow-sm";
    const unselectedClasses = "bg-slate-200 text-slate-700 hover:bg-slate-300";
    return (
        <button type="button" onClick={onClick} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            {day}
        </button>
    );
};


export const ManageRouteModal: React.FC<ManageRouteModalProps> = ({ isOpen, onClose, onSave, currentRoute, isSaving, title }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [costPerSeat, setCostPerSeat] = useState<number | string>('');
  const [activeDays, setActiveDays] = useState<WeekDay[]>([]);

  useEffect(() => {
    if (isOpen && currentRoute) {
      setFrom(currentRoute.from);
      setTo(currentRoute.to);
      setDepartureTime(currentRoute.departureTime);
      setCostPerSeat(currentRoute.costPerSeat);
      setActiveDays(currentRoute.activeDays);
    } else if (isOpen && !currentRoute) {
      // Reset form for a new route
      setFrom('');
      setTo('');
      setDepartureTime('08:00 AM');
      setCostPerSeat('');
      setActiveDays(Object.values(WeekDayEnum).slice(0, 5)); // Default to weekdays
    }
  }, [isOpen, currentRoute]);

  const handleDayClick = (day: WeekDay) => {
    setActiveDays(prevDays => 
      prevDays.includes(day)
        ? prevDays.filter(d => d !== day)
        : [...prevDays, day]
    );
  };

  const handleSave = () => {
    const routeData = {
        from,
        to,
        departureTime,
        costPerSeat: Number(costPerSeat),
        activeDays
    };
    onSave(routeData);
  }

  const weekDays: WeekDay[] = Object.values(WeekDayEnum);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="from" label="From" value={from} onChange={e => setFrom(e.target.value)} placeholder="e.g., Peenya Industrial Area" required/>
            <Input id="to" label="To" value={to} onChange={e => setTo(e.target.value)} placeholder="e.g., Majestic Bus Stand" required/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="time" label="Departure Time" type="text" value={departureTime} onChange={e => setDepartureTime(e.target.value)} placeholder="e.g., 08:00 AM" required/>
            <Input id="cost" label="Cost Per Seat (₹)" type="number" value={costPerSeat} onChange={e => setCostPerSeat(e.target.value)} placeholder="e.g., 50" required min="0"/>
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Active Days</label>
            <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                   <DayButton key={day} day={day} isSelected={activeDays.includes(day)} onClick={() => handleDayClick(day)} />
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