import React from 'react';
import type { OptimizedRouteData } from '../types';
import { Card } from './common/Card';
import { SPARKLES_ICON } from '../constants';

interface OptimizedRouteCardProps {
  routeData: OptimizedRouteData;
}

export const OptimizedRouteCard: React.FC<OptimizedRouteCardProps> = ({ routeData }) => {
  return (
    <Card className="mt-8">
      <div className="p-5 bg-primary text-white">
        <div className="flex items-center">
            {SPARKLES_ICON}
            <h3 className="text-xl font-bold ml-2">AI-Optimized Route</h3>
        </div>
        <p className="text-sm text-orange-100 mt-1">{routeData.routeName}</p>
      </div>
      <div className="p-5">
        <div className="mb-4">
            <h4 className="font-semibold text-slate-700">Route Summary</h4>
            <p className="text-slate-600 italic">"{routeData.summary}"</p>
            <p className="font-bold mt-2">Est. Duration: {routeData.estimatedDuration}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 mb-2">Recommended Stops</h4>
          <ol className="relative border-l border-slate-200">
            {routeData.stops.map((stop, index) => (
              <li key={index} className="mb-4 ml-4">
                <div className="absolute w-3 h-3 bg-slate-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                <p className="font-medium text-slate-800">{stop}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Card>
  );
};