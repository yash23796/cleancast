import React from 'react';
import { Upload, FileText, Wand2, CheckCircle, Clock, Shield } from 'lucide-react';
import { Card } from '../components/ui/card';

export function Features() {
  const features = [
    {
      icon: Upload,
      title: 'Universal Data Import',
      description: 'Upload from Excel, CSV, QuickBooks, NetSuite, SAP, or any accounting system. We handle the complexity.',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: FileText,
      title: 'Template Library',
      description: 'Pre-built templates for major banks and payment processors. Or create custom templates for your workflow.',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Wand2,
      title: 'Smart Auto-Mapping',
      description: 'Smart field suggestions automatically detect and map your columns. Drag, drop, and done.',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'Real-Time Validation',
      description: 'Catch errors before export. Inline validation, progress tracking, and bulk editing built-in.',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      icon: Clock,
      title: 'Audit Trail',
      description: 'Full history of imports, mappings, and exports. Know who did what, when, and why.',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your data never leaves your browser. Zero retention policy. Enterprise-ready compliance.',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-brand font-semibold text-slate-900 mb-4">
            Everything You Need to Transform Data Faster
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for data teams who are tired of manual data entry and formatting headaches
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                  <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

