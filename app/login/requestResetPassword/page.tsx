'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { resetPasswordService } from '@/lib/services/resetPassword.service';
import Spinner from '@/components/ui/Spinner';
import { Bounce, ToastContainer, toast } from 'react-toastify';

export default function RequestResetPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await resetPasswordService.requestReset(email);
      
      if (response.error) {
        toast.error(response.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      } else {
        setIsSuccess(true);
        toast.success('Reset link sent to your email!', {
          position: "top-right",
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
        position: "top-right",
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
        position="top-right"
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
      
      {/* Animated Plane Shapes */}
      <div className="absolute inset-0">
        {/* Plane 1 */}
        <div className="absolute top-20 left-0 w-8 h-8 transform -rotate-45 animate-pulse" style={{ animationDuration: '4s' }}>
          <div className="w-full h-1 bg-orange-500 rounded-full"></div>
          <div className="w-6 h-1 bg-orange-500 rounded-full mt-1 ml-1"></div>
          <div className="w-4 h-1 bg-orange-500 rounded-full mt-1 ml-2"></div>
          <div className="absolute top-0 left-7 w-1 h-4 bg-orange-500 rounded-full transform rotate-90"></div>
        </div>

        {/* Plane 2 */}
        <div className="absolute top-1/3 right-20 w-6 h-6 transform rotate-45 animate-bounce" style={{ animationDuration: '5s' }}>
          <div className="w-full h-1 bg-slate-400 rounded-full"></div>
          <div className="w-4 h-1 bg-slate-400 rounded-full mt-1 ml-1"></div>
          <div className="w-3 h-1 bg-slate-400 rounded-full mt-1 ml-1"></div>
          <div className="absolute top-0 left-5 w-1 h-3 bg-slate-400 rounded-full transform rotate-90"></div>
        </div>

        {/* Plane 3 */}
        <div className="absolute bottom-1/4 left-1/4 w-10 h-10 transform rotate-12 animate-pulse" style={{ animationDuration: '6s' }}>
          <div className="w-full h-1 bg-blue-400 rounded-full"></div>
          <div className="w-8 h-1 bg-blue-400 rounded-full mt-1 ml-1"></div>
          <div className="w-6 h-1 bg-blue-400 rounded-full mt-1 ml-2"></div>
          <div className="absolute top-0 left-9 w-1 h-5 bg-blue-400 rounded-full transform rotate-90"></div>
        </div>
      </div>

      {/* Floating Travel Elements */}
      <div className="absolute inset-0">
        {/* Luggage Shape */}
        <div className="absolute top-1/4 left-1/5 w-4 h-6 bg-orange-500 rounded-sm opacity-60 animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/4 left-1/5 w-4 h-1 bg-orange-600 rounded-full mt-2"></div>

        {/* Passport Shape */}
        <div className="absolute bottom-1/3 right-1/3 w-6 h-8 bg-slate-600 rounded-sm opacity-50 animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-2 bg-slate-700 rounded-t-sm"></div>

        {/* Compass Shape */}
        <div className="absolute top-2/3 left-1/3 w-8 h-8 border-2 border-blue-400 rounded-full opacity-40 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-blue-400 rounded-full mt-3 ml-3"></div>
      </div>

      {/* Smooth Flowing Shapes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-600 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-slate-600 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }}></div>
      </div>

      {/* Animated Dots Trail */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-20 w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-44 left-32 w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-48 left-44 w-2 h-2 bg-orange-500 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>

        <div className="absolute bottom-40 right-20 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-44 right-32 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1.5s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-48 right-44 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      </div>

      {/* Cloud Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-16 right-1/4 opacity-20">
          <div className="w-16 h-8 bg-slate-300 rounded-full"></div>
          <div className="w-12 h-6 bg-slate-300 rounded-full -mt-4 ml-2"></div>
          <div className="w-8 h-4 bg-slate-300 rounded-full -mt-2 ml-6"></div>
        </div>

        <div className="absolute bottom-32 left-1/6 opacity-15">
          <div className="w-20 h-10 bg-slate-300 rounded-full"></div>
          <div className="w-16 h-8 bg-slate-300 rounded-full -mt-6 ml-2"></div>
          <div className="w-10 h-6 bg-slate-300 rounded-full -mt-3 ml-8"></div>
        </div>
      </div>

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
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes drift {
          0% { transform: translateX(0px); }
          100% { transform: translateX(100px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-drift {
          animation: drift 15s linear infinite;
        }
      `}</style>
    </div>
  );
};