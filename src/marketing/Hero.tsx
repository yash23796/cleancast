import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Sparkles, ArrowRight, Upload, FileText, GitBranch, Download, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    id: 1,
    label: 'Upload',
    icon: Upload,
    gradient: 'from-blue-500 to-blue-600',
    iconColor: 'text-blue-600',
    description: 'Import your CSV or Excel files',
    title: 'Upload Your Data Files',
    content: {
      intro: 'Start by uploading your source data files. CleanCast supports multiple formats and automatically detects file structure.',
      features: [
        'CSV and Excel file support',
        'Automatic column detection',
        'Real-time file validation',
        'Preview before processing'
      ],
    }
  },
  {
    id: 2,
    label: 'Select',
    icon: FileText,
    gradient: 'from-indigo-500 to-indigo-600',
    iconColor: 'text-indigo-600',
    description: 'Choose from pre-built templates',
    title: 'Select Your Template',
    content: {
      intro: 'Choose from our library of pre-built templates for banking, HR, logistics, and e-commerce. Each template is optimized for specific systems.',
      features: [
        'Banking: ACH, Wire, SWIFT formats',
        'HR: Payroll, employee data, attendance',
        'Logistics: Shipments, inventory, POs',
        'E-commerce: Orders, products, customers'
      ],
    }
  },
  {
    id: 3,
    label: 'Map',
    icon: GitBranch,
    gradient: 'from-purple-500 to-purple-600',
    iconColor: 'text-purple-600',
    description: 'Intelligent field mapping',
    title: 'Map Fields Automatically',
    content: {
      intro: 'Our AI-powered mapping suggests matches between your source columns and template fields. Review and adjust as needed.',
      features: [
        'Smart field detection',
        'Drag-and-drop mapping',
        'Data type validation',
        'Preview mapped results'
      ],
    }
  },
  {
    id: 4,
    label: 'Export',
    icon: Download,
    gradient: 'from-emerald-500 to-emerald-600',
    iconColor: 'text-emerald-600',
    description: 'Download formatted files',
    title: 'Export & Download',
    content: {
      intro: 'Review validation results, fix any errors, and export your perfectly formatted files ready for your target system.',
      features: [
        'Real-time validation',
        'Error highlighting',
        'Bulk edit capabilities',
        'Multiple export formats'
      ],
    }
  },
];

export function Hero() {
  const [activeStep, setActiveStep] = useState(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const displayStep = hoveredStep || activeStep;
  const shouldReduceMotion = useReducedMotion();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveStep((prev) => Math.min(prev + 1, steps.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveStep((prev) => Math.max(prev - 1, 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
    setHoveredStep(null);
  };

  const currentStep = steps.find(s => s.id === displayStep) || steps[0];

  const motionConfig = {
    duration: shouldReduceMotion ? 0 : 0.4,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Subtle Background Treatment */}
      <div className="absolute inset-0 -z-10">
        {/* Soft Radial/Mesh Gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.04) 0%, transparent 70%)
            `,
          }}
        />
        
        {/* Faint Grid/Trace */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgb(0, 0, 0) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(0, 0, 0) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Top Section - Headline, CTA */}
        <div className="text-center mb-16 lg:mb-20">
          {/* Badge */}
          <Badge className="mb-6 bg-blue-50/80 text-blue-700 border-blue-200/50 px-3 py-1 inline-flex items-center gap-1.5 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            Smart data transformation
          </Badge>

          {/* Main Heading - Mono-color */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-brand font-medium text-slate-950 mb-6 tracking-tight leading-[1.05]">
            Transform Data from Any Source
            <br />
            to Any Format
          </h1>

          {/* Subheading - Mono-color */}
          <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform spreadsheets, accounting exports, and ERP data into system-ready
            files in minutes. No manual mapping, no errors, no hassle.
          </p>

          {/* CTA Button */}
          <div className="mb-6">
            <Link to="/app">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all">
                Format data now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-xs text-slate-500 font-medium">
            Built for data teams at growing businesses
          </p>
        </div>

        {/* Bottom Section - Step Rail + Preview */}
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-12 items-start">
          {/* Left Column - Step Rail */}
          <div className="lg:block">
            {/* Desktop: Vertical Rail */}
            <div className="hidden lg:block space-y-2">
              {/* Progress Indicator Bar */}
              <div className="relative h-0.5 bg-gray-200/50 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((displayStep - 1) / (steps.length - 1)) * 100}%` 
                  }}
                  transition={motionConfig}
                />
              </div>

              {/* Steps */}
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = displayStep === step.id;
                
                return (
                  <motion.div
                    key={step.id}
                    className="relative"
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                  >
                    <motion.button
                      onClick={() => handleStepClick(step.id)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-left transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2"
                      whileHover={shouldReduceMotion ? {} : { x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      initial={false}
                    >
                      {/* Step Number & Icon */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                            isActive
                              ? 'bg-white border-gray-200 shadow-sm'
                              : 'bg-white border-gray-200 group-hover:border-gray-300'
                          }`}
                          animate={{
                            scale: isActive ? 1 : 0.95,
                          }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? step.iconColor : 'text-gray-600'}`} />
                        </motion.div>
                        {isActive && (
                          <motion.div
                            className={`absolute -inset-1 rounded-lg blur-sm -z-10 ${
                              step.id === 1 ? 'bg-blue-600/10' :
                              step.id === 2 ? 'bg-indigo-600/10' :
                              step.id === 3 ? 'bg-purple-600/10' :
                              'bg-emerald-600/10'
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </div>

                      {/* Step Label */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-gray-400">
                            {String(step.id).padStart(2, '0')}
                          </span>
                          <motion.span
                            className={`text-sm font-medium transition-colors ${
                              isActive ? 'text-slate-900' : 'text-gray-600 group-hover:text-slate-900'
                            }`}
                            animate={{
                              fontWeight: isActive ? 600 : 500,
                            }}
                          >
                            {step.label}
                          </motion.span>
                        </div>
                        <motion.p
                          className="text-xs text-gray-500 overflow-hidden"
                          initial={false}
                          animate={{
                            opacity: isActive ? 1 : 0,
                            height: isActive ? 'auto' : 0,
                          }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        >
                          {step.description}
                        </motion.p>
                      </div>

                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <motion.div
                          className="absolute left-5 bottom-0 w-px h-5 bg-gray-200"
                          animate={{
                            opacity: isActive ? 0.5 : 0.3,
                          }}
                        />
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: Horizontal Scroll-Snap Rail */}
            <div className="lg:hidden">
              <div className="relative h-0.5 bg-gray-200/50 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((displayStep - 1) / (steps.length - 1)) * 100}%` 
                  }}
                  transition={motionConfig}
                />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scroll-snap-x-mandatory scrollbar-hide">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = displayStep === step.id;
                  
                  return (
                    <motion.button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 bg-white min-w-[120px] scroll-snap-align-start focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                        isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-mono text-gray-400 mb-0.5">
                          {String(step.id).padStart(2, '0')}
                        </div>
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-slate-900' : 'text-gray-600'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Context Panel (Fixed Size) */}
          <div className="relative lg:sticky lg:top-32">
            <motion.div
              key={displayStep}
              className="relative rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-lg overflow-hidden"
              style={{ 
                height: '420px',
                minHeight: '420px',
                maxHeight: '420px'
              }}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionConfig}
            >
              <div className="h-full flex flex-col p-6 overflow-y-auto">
                {/* Header - Fixed */}
                <motion.div
                  className="flex items-center gap-4 mb-5 flex-shrink-0"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                    initial={{ scale: shouldReduceMotion ? 1 : 0.8, rotate: shouldReduceMotion ? 0 : -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <currentStep.icon className={`w-6 h-6 ${currentStep.iconColor}`} />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-xl font-semibold text-slate-900 mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.15, duration: shouldReduceMotion ? 0 : 0.3 }}
                    >
                      {currentStep.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
                    >
                      Step {currentStep.id} of {steps.length}
                    </motion.p>
                  </div>
                </motion.div>

                {/* Content - Scrollable */}
                <div className="flex-1 space-y-5 overflow-y-auto">
                  {/* Short Description */}
                  <motion.p
                    className="text-base text-slate-700 leading-relaxed"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.25, duration: shouldReduceMotion ? 0 : 0.3 }}
                  >
                    {currentStep.content.intro}
                  </motion.p>

                  {/* Bullet Points */}
                  <div className="space-y-2.5">
                    {currentStep.content.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-3"
                        initial={{ opacity: shouldReduceMotion ? 1 : 0, x: shouldReduceMotion ? 0 : -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: shouldReduceMotion ? 0 : 0.3 + idx * 0.08, 
                          duration: shouldReduceMotion ? 0 : 0.4,
                          type: 'spring',
                          stiffness: 100
                        }}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${currentStep.iconColor} mt-0.5 flex-shrink-0`} />
                        <span className="text-sm text-slate-700 leading-relaxed">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
