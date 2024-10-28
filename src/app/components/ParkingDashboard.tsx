"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Car, MapPin, Navigation, X } from 'lucide-react';

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

const ParkingDashboard: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [parkingData, setParkingData] = useState<ParkingData>({
    areas: [
      {
        id: 1,
        name: 'Carpark B',
        totalSpots: 30,
        availableSpots: 16,
        status: 'active',
        location: {
          lat: 1.347075756148789,
          lng: 103.9313338869917,
          address: 'Temasek Polytechnic Carpark B'
        },
        infoPosition: { x: 200, y: 50 },
        indicatorPosition: {
          start: { x: 275, y: 130 },
          end: { x: 210, y: 250 }
        }
      },
      {
        id: 2,
        name: 'Carpark C',
        totalSpots: 50,
        availableSpots: 25,
        status: 'active',
        location: {
          lat: 1.3456335152740582,
          lng: 103.93454627540778,
          address: 'Temasek Polytechnic Carpark C'
        },
        infoPosition: { x: 240, y: 350 },
        indicatorPosition: {
          start: { x: 240, y: 390 },
          end: { x: 205, y: 390 }
        }
      },
      {
        id: 3,
        name: 'Carpark E',
        totalSpots: 40,
        availableSpots: 5,
        status: 'maintenance',
        location: {
          lat: 1.3445904632624452,
          lng: 103.93353543295807,
          address: 'Temasek Polytechnic Carpark E'
        },
        infoPosition: { x: 600, y: 350 },
        indicatorPosition: {
          start: { x: 600, y: 390 },
          end: { x: 515, y: 405 }
        }
      }
    ],
    lastUpdated: new Date().toISOString(),
  });

  // Simulate data updates
  useEffect(() => {
    const updateRandomSpots = () => {
      setParkingData(prevData => ({
        ...prevData,
        areas: prevData.areas.map(area => ({
          ...area,
          availableSpots: Math.max(0, Math.min(
            area.totalSpots,
            area.availableSpots + Math.floor(Math.random() * 3) - 1
          )),
        })),
        lastUpdated: new Date().toISOString(),
      }));
    };

    const interval = setInterval(updateRandomSpots, 5000);
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

  // Filter areas based on selection
  const displayedAreas = selectedArea
    ? parkingData.areas.filter(area => area.id === selectedArea)
    : parkingData.areas;
    return (
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
    );
  };
  
  export default ParkingDashboard;