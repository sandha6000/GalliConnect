import React from 'react';

export const NAGARAYATRA_LOGO = ({ className = 'w-48' }: { className?: string }) => (
    <div className={`relative ${className}`}>
        <svg viewBox="0 0 170 100" xmlns="http://www.w3.org/2000/svg" aria-label="Nagarayatra Logo">
            <g stroke="#27272A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Wheels */}
                <circle cx="45" cy="80" r="9" fill="#27272A" />
                <circle cx="125" cy="80" r="9" fill="#27272A" />
                <circle cx="45" cy="80" r="3" fill="#FEFBF6" stroke="none" />
                <circle cx="125" cy="80" r="3" fill="#FEFBF6" stroke="none" />

                {/* Main Body */}
                <path d="M20 80 V 45 C 20 40 25 35 30 35 H 140 C 145 35 150 40 150 45 V 80" fill="#F97316" />
                <path d="M20 80 H 150" />
                
                {/* Decorative Pattern */}
                <path d="M70 60 C 70 70, 90 70, 90 60 L 80 50 Z" fill="#EF4444" />
                <path d="M75 78 a5,5 0 0 1 10,0 v2 H75 Z" fill="#3B82F6" />
                
                {/* Windows */}
                <rect x="30" y="45" width="30" height="20" rx="2" fill="#FEFBF6" />
                <rect x="100" y="45" width="30" height="20" rx="2" fill="#FEFBF6" />

                {/* Roof Layers */}
                <path d="M28 35 L 33 27 H 137 L 142 35" fill="#3B82F6" />
                <path d="M33 27 L 38 19 H 132 L 137 27" fill="#FBBF24" />
                
                {/* Roof Ornament */}
                <path d="M80 19 C 80 14 90 14 90 19" fill="#8B5CF6" />
                <circle cx="85" cy="11" r="3" fill="#FBBF24"/>
                
                {/* Mirror */}
                <path d="M150 50 a5,5 0 0 1 5,5 v 5 a5,5 0 0 1 -5,5" />
            </g>
        </svg>
    </div>
);


export const BUS_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" strokeLinecap="round" strokeLinejoin="round">
      {/* Wheels */}
      <circle cx="7" cy="19" r="2.5" />
      <circle cx="21" cy="19" r="2.5" />
      
      {/* Bus Body */}
      <path d="M3 19V9a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v10" />
      <path d="M3 14h22" />
      
      {/* Roof */}
      <path d="M7 7L9 4h10l2 3" />
      <path d="M12 4v-2h4v2" />
  </svg>
);


export const LOCATION_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const CLOCK_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
  </svg>
);

export const SEAT_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
        <path fillRule="evenodd" d="M15.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export const SPARKLES_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-9l2-2m0 0l2 2m-2-2v4m2 10l-2-2m0 0l-2 2m2-2v-4M21 3l-2 2m0 0l-2-2m2 2v4M12 21l2-2m0 0l2 2m-2-2v-4" />
    </svg>
);


export const LOGOUT_ICON = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);