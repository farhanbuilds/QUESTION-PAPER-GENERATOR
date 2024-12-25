import React from 'react';
import { FileSpreadsheet, Clock, Shield } from 'lucide-react';

export function Hero() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Generate Professional Question Papers in{' '}
            <span className="text-blue-400">Minutes</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Streamline your exam preparation process with our intelligent question paper
            generator. Create balanced, randomized question papers from your question bank
            instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="/upload"><button className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">
              Start Generating
            </button>
            </a>
            <button className="border-2 border-blue-400 text-blue-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500/10 transition-colors">
              Watch Demo
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <FileSpreadsheet className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Smart Templates</h3>
              <p className="text-gray-300">Customizable formats for all types of exams</p>
            </div>
            <div className="p-4">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Time-Saving</h3>
              <p className="text-gray-300">Generate papers in less than 5 minutes</p>
            </div>
            <div className="p-4">
              <Shield className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">Secure</h3>
              <p className="text-gray-300">Bank-grade encryption for your question bank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}