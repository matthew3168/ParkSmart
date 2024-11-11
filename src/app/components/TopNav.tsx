"use client";

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from './AuthProvider';


const TopNav = () => {
    const { signOut } = useAuth();

  
    return (
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  ParkSmart
                </span>
              </div>
            </div>
  
            <div className="flex items-center">
              <button
                onClick={signOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default TopNav;
