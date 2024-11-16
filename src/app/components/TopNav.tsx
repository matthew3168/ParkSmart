import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';
import Image from 'next/image';

const TopNav = () => {
    const { signOut } = useAuth();
    
    return (
      <nav className="bg-blue-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image 
              src="/images/ParkSmartLogo.jpg"
              alt="ParkSmart Logo"
              width={45}
              height={45}
              className="rounded-full"
            />
            <h1 className="text-white text-2xl font-bold">
              ParkSmart
            </h1>
          </div>
          
          <button
            onClick={signOut}
            className="text-white flex items-center gap-2 hover:text-gray-200"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </nav>
    );
};

export default TopNav;
