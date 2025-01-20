import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react'

export function HomeFooter() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-indigo-600">QuestionGen</h3>
            <p className="mt-4 text-gray-500">
              Revolutionizing question paper generation with AI and Bloom's Taxonomy
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h4>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#features" className="text-base text-gray-500 hover:text-gray-900">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                  How it Works
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/" className="text-base text-gray-500 hover:text-gray-900">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/" className="text-base text-gray-500 hover:text-gray-900">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Connect</h4>
            <div className="mt-4 flex space-x-6">
              <a href="/" className="text-gray-400 hover:text-gray-500">
                <Github className="h-6 w-6" />
              </a>
              <a href="/" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="/" className="text-gray-400 hover:text-gray-500">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} QuestionGen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}