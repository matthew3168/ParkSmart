'use client';

import { useRouter } from 'next/navigation';
import { Building } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Image 
            src="/images/ParkSmartLogo.jpg"  // Note: no need for ../public
            width={800}
            height={450}
            alt="ParkSmart Logo"
            priority  // If this is an important above-the-fold image
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            TP Parking Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage and monitor parking spaces efficiently
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </button>
          
          <button
            onClick={() => router.push('/register')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}