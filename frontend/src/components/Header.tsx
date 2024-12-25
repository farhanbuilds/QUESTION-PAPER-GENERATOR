import React from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';

export function Header() {
  return (
    < ConditionalRendering />
  );
}

function ConditionalRendering(){
  const location = useLocation();  

  if (location.pathname === "/") {
    return <header className="fixed w-full top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-blue-400" />
        <span className="text-xl font-bold text-white">UnrealHeroes</span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
        <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How it Works</a>
        <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Pricing</a>
        <a href="/upload"><button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
          Get Started
        </button></a>
      </nav>
      
      <button className="md:hidden text-gray-300">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  </header>
  }
  else {
    return <header className=" w-full top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-6 w-6 text-blue-400" />
        <span className="text-xl font-bold text-white">UnrealHeroes</span>
      </div>
      
      <button className="md:hidden text-gray-300">
        <Menu className="h-6 w-6" />
      </button>
    </div>
  </header>
  }
}