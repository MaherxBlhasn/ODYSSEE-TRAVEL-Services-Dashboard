'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import React from 'react'
import { resetPasswordService } from '@/lib/services/resetPassword.service';
import Spinner from '@/components/ui/Spinner';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import LoginBackground from '@/components/ui/loginBackground';
import LoginAnimation from '@/components/ui/loginAnimation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // Redirect to request reset if no token
      router.push('/request-reset');
    }
  }, [searchParams, router]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', {
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
      return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError, {
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
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordService.resetPassword({
        token,
        newPassword: password,
        //confirmPassword: confirmPassword
      });
      
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
        toast.success('Password reset successfully!', {
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
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch {
      toast.error('Failed to reset password. Please try again.', {
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
      
      <LoginBackground />

      {/* Reset Password Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">ODYSSEE</h1>
            <p className="text-orange-400 text-sm mb-2 tracking-wide">TRAVEL SERVICE</p>
            
            {!isSuccess ? (
              <>
                <h2 className="text-xl font-semibold text-white mb-6">Set New Password</h2>
                <p className="text-slate-300 text-sm mb-8">
                  Enter your new password below. Make sure it&apos;s strong and secure.
                </p>
                
                <form className="space-y-6" onSubmit={handleResetPassword}>
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                      required
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="text-left text-xs text-slate-400 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="space-y-1 ml-2">
                      <li className={password.length >= 8 ? 'text-green-400' : 'text-slate-400'}>
                        • At least 8 characters
                      </li>
                      <li className={/(?=.*[a-z])/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                        • One lowercase letter
                      </li>
                      <li className={/(?=.*[A-Z])/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                        • One uppercase letter
                      </li>
                      <li className={/(?=.*\d)/.test(password) ? 'text-green-400' : 'text-slate-400'}>
                        • One number
                      </li>
                    </ul>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Spinner /> : 'Reset Password'}
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
                <h2 className="text-xl font-semibold text-white mb-4">Password Reset Successfully!</h2>
                <p className="text-slate-300 text-sm mb-8">
                  Your password has been reset successfully. You will be redirected to the login page in a few seconds.
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