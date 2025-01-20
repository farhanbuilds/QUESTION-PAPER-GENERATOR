import React from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

export function Header() {
  return (
    < ConditionalRendering />    
  );
}

function ConditionalRendering(){
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();  

  if (location.pathname === "/") {
    return <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <a href="/" className="text-2xl font-bold text-indigo-600">
            UNREAL HEROES
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
          <a href="/upload">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Get Started
          </button>
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#features"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              How it Works
            </a>
            <button className="w-full text-left px-3 py-2 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
    </header>
  }
  else {
    return <header className="fixed w-full top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
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