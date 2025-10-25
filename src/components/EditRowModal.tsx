/**
 * Modal for editing a single row of data
 * Shows only the fields that need editing with error highlighting
 */

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BankTemplate, FieldMapping } from '../App';
import { ValidationError, validateFieldFormat } from '../utils/dataValidation';

interface EditRowModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowIndex: number;
  rowData: Record<string, any>;
  fieldMapping: FieldMapping;
  template: BankTemplate;
  errors: ValidationError[];
  onSave: (rowIndex: number, updatedData: Record<string, any>) => void;
}

export function EditRowModal({
  isOpen,
  onClose,
  rowIndex,
  rowData,
  fieldMapping,
  template,
  errors,
  onSave,
}: EditRowModalProps) {
  const [editedData, setEditedData] = useState<Record<string, any>>({ ...rowData });
  const [currentErrors, setCurrentErrors] = useState<Map<string, string>>(new Map());

  // Get all fields to display
  const allFields = [...template.requiredFields, ...template.optionalFields];

  // Reset edited data and validate when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditedData({ ...rowData });
      
      // Re-validate all fields when modal opens
      const errorMap = new Map<string, string>();
      const fields = [...template.requiredFields, ...template.optionalFields];
      
      fields.forEach((targetField) => {
        const sourceField = fieldMapping[targetField];
        if (sourceField) {
          const value = rowData[sourceField];
          const isRequired = template.requiredFields.includes(targetField);
          const trimmedValue = value ? String(value).trim() : '';

          if (isRequired && trimmedValue === '') {
            errorMap.set(targetField, 'Required field is empty');
          } else if (trimmedValue !== '') {
            const formatError = validateFieldFormat(targetField, value);
            if (formatError) {
              errorMap.set(targetField, formatError);
            }
          }
        }
      });
      setCurrentErrors(errorMap);
    }
  }, [isOpen, rowIndex]); // Only depend on isOpen and rowIndex

  if (!isOpen) return null;

  const hasErrors = currentErrors.size > 0;

  const handleSave = () => {
    if (hasErrors) return; // Don't save if there are errors
    onSave(rowIndex, editedData);
    onClose();
  };

  const handleFieldChange = (targetField: string, value: string) => {
    const sourceField = fieldMapping[targetField];
    if (sourceField) {
      // Update the data
      setEditedData((prev) => ({
        ...prev,
        [sourceField]: value,
      }));

      // Validate the field in real-time
      const isRequired = template.requiredFields.includes(targetField);
      const trimmedValue = value.trim();

      setCurrentErrors((prev) => {
        const newErrors = new Map(prev);

        // Check if required field is empty
        if (isRequired && trimmedValue === '') {
          newErrors.set(targetField, 'Required field is empty');
        } else if (trimmedValue !== '') {
          // Validate format if not empty
          const formatError = validateFieldFormat(targetField, value);
          if (formatError) {
            newErrors.set(targetField, formatError);
          } else {
            // Clear error if validation passes
            newErrors.delete(targetField);
          }
        } else {
          // Clear error for optional empty fields
          newErrors.delete(targetField);
        }

        return newErrors;
      });
    }
  };

  const getFieldValue = (targetField: string): string => {
    const sourceField = fieldMapping[targetField];
    if (sourceField) {
      return editedData[sourceField] || '';
    }
    return '';
  };

  const getFieldError = (targetField: string): string | null => {
    return currentErrors.get(targetField) || null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex-1 pr-8">
            <h2 className="text-lg font-semibold text-gray-900">Edit Row {rowIndex + 1}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {hasErrors ? (
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">{currentErrors.size} {currentErrors.size === 1 ? 'error' : 'errors'} to fix</span>
                </span>
              ) : (
                'Make changes to this record'
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-sm p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {allFields.map((targetField) => {
              const sourceField = fieldMapping[targetField];
              if (!sourceField) return null;

              const hasError = currentErrors.has(targetField);
              const error = getFieldError(targetField);
              const value = getFieldValue(targetField);
              const isRequired = template.requiredFields.includes(targetField);

              return (
                <div key={targetField} className="space-y-2">
                  <Label htmlFor={targetField} className="text-sm font-medium text-gray-700">
                    {targetField}
                    {isRequired && (
                      <span className="text-red-500 text-xs ml-1">*</span>
                    )}
                  </Label>
                  
                  <Input
                    id={targetField}
                    value={value}
                    onChange={(e) => handleFieldChange(targetField, e.target.value)}
                    className={`${
                      hasError
                        ? 'border-red-300 bg-red-50/30 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder={`Enter ${targetField.toLowerCase()}`}
                  />
                  
                  {hasError && error && (
                    <p className="text-sm text-red-600 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </p>
                  )}
                  
                  {!hasError && value && (
                    <p className="text-xs text-gray-500">
                      Mapped from: {sourceField}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasErrors}
            className={`flex items-center gap-2 ${
              hasErrors
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}


