
import React from 'react';
import type { DemandHotspot } from '../types';
import { Card } from './common/Card';

interface DemandHeatmapProps {
  hotspots: DemandHotspot[];
}

const getDemandColor = (score: number) => {
  if (score >= 8) return 'bg-red-500 text-white';
  if (score >= 6) return 'bg-amber-400 text-slate-800';
  return 'bg-yellow-300 text-slate-800';
};

export const DemandHeatmap: React.FC<DemandHeatmapProps> = ({ hotspots }) => {
  return (
    <Card>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800">Demand Hotspots Today</h3>
        <p className="text-sm text-slate-500">Areas with high passenger demand.</p>
      </div>
      <div className="space-y-4 p-5 bg-slate-50">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg text-slate-700">{hotspot.location}</h4>
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${getDemandColor(hotspot.demandScore)}`}>
                Demand: {hotspot.demandScore}/10
              </span>
            </div>
            <p className="mt-2 text-slate-600">{hotspot.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
