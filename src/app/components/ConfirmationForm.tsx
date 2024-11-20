'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/auth';
import Image from 'next/image';

const ConfirmationForm = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get and decode email and username from URL parameters
    const emailParam = searchParams.get('email');
    const usernameParam = searchParams.get('username');
    
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (usernameParam) setUsername(decodeURIComponent(usernameParam));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Ensure the verification code is a string and trimmed
      const cleanCode = verificationCode.trim();
      
      if (!username) {
        throw new Error('Username is missing. Please try registering again.');
      }

      const result = await auth.confirmSignUp({
        username,
        confirmationCode: cleanCode,
      });

      console.log('Confirmation successful:', result);
      
      // Add a small delay before redirect to ensure state updates are complete
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 100);
      
    } catch (err: any) {
      console.error('Confirmation error:', err);
      let errorMessage = 'Failed to confirm account. Please try again.';
      
      // Handle specific error cases
      if (err.name === 'SerializationException') {
        errorMessage = 'Invalid verification code format. Please check and try again.';
      } else if (err.name === 'ExpiredCodeException') {
        errorMessage = 'Verification code has expired. Please request a new code.';
      } else if (err.name === 'CodeMismatchException') {
        errorMessage = 'Incorrect verification code. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (!username) {
        throw new Error('Username is missing. Please try registering again.');
      }

      await auth.resendSignUpCode({
        username,
      });
      
      setError('A new verification code has been sent to your email.');
    } catch (err: any) {
      console.error('Resend code error:', err);
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If we don't have the required parameters, show an error state
  if (!email || !username) {
    return (
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <Image
          src="/images/ParkSmartLogo.jpg"
          width={800}
          height={450}
          alt="ParkSmart Logo"
          priority
        />
        <div className="text-center text-red-600 mt-4">
          <p>Missing required information. Please try registering again.</p>
          <button
            onClick={() => router.push('/register')}
            className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
          >
            Return to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <Image
        src="/images/ParkSmartLogo.jpg"
        width={800}
        height={450}
        alt="ParkSmart Logo"
        priority
      />
      <h2 className="text-2xl font-bold text-center mb-8">Confirm your account</h2>
      
      <p className="text-gray-600 mb-6 text-center">
        We have sent a code by email to{' '}
        <span className="font-medium">
          {email.replace(/(.{2})(.+)(@.+)/, '$1***$3')}
        </span>
        . Enter it below to confirm your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className={`px-4 py-3 rounded ${
            error.includes('has been sent') 
              ? 'bg-green-50 border border-green-400 text-green-700'
              : 'bg-red-50 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div>
          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
            Verification code
          </label>
          <input
            id="verificationCode"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isLoading}
            placeholder="Enter verification code"
            maxLength={6}
          />
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
            'Confirm account'
          )}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-600">Didn't receive a code? </span>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Send a new code
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationForm;
