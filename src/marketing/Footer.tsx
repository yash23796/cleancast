import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-brand font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-brand font-semibold text-white">
                CleanCast
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Transform data from any source to any format.
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Built by an independent developer. Open source and privacy-focused.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">Product</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#use-cases" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Use Cases
                </a>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Format data now
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-medium text-sm mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://github.com/yash23796/cleancast" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/yash23796/cleancast/blob/main/README.md" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/yash23796/cleancast/blob/main/SECURITY.md" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {currentYear} CleanCast. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/yash23796/cleancast/issues" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
            >
              Report Issue
            </a>
            <span className="text-gray-700">•</span>
            <a 
              href="https://github.com/yash23796/cleancast" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
            >
              View Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

