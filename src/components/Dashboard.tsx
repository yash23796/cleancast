import React from 'react';
import { Upload, FileText, ArrowRightLeft, CheckCircle, ArrowRight, Shield, Clock, FileSpreadsheet, Database, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface DashboardProps {
  onStartImport: () => void;
}

export function Dashboard({ onStartImport }: DashboardProps) {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Data',
      description: 'Import your data from CSV or Excel files',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-600',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:border-blue-300'
    },
    {
      icon: FileText,
      title: 'Select Template',
      description: 'Choose your target output format',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-600',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:border-blue-300'
    },
    {
      icon: ArrowRightLeft,
      title: 'Map Fields',
      description: 'Match your data fields to template requirements',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-600',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:border-blue-300'
    },
    {
      icon: CheckCircle,
      title: 'Validate & Export',
      description: 'Review and download your formatted file',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badgeColor: 'bg-blue-600',
      borderColor: 'border-gray-200',
      hoverColor: 'hover:border-blue-300'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5 inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Data transformation made simple
        </Badge>
        <h1 className="text-5xl md:text-6xl font-brand font-semibold text-slate-900 mb-4 tracking-tight">
          Clean<span className="text-blue-600">Cast</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform messy data into standardized, system-ready formats in minutes.
        </p>
      </div>

      {/* Process Steps with Connectors */}
      <div className="relative mb-16">
        {/* Connector Line */}
        <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-16" style={{ zIndex: 0 }}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative" style={{ zIndex: 1 }}>
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const stepNumber = index + 1;
            return (
              <Card 
                key={index} 
                className={`p-6 border ${step.borderColor} ${step.hoverColor} rounded-xl bg-white relative transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group`}
              >
                {/* Step Number Badge - Matching Top Nav Style */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className={`w-8 h-8 ${step.badgeColor} text-white rounded-full flex items-center justify-center text-sm font-medium shadow-sm group-hover:scale-105 transition-transform`}>
                    {stepNumber}
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center pt-4">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <IconComponent className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="text-base font-medium mb-2 text-slate-900">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section - Anchored Position */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-medium text-slate-900 mb-3">
              Ready to get started?
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Takes ~2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>No signup required</span>
              </div>
            </div>
          </div>
            <Button 
            onClick={onStartImport}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl shadow-sm hover:shadow-md transition-all group"
          >
            Start Transformation
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>

      {/* Feature Card - Compact with Logos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-slate-900 mb-2">Multiple File Formats</h4>
              <p className="text-sm text-gray-600 mb-3">
                Import from CSV, Excel (XLSX), and more
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">CSV</Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">Excel</Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">XLSX</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border border-blue-200 rounded-xl hover:border-blue-300 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-slate-900">Coming Soon</h4>
                <Badge className="bg-blue-600 text-white text-xs">New</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Direct integrations with business platforms
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Salesforce</Badge>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Workday</Badge>
                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">More</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}