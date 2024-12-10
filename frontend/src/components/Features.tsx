import React from 'react';
import { Shuffle, Settings, BarChart3, Lock } from 'lucide-react';

export function Features() {
  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Powerful Features for Educators
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Shuffle className="h-6 w-6" />}
            title="Random Generation"
            description="Automatically shuffle questions and generate unique papers every time"
          />
          <FeatureCard
            icon={<Settings className="h-6 w-6" />}
            title="Custom Templates"
            description="Create and save templates for different exam patterns"
          />
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Difficulty Balance"
            description="Ensure balanced distribution of easy, medium, and hard questions"
          />
          <FeatureCard
            icon={<Lock className="h-6 w-6" />}
            title="Secure Storage"
            description="Encrypted storage for your valuable question bank"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-gray-900/50 hover:bg-gray-700 transition-colors group border border-gray-700">
      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}