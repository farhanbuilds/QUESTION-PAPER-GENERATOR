import React from 'react';
import { Brain } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping">
            <Brain className="h-16 w-16 text-white opacity-30" />
          </div>
          <div className="relative animate-bounce">
            <Brain className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Unreal Heroes
        </h2>
        
        {/* Loading Animation */}
        <div className="flex space-x-2 justify-center mb-8">
          <div className="w-3 h-3 bg-white rounded-full animate-loader1"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-loader2"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-loader3"></div>
        </div>

        {/* Loading Message */}
        <p className="text-white text-opacity-80 animate-pulse">
          Preparing your intelligent question paper generator...
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full animate-blob1"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-white opacity-5 rounded-full animate-blob2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-white opacity-5 rounded-full animate-blob3"></div>
      </div>
    </div>
  );
};

export default LoadingPage;