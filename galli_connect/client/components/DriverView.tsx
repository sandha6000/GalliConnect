
import React, { useState, useEffect } from 'react';
import type { AiAnalysisResult } from '../types';
import { getTripRequests } from '../services/api';
import { generateOptimalRoute } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { DemandHeatmap } from './DemandHeatmap';
import { OptimizedRouteCard } from './OptimizedRouteCard';

export const DriverView: React.FC = () => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const tripRequests = await getTripRequests();
      const result = await generateOptimalRoute(tripRequests);
      setAnalysis(result);
    } catch (err) {
      setError('Could not get AI analysis. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Driver Dashboard</h1>
        <Button onClick={fetchAndAnalyze} isLoading={isLoading} variant="secondary">
          Refresh Analysis
        </Button>
      </div>

      {isLoading && <Spinner text="Analyzing today's demand... This may take a moment." />}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      {!isLoading && !analysis && !error && (
        <div className="text-center mt-8 py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-slate-700">No analysis available.</h3>
            <p className="text-slate-500 mt-2">Click "Refresh Analysis" to get started.</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DemandHeatmap hotspots={analysis.demandHotspots} />
          </div>
          <div>
            <OptimizedRouteCard routeData={analysis.optimizedRoute} />
          </div>
        </div>
      )}
    </div>
  );
};
