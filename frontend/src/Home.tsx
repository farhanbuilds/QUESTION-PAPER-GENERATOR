import React from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Features } from './components/Features.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { FloatingNav } from './components/FloatingNav.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main>
        <div id="hero"><Hero /></div>
        <div id="features"><Features /></div>
        <div id="how-it-works"><HowItWorks /></div>
      </main>
      <FloatingNav />
      <footer className="bg-black/50 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className='text-white'>© 2024 UnrealHeroes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}