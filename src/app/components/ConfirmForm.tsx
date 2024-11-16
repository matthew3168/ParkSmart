'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/auth';
import Image from 'next/image';

const ConfirmForm = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await auth.confirmSignUp(username, code);
      router.push('/login?confirmed=true');
    } catch (err: any) {
      console.error('Confirmation error:', err);
      setError(err.message || 'Failed to confirm registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await auth.resendConfirmationCode(username);
      alert('A new confirmation code has been sent to your email.');
    } catch (err: any) {
      console.error('Resend code error:', err);
      setError(err.message || 'Failed to resend confirmation code. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <Image 
        src="/images/ParkSmartLogo.jpg"
        width={800}
        height={450}
        alt="ParkSmart Logo"
        priority
      />
      <h2 className="text-2xl font-bold text-center mb-8">Confirm Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Confirmation Code
          </label>
          <input
            id="code"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
            placeholder="Enter 6-digit code"
          />
          <p className="mt-1 text-xs text-gray-500">
            Please enter the verification code sent to your email
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirming...
            </>
          ) : (
            'Confirm Account'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Resend confirmation code
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmForm;