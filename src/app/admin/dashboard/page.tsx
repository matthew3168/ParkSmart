// src/app/admin/dashboard/page.tsx
'use client';

import AdminProtected from '@/app/components/AdminProtected';
import { 
  Car, 
  Users, 
  MapPin,
  Clock,
  Calendar,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/login');
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-blue-600 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">ParkSmart Admin</h1>
            <div className="text-white text-sm">
              Last updated: 11/11/2024, 10:00:57 am
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
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Spots</p>
                  <h3 className="text-2xl font-bold">24</h3>
                </div>
                <Car className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Available Spots</p>
                  <h3 className="text-2xl font-bold">7</h3>
                </div>
                <MapPin className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Active Areas</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
                <MapPin className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          {/* Carpark Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* East Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">East</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Available Spots</span>
                    <span className="font-bold">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spots</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '12.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* West Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">West</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Available Spots</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spots</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Central Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Central</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Available Spots</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spots</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center">
                  <Car className="text-blue-600 mb-2" size={24} />
                  <span className="text-sm font-medium">Update Spots</span>
                </div>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex flex-col items-center">
                  <Users className="text-green-600 mb-2" size={24} />
                  <span className="text-sm font-medium">Manage Users</span>
                </div>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex flex-col items-center">
                  <MapPin className="text-purple-600 mb-2" size={24} />
                  <span className="text-sm font-medium">View Map</span>
                </div>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="flex flex-col items-center">
                  <Clock className="text-orange-600 mb-2" size={24} />
                  <span className="text-sm font-medium">View History</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}