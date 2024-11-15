'use client';

import { useState, useEffect } from 'react';
import AdminProtected from '@/app/components/AdminProtected';
import { Car, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';

interface Area {
  name: string;
  totalSpots: number;
  availableSpots: number;
  status: string;
}

interface ParkingData {
  areas: Area[];
  lastUpdated: string;
}

const useParkingData = () => {
  const [data, setData] = useState<ParkingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/parking');
        const parkingData = await response.json();
        setData(parkingData);
      } catch (error) {
        console.error('Error fetching parking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
};

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { data, loading } = useParkingData();

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const totalSpots = data?.areas.reduce((sum, area) => sum + area.totalSpots, 0) || 0;
  const totalAvailable = data?.areas.reduce((sum, area) => sum + area.availableSpots, 0) || 0;
  const activeAreas = data?.areas.filter(area => area.status === 'active').length || 0;

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">ParkSmart Admin</h1>
            <div className="text-white text-sm">
              Last updated: {new Date(data?.lastUpdated || '').toLocaleString()}
            </div>
            <button 
              onClick={handleSignOut}
              className="text-white flex items-center gap-2 hover:text-gray-200"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Spots</p>
                  <h3 className="text-2xl font-bold">{totalSpots}</h3>
                </div>
                <Car className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Available Spots</p>
                  <h3 className="text-2xl font-bold">{totalAvailable}</h3>
                </div>
                <MapPin className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Active Areas</p>
                  <h3 className="text-2xl font-bold">{activeAreas}</h3>
                </div>
                <MapPin className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {data?.areas.map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">{area.name}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Available Spots</span>
                      <span className="font-bold">{area.availableSpots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Spots</span>
                      <span className="font-bold">{area.totalSpots}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${(area.availableSpots / area.totalSpots * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <iframe
              src="/api/kibana"
              className="w-full h-[600px] border-0"
              title="Kibana Dashboard"
            />
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}