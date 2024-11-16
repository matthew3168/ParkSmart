'use client';

import { useRouter } from 'next/navigation';
import ConfirmForm from '../components/ConfirmForm';
import { ArrowLeft } from 'lucide-react';

export default function ConfirmPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button
          onClick={() => router.push('/register')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Register
        </button>
      </div>
      <div className="flex flex-col items-center pt-8">
        <ConfirmForm />
      </div>
    </div>
  );
}