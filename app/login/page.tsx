'use client'

import { useRouter } from 'next/navigation'
import {  useState } from 'react'
import React from 'react'
import { authService } from '@/lib/services/auth.service';
import Spinner from '@/components/ui/Spinner';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import LoginBackground from '@/components/ui/loginBackground';
import LoginAnimation from '@/components/ui/loginAnimation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext'


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth()




  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login({ Email: email, password: password });
      console.log('response handlelogin:', response);
      setUser(response.user);

      // // Show success toast
      // toast.success(`Welcome back! ${response?.user?.username}`, {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      //   transition: Bounce,
      // });
      // setTimeout(() => {
      //   // Redirect to dashboard after a short delay
      // }, 2000);
      router.push('/dashboard');
    } catch (error: unknown) {
      // Check if it's a network/server error or a backend error
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error instanceof Error) {
        if (error.message && !error.message.includes('fetch')) {
          // If we have a specific error message from backend (not a fetch error)
          errorMessage = error.message;
        } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
          // Server is down or network issues
          errorMessage = 'Server Error';
        }
      } else if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'NETWORK_ERROR') {
        // Handle network error objects
        errorMessage = 'Server Error';
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

      {/* Login Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">ODYSSEE</h1>
            <p className="text-orange-400 text-sm mb-8 tracking-wide">TRAVEL SERVICE</p>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-400 transition-colors duration-300 focus:outline-none focus:text-orange-400"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Spinner /> : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login/requestResetPassword"
                className={`text-slate-400 hover:text-orange-400 text-sm transition-colors duration-300 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <LoginAnimation />
    </div>
  );
};