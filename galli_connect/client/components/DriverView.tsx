
import React, { useState, useEffect } from 'react';
import type { AiAnalysisResult, DriverRoute, User } from '../types';
import { getTripRequests } from '../services/api';
import { generateOptimalRoute } from '../services/geminiService';
import { getDriverRoutes, addDriverRoute, updateDriverRoute, deleteDriverRoute } from '../services/DriverServiceInteractor';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { DemandHeatmap } from './DemandHeatmap';
import { OptimizedRouteCard } from './OptimizedRouteCard';
import { ManageRouteModal } from './ManageRouteModal';
import { Card } from './common/Card';
import { DriverRouteCard } from './DriverRouteCard';
import { ViewBookingsModal } from './ViewBookingsModal';

interface DriverViewProps {
  currentUser: User;
}

export const DriverView: React.FC<DriverViewProps> = ({ currentUser }) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [driverRoutes, setDriverRoutes] = useState<DriverRoute[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<DriverRoute | null>(null);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);

  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [routeForBookings, setRouteForBookings] = useState<DriverRoute | null>(null);


  const fetchAndAnalyze = async () => {
    setIsLoadingAnalysis(true);
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
      setIsLoadingAnalysis(false);
    }
  };

  const fetchRoutes = async () => {
    setIsLoadingRoutes(true);
    try {
        const routes = await getDriverRoutes(currentUser.id);
        setDriverRoutes(routes);
    } catch(e) {
        console.error("Failed to fetch driver routes", e);
        setError("Could not load your route details.");
    } finally {
        setIsLoadingRoutes(false);
    }
  };


  useEffect(() => {
    fetchAndAnalyze();
    fetchRoutes();
  }, []);
  
  const handleOpenAddModal = () => {
    setRouteToEdit(null);
    setIsRouteModalOpen(true);
  };

  const handleOpenEditModal = (route: DriverRoute) => {
    setRouteToEdit(route);
    setIsRouteModalOpen(true);
  };
  
  const handleDeleteRoute = async (routeId: string) => {
    if (window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
        setDeletingRouteId(routeId);
        try {
            await deleteDriverRoute(currentUser.id, routeId);
            setDriverRoutes(prev => prev.filter(r => r.id !== routeId));
        } catch(e) {
            console.error("Failed to delete route", e);
            setError("There was a problem deleting your route.");
        } finally {
            setDeletingRouteId(null);
        }
    }
  };

  const handleSaveRoute = async (routeData: Omit<DriverRoute, 'id'>) => {
    setIsSavingRoute(true);
    try {
      if (routeToEdit) {
        const updatedRoute = await updateDriverRoute(currentUser.id, { ...routeData, id: routeToEdit.id });
        setDriverRoutes(routes => routes.map(r => r.id === updatedRoute.id ? updatedRoute : r));
      } else {
        const newRoute = await addDriverRoute(currentUser.id, routeData);
        setDriverRoutes(routes => [...routes, newRoute]);
      }
      setIsRouteModalOpen(false);
    } catch(e) {
        console.error("Failed to save route", e);
        // In a real app, you might show an error inside the modal
    } finally {
        setIsSavingRoute(false);
    }
  };

  const handleViewBookings = (route: DriverRoute) => {
    setRouteForBookings(route);
    setIsBookingsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Driver Dashboard</h1>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">My Routes</h2>
            <Button onClick={handleOpenAddModal} variant="primary">
                Add New Route
            </Button>
        </div>
        {isLoadingRoutes ? (
            <Spinner text="Loading your routes..."/>
        ) : driverRoutes.length > 0 ? (
            <div className="space-y-6">
                {driverRoutes.map(route => (
                    <DriverRouteCard 
                        key={route.id} 
                        route={route} 
                        onEdit={handleOpenEditModal} 
                        onDelete={handleDeleteRoute}
                        onViewBookings={handleViewBookings}
                        isDeleting={deletingRouteId === route.id}
                    />
                ))}
            </div>
        ) : (
            <Card>
                <div className="p-8 text-center">
                    <h3 className="text-xl font-semibold text-slate-700">You haven't added any routes yet</h3>
                    <p className="text-slate-500 mt-2">Add a route to let passengers know about your schedule.</p>
                    <Button className="mt-4" onClick={handleOpenAddModal}>Add Your First Route</Button>
                </div>
            </Card>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 border-t pt-8 mt-8">
        <h2 className="text-2xl font-bold text-slate-800">AI Route Insights</h2>
        <Button onClick={fetchAndAnalyze} isLoading={isLoadingAnalysis} variant="secondary">
          Refresh AI Analysis
        </Button>
      </div>

      {isLoadingAnalysis && <Spinner text="Analyzing today's demand... This may take a moment." />}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      {!isLoadingAnalysis && !analysis && !error && (
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

      <ManageRouteModal 
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSave={handleSaveRoute}
        currentRoute={routeToEdit}
        isSaving={isSavingRoute}
        title={routeToEdit ? 'Edit Route' : 'Add New Route'}
      />

      <ViewBookingsModal 
        currentUser={currentUser}
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        route={routeForBookings}
      />
    </div>
  );
};