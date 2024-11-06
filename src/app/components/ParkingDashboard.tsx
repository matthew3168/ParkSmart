"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Car, MapPin, X } from 'lucide-react';
import TopNav from './TopNav';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface ParkingArea {
  id: number;
  name: string;
  totalSpots: number;
  availableSpots: number;
  status: 'active' | 'maintenance';
  location: Location;
  infoPosition: {
    x: number;
    y: number;
  };
  indicatorPosition: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  };
}

interface ParkingData {
  areas: ParkingArea[];
  lastUpdated: string;
}

const API_URL = '/api/parking'; // Replace with your actual API Gateway URL

const ParkingDashboard: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [parkingData, setParkingData] = useState<ParkingData>({
    areas: [],
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParkingData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch parking data');
      }
      const data = await response.json();
      setParkingData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load parking data');
      console.error('Error fetching parking data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/parking');
        const data = await response.json();
        setParkingData(data);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchParkingData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const getOccupancyColor = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return '#22c55e'; // green
    if (percentage > 10) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getOccupancyColorClass = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading parking data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNav />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={fetchParkingData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Filter areas based on selection
  const displayedAreas = selectedArea
    ? parkingData.areas.filter(area => area.id === selectedArea)
    : parkingData.areas;

  return (
    <>
      <TopNav />
      <main className="pt-16">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">TP Parking Management System</h1>
            <p className="text-gray-600">
              Last updated: {new Date(parkingData.lastUpdated).toLocaleString()}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <Car className="h-8 w-8 mr-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spots</p>
                  <h3 className="text-2xl font-bold">
                    {parkingData.areas.reduce((acc, area) => acc + area.totalSpots, 0)}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <MapPin className="h-8 w-8 mr-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Spots</p>
                  <h3 className="text-2xl font-bold">
                    {parkingData.areas.reduce((acc, area) => acc + area.availableSpots, 0)}
                  </h3>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center p-6">
                <Activity className="h-8 w-8 mr-4 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Areas</p>
                  <h3 className="text-2xl font-bold">
                    {parkingData.areas.filter((area) => area.status === 'active').length}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Map */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Campus Parking Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[16/9] w-full">
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full"
                  style={{ backgroundColor: '#f8fafc' }}
                  onClick={() => setSelectedArea(null)}
                >
                  {/* Base Map */}
                  <image 
                    href="/images/tp-map.jpg"
                    width="800" 
                    height="450"
                    preserveAspectRatio="xMidYMid slice"
                  />
                  
                  {/* Parking Areas Info Boxes */}
                  {parkingData.areas.map((area) => (
                    <g
                      key={area.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedArea(selectedArea === area.id ? null : area.id);
                      }}
                      style={{ cursor: 'pointer' }}
                      className={`transition-all duration-200 ${
                        selectedArea === area.id ? 'opacity-100' : 'opacity-90'
                      } hover:opacity-100`}
                    >
                      {/* Connecting Line */}
                      <line
                        x1={area.indicatorPosition.start.x}
                        y1={area.indicatorPosition.start.y}
                        x2={area.indicatorPosition.end.x}
                        y2={area.indicatorPosition.end.y}
                        stroke={getOccupancyColor(area.availableSpots, area.totalSpots)}
                        strokeWidth="3"
                      />

                      {/* Info Box */}
                      <rect
                        x={area.infoPosition.x}
                        y={area.infoPosition.y}
                        width="150"
                        height="80"
                        rx="4"
                        fill="white"
                        stroke={getOccupancyColor(area.availableSpots, area.totalSpots)}
                        strokeWidth="2"
                        className="drop-shadow-lg"
                      />
                      
                      {/* Title */}
                      <text
                        x={area.infoPosition.x + 75}
                        y={area.infoPosition.y + 25}
                        textAnchor="middle"
                        className="font-semibold text-sm"
                        pointerEvents="none"
                      >
                        {area.name}
                      </text>
                      
                      {/* Available/Total */}
                      <text
                        x={area.infoPosition.x + 75}
                        y={area.infoPosition.y + 55}
                        textAnchor="middle"
                        className="text-2xl font-bold"
                        fill={getOccupancyColor(area.availableSpots, area.totalSpots)}
                        pointerEvents="none"
                      >
                        {area.availableSpots}/{area.totalSpots}
                      </text>
                      
                      {/* Status Indicator */}
                      <circle
                        cx={area.infoPosition.x + 75}
                        cy={area.infoPosition.y + 70}
                        r="4"
                        fill={area.status === 'active' ? '#22c55e' : '#eab308'}
                        pointerEvents="none"
                      />
                    </g>
                  ))}

                  {/* Legend */}
                  <g transform="translate(620, 20)" pointerEvents="none">
                    <rect
                      x="0"
                      y="0"
                      width="160"
                      height="80"
                      fill="white"
                      rx="4"
                      className="drop-shadow-lg"
                    />
                    <text x="10" y="20" className="text-xs font-semibold">Legend</text>
                    <circle cx="20" cy="40" r="4" fill="#22c55e" />
                    <text x="35" y="44" className="text-xs">Available</text>
                    <circle cx="20" cy="60" r="4" fill="#eab308" />
                    <text x="35" y="64" className="text-xs">Limited</text>
                    <circle cx="100" cy="40" r="4" fill="#ef4444" />
                    <text x="115" y="44" className="text-xs">Full</text>
                  </g>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Carpark List Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Carpark Status</h2>
              {selectedArea && (
                <button
                  onClick={() => setSelectedArea(null)}
                  className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                >
                  Show All Carparks
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAreas.map((area) => (
                <Card key={area.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {area.name}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          area.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {area.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Available Spots</span>
                        <span className="font-bold">{area.availableSpots}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Spots</span>
                        <span className="font-bold">{area.totalSpots}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${getOccupancyColorClass(
                            area.availableSpots,
                            area.totalSpots
                          )}`}
                          style={{ width: `${(area.availableSpots / area.totalSpots) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ParkingDashboard;