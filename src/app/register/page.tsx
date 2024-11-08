'use client';

import { useRouter } from 'next/navigation';
import RegisterForm from '../components/RegisterForm';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>
      </div>
      <div className="flex flex-col items-center pt-8">
        <RegisterForm />
      </div>
    </div>
  );
}