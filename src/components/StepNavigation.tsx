import { Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  steps: string[];
  onStepClick: (stepIndex: number) => void;
}

export function StepNavigation({ currentStep, steps, onStepClick }: StepNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;
              
              return (
                <div
                  key={step}
                  className="flex items-center cursor-pointer group"
                  onClick={() => onStepClick(stepNumber)}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{stepNumber}</span>
                    )}
                  </div>
                  <span
                    className={`ml-3 transition-colors ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-emerald-600'
                        : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-gray-300 ml-8" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}