import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Dashboard } from '../components/Dashboard';
import { UploadStep } from '../components/UploadStep';
import { TemplateStep } from '../components/TemplateStep';
import { MappingStep } from '../components/MappingStep';
import { ValidationStep } from '../components/ValidationStep';
import { EditStep } from '../components/EditStep';
import { StepNavigation } from '../components/StepNavigation';
import { UploadedFile, BankTemplate, FieldMapping } from '../App';

export function ProductApp() {
  const steps = ['Upload Data', 'Select Template', 'Map Fields', 'Validate & Export'];
  
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BankTemplate | null>(null);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | undefined>();
  const [validationErrors, setValidationErrors] = useState<any[]>([]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    // step is 1-indexed from StepNavigation, but currentStep is 0-indexed with Dashboard at 0
    // So step 1 = currentStep 1, step 2 = currentStep 2, etc.
    if (step <= currentStep && step > 0) {
      setCurrentStep(step);
    }
  };

  const handleStartEdit = (rowIndex?: number, errors?: any[]) => {
    setIsEditing(true);
    setEditingRowIndex(rowIndex);
    if (errors) {
      setValidationErrors(errors);
    }
  };

  const handleEditComplete = (updatedData: any[]) => {
    if (uploadedFile) {
      setUploadedFile({
        ...uploadedFile,
        data: updatedData
      });
    }
    setIsEditing(false);
    setEditingRowIndex(undefined);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingRowIndex(undefined);
  };

  const handleDataUpdate = (updatedData: any[]) => {
    if (uploadedFile) {
      setUploadedFile({
        ...uploadedFile,
        data: updatedData
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back to Landing Page */}
      <div className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Step Navigation */}
      {!isEditing && currentStep > 0 && (
        <StepNavigation currentStep={currentStep} steps={steps} onStepClick={handleStepClick} />
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {isEditing ? (
          <EditStep
            uploadedFile={uploadedFile}
            selectedTemplate={selectedTemplate}
            fieldMapping={fieldMapping}
            editContext={{
              isEditing: true,
              editingRow: editingRowIndex,
              originalData: uploadedFile?.data || [],
              validationErrors: validationErrors
            }}
            onSave={handleEditComplete}
            onCancel={handleEditCancel}
          />
        ) : (
          <>
            {currentStep === 0 && <Dashboard onStartImport={() => setCurrentStep(1)} />}
            {currentStep === 1 && (
              <UploadStep
                onNext={handleNext}
                onBack={() => setCurrentStep(0)}
                uploadedFile={uploadedFile}
                setUploadedFile={setUploadedFile}
              />
            )}
            {currentStep === 2 && (
              <TemplateStep
                onNext={handleNext}
                onBack={handleBack}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
              />
            )}
            {currentStep === 3 && (
              <MappingStep
                onNext={handleNext}
                onBack={handleBack}
                uploadedFile={uploadedFile}
                selectedTemplate={selectedTemplate}
                fieldMapping={fieldMapping}
                setFieldMapping={setFieldMapping}
              />
            )}
            {currentStep === 4 && (
              <ValidationStep
                onBack={handleBack}
                uploadedFile={uploadedFile}
                selectedTemplate={selectedTemplate}
                fieldMapping={fieldMapping}
                onStartEdit={handleStartEdit}
                onDataUpdate={handleDataUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

