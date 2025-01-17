import React from "react";
import {  Sparkles, GraduationCap, Target } from 'lucide-react';


export function WhyChooseUs() {
  const benefits = [
    {
      icon: <Target className="w-8 h-8 text-indigo-600" />,
      title: "Targeted Learning Outcomes",
      description:
        "Ensure your assessments align perfectly with educational objectives using Bloom's Taxonomy",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
      title: "Educational Excellence",
      description:
        "Create balanced question papers that effectively evaluate student understanding",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
      title: "AI-Powered Intelligence",
      description:
        "Leverage advanced algorithms to generate optimal question combinations",
    },
  ];

  return (
    <>
        <div className="bg-gray-800  text-white  shadow-xl py-32 px-28">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
    </>
  );
}
