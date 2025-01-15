import React from 'react';
import { useLocation } from "react-router-dom";
import { Home, Layers, Info, CreditCard, User, CircleHelp, Phone} from 'lucide-react';

export function FloatingNav() {
  return (
    < ConditionalRendering />
  );
}

function ConditionalRendering(){
  const location = useLocation();

  if (location.pathname === "/") {
    return <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-0 rounded-full px-6 py-2 flex justify-evenly items-center gap-8 shadow-lg border  border-gray-800 z-50">
    <a href="#hero" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <Home className="h-5 w-5" />
      <span className="text-xs">Home</span>
    </a>
    <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <Layers className="h-5 w-5" />
      <span className="text-xs">Features</span>
    </a>
    <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <Info className="h-5 w-5" />
      <span className="text-xs">How It Works</span>
    </a>
    <a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <CreditCard className="h-5 w-5" />
      <span className="text-xs">Pricing</span>
    </a>
  </nav>
  }
  else {
    return <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm rounded-full px-6 py-2 flex justify-evenly items-center gap-8 shadow-lg border  border-gray-800 z-50">
    <a href="#hero" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <Home className="h-5 w-5" />
      <span className="text-xs">Home</span>
    </a>
    <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <User className="h-5 w-5" />
      <span className="text-xs">Profile</span>
    </a>
    <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <CircleHelp className="h-5 w-5" />
      <span className="text-xs">Help</span>
    </a>
    <a href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors flex flex-col items-center gap-1">
      <Phone className="h-5 w-5" />
      <span className="text-xs">Contact Us</span>
    </a>
  </nav>
  }
}