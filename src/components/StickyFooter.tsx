import React from 'react';
import { Button } from './ui/button';

interface StickyFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
  children?: React.ReactNode;
}

export function StickyFooter({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  nextDisabled = false,
  hideBack = false,
  hideNext = false,
  children
}: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="bg-gradient-to-t from-white via-white/95 to-transparent pt-6 pb-6">
        <div className="max-w-4xl mx-auto px-6 pointer-events-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4">
            {children || (
              <div className="flex justify-between items-center">
                {!hideBack && onBack && (
                  <Button variant="outline" onClick={onBack} className="min-w-[100px]">
                    {backLabel}
                  </Button>
                )}
                {hideBack && <div />}
                {!hideNext && onNext && (
                  <Button
                    onClick={onNext}
                    disabled={nextDisabled}
                    className={`min-w-[100px] ${
                      !nextDisabled
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {nextLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

