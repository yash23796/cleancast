import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UploadStep } from './components/UploadStep';
import { TemplateStep } from './components/TemplateStep';
import { MappingStep } from './components/MappingStep';
import { ValidationStep } from './components/ValidationStep';
import { EditStep } from './components/EditStep';
import { StepNavigation } from './components/StepNavigation';
import { Toaster } from './components/ui/sonner';

export interface UploadedFile {
  name: string;
  headers: string[];
  data: any[];
}

export interface BankTemplate {
  name: string;
  requiredFields: string[];
  optionalFields: string[];
}

export interface FieldMapping {
  [key: string]: string;
}

export interface ValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface EditContext {
  isEditing: boolean;
  editingRow?: number;
  originalData: any[];
  validationErrors?: ValidationError[];
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BankTemplate | null>(null);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [editContext, setEditContext] = useState<EditContext>({
    isEditing: false,
    originalData: []
  });

  const steps = [
    'Dashboard',
    'Upload Data',
    'Select Template', 
    'Map Fields',
    'Validate & Export'
  ];

  const handleStartEdit = (rowIndex?: number, validationErrors?: ValidationError[]) => {
    if (uploadedFile) {
      setEditContext({
        isEditing: true,
        editingRow: rowIndex,
        originalData: [...uploadedFile.data],
        validationErrors: validationErrors || []
      });
    }
  };

  const handleFinishEdit = (updatedData: any[]) => {
    if (uploadedFile) {
      setUploadedFile({
        ...uploadedFile,
        data: updatedData
      });
    }
    setEditContext({
      isEditing: false,
      originalData: []
    });
  };

  const handleCancelEdit = () => {
    setEditContext({
      isEditing: false,
      originalData: []
    });
  };

  const handleDataUpdate = (updatedData: any[]) => {
    if (uploadedFile) {
      setUploadedFile({
        ...uploadedFile,
        data: updatedData
      });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const renderCurrentStep = () => {
    // Show edit mode if editing
    if (editContext.isEditing) {
      return (
        <EditStep
          uploadedFile={uploadedFile}
          selectedTemplate={selectedTemplate}
          fieldMapping={fieldMapping}
          editContext={editContext}
          onSave={handleFinishEdit}
          onCancel={handleCancelEdit}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return <Dashboard onStartImport={() => handleNext()} />;
      case 1:
        return (
          <UploadStep
            onNext={handleNext}
            onBack={handleBack}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
          />
        );
      case 2:
        return (
          <TemplateStep
            onNext={handleNext}
            onBack={handleBack}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        );
      case 3:
        return (
          <MappingStep
            onNext={handleNext}
            onBack={handleBack}
            uploadedFile={uploadedFile}
            selectedTemplate={selectedTemplate}
            fieldMapping={fieldMapping}
            setFieldMapping={setFieldMapping}
          />
        );
      case 4:
        return (
          <ValidationStep
            onBack={handleBack}
            uploadedFile={uploadedFile}
            selectedTemplate={selectedTemplate}
            fieldMapping={fieldMapping}
            onStartEdit={handleStartEdit}
            onDataUpdate={handleDataUpdate}
          />
        );
      default:
        return <Dashboard onStartImport={() => handleNext()} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep > 0 && (
        <StepNavigation
          currentStep={currentStep}
          steps={steps.slice(1)} // Remove dashboard from navigation
          onStepClick={handleStepClick}
        />
      )}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {renderCurrentStep()}
      </div>
      <Toaster />
    </div>
  );
}