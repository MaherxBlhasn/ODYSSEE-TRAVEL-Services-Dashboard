'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { resetPasswordService } from '@/lib/services/resetPassword.service';
import Spinner from '@/components/ui/Spinner';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import LoginBackground from '@/components/ui/loginBackground';
import LoginAnimation from '@/components/ui/loginAnimation';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null); // Clear previous errors

    try {
      const response = await resetPasswordService.requestReset(email);
      
      if (response.error) {
        setFormError(response.error); // 👈 Save error to display in UI
      } else {
        setIsSuccess(true);
        toast.success('Reset link sent to your email!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (err) {
      toast.error('Failed to send reset link. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      
      <LoginBackground/>

      {/* Reset Request Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">ODYSSEE</h1>
            <p className="text-orange-400 text-sm mb-2 tracking-wide">TRAVEL SERVICE</p>
            
            {!isSuccess ? (
              <>
                <h2 className="text-xl font-semibold text-white mb-6">Reset Password</h2>
                <p className="text-slate-300 text-sm mb-8">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                    {/* 👇 Show the error if exists */}
                {formError && (
                  <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500 text-red-400 text-sm">
                    {formError}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleRequestReset}>
                  <div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Spinner /> : 'Send Reset Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">Check Your Email</h2>
                <p className="text-slate-300 text-sm mb-8">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToLogin}
                className="text-slate-400 hover:text-orange-400 text-sm transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
        <LoginAnimation/>
    </div>
  );
};