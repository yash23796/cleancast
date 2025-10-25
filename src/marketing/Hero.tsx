import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Smart data transformation
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-brand font-semibold text-slate-900 mb-6 tracking-tight leading-tight">
            Transform Data from <span className="text-blue-600">Any Source</span>
            <br />
            to <span className="text-emerald-600">Any Format</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform spreadsheets, accounting exports, and ERP data into system-ready
            files in minutes. No manual mapping, no errors, no hassle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/app">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto">
                Try Demo Mode
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg h-auto border-2">
              <Play className="mr-2 w-5 h-5" />
              Watch 2-Min Overview
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-gray-500">
            Built for data teams at growing businesses
          </p>
        </div>

        {/* Demo Preview */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Demo Preview</span>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-center text-gray-600">
                4-Step Workflow Visualization
              </p>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {['Upload', 'Select', 'Map', 'Export'].map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-xs text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

