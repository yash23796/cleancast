import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-brand font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-brand font-semibold text-slate-900">
              CleanCast
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Use Cases
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              FAQ
            </a>
          </div>

          {/* CTA Button */}
          <Link to="/app">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

