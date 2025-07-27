'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import { authService } from '@/lib/services/auth.service';
import Spinner from '@/components/ui/Spinner';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import LoginBackground from '@/components/ui/loginBackground';
import LoginAnimation from '@/components/ui/loginAnimation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    console.log("before auth")
    const check = async () => {
      const { authenticated } = await authService.checkAuth();

      if (authenticated) {
        console.log("authenticated AuthGuard(login):",authenticated)

        router.push('/dashboard'); // Redirect if authenticated
      }
    }
    check();
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setError('');

    // Your login logic here
    try {
      const response = await authService.login({ Email: email, password: password });
      console.log('response handlelogin:', response);
      router.push('/dashboard');
    } catch {
      toast.error('Invalid credentials !', {
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
      // setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }

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
    <LoginBackground/>

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
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                  required
                />
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

