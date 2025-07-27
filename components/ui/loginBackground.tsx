import React from 'react'

const LoginBackground = () => {
    return (
    <div>
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
    
    </div>
    )
}

export default LoginBackground