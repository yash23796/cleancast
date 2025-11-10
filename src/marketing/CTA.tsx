import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-12 md:p-14 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-brand font-medium text-white mb-5">
            Ready to Stop Manually Formatting Data?
          </h2>
          
          <p className="text-base text-blue-50 mb-8 max-w-2xl mx-auto">
            Transform your data files in minutes. No credit card required. No installation needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link to="/app">
              <Button className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-2.5 text-sm font-medium shadow-sm">
                Format data now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-blue-100">
            Join teams saving 10+ hours per week on data formatting
          </p>
        </div>
      </div>
    </section>
  );
}

