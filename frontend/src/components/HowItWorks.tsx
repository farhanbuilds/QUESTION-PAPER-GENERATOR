import React from 'react';
import { Upload, Wand2, FileDown } from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          How It Works
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Step
              icon={<Upload className="h-6 w-6" />}
              number={1}
              title="Upload Questions"
              description="Import your question bank in any format"
            />
            <Step
              icon={<Wand2 className="h-6 w-6" />}
              number={2}
              title="Configure Paper"
              description="Set patterns, marks distribution, and difficulty levels"
            />
            <Step
              icon={<FileDown className="h-6 w-6" />}
              number={3}
              title="Generate & Download"
              description="Get your question paper in preferred format"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ icon, number, title, description }: { icon: React.ReactNode; number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <span className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold mb-3">
          Step {number}
        </span>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}