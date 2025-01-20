import React from 'react';
import { ArrowRight, Brain, Layout, Settings2, BookOpen, Building2, Upload, Sparkles} from 'lucide-react'
import { HeroScene } from './components/HeroScene.jsx'
import { Header } from './components/Header.tsx';
import { HomeFooter } from './components/HomeFooter.tsx'


export default function App() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Bloom's Taxonomy Integration",
      description: "Generate questions aligned with different cognitive levels for comprehensive assessment"
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Professional Formatting",
      description: "Automatically format question papers with your institution's branding and layout"
    },
    {
      icon: <Settings2 className="w-6 h-6" />,
      title: "Customizable Structure",
      description: "Separate Part A and Part B questions with customized difficulty levels"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Question Bank Management",
      description: "Upload and manage your question bank efficiently for future use"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <Header />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16">
          <HeroScene />
          <div className="max-w-7xl h-screen mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center absolute left-8 bottom-28 z-10 flex flex-col items-center">
              <h1 className="hidden md:block text-5xl font-bold text-gray-900 mb-6 select-none">
                Smart Question Paper Generator
              </h1>
              <p className="hidden md:block text-2xl text-gray-600 mb-8 max-w-2xl mx-auto select-none">
                Create professional question papers with automatic Bloom's Taxonomy classification and customized formatting for your educational institution.
              </p>
              <a href="/upload">
                <button 
                 className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl select-none"
                >
                 Get Started
                 <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Educators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent system helps you create balanced question papers that align with educational standards and assessment objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        </section>

        {/* How It Works Section */}
        <div id="how-it-works" className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Generate professional question papers in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Enter Institution Details</h3>
                <p className="text-gray-600">Upload your college logo and enter institution information</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Upload Question Bank</h3>
                <p className="text-gray-600">Submit your question bank in the required format</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Generate Paper</h3>
                <p className="text-gray-600">Select Bloom's levels and get your formatted question paper</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Ready to Create Your Question Paper?
          </h2>
          <a href="/upload">

          <button
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
            Start Generating
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
            </a>
        </div>

        <HomeFooter />
      </div>
    )
}