import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-brand font-semibold text-white mb-6">
            Ready to Stop Manually Formatting Data?
          </h2>
          
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Try our demo with sample data or start your free account. No credit card required. No installation needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link to="/app">
              <Button className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 text-lg h-auto font-semibold">
                Try Demo Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg h-auto">
              Start Free Account
            </Button>
          </div>

          <p className="text-sm text-blue-100">
            Join teams saving 10+ hours per week on data formatting
          </p>
        </div>
      </div>
    </section>
  );
}

