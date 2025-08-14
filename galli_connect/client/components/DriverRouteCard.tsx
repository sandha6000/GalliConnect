import React from 'react';
import type { DriverRoute } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { LOCATION_ICON, CLOCK_ICON } from '../constants';

interface DriverRouteCardProps {
    route: DriverRoute;
    onEdit: (route: DriverRoute) => void;
    onDelete: (routeId: string) => void;
    isDeleting: boolean;
}

export const DriverRouteCard: React.FC<DriverRouteCardProps> = ({ route, onEdit, onDelete, isDeleting }) => {
    return (
        <Card>
            <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center text-slate-700 font-semibold text-lg">
                            <span className="text-indigo-600">{LOCATION_ICON}</span>
                            <p className="ml-2">{route.from} &rarr; {route.to}</p>
                        </div>
                        <div className="flex items-center text-slate-600 mt-2">
                            {CLOCK_ICON}
                            <p className="ml-2">Departs at {route.departureTime}</p>
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
                            <p className="text-sm font-semibold text-slate-700 mb-2">Active Days:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {route.activeDays.length > 0 ? route.activeDays.map(day => (
                                    <span key={day} className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                                        {day}
                                    </span>
                                )) : <p className="text-sm text-slate-500">No active days.</p>}
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
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