import { useState, useEffect } from 'react';
import { Download, CheckCircle, AlertTriangle, Edit, RefreshCw, Copy, FileText, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { UploadedFile, BankTemplate, FieldMapping } from '../App';
import { toast } from 'sonner';
import { StickyFooter } from './StickyFooter';
import { validateData, ValidationResult as ValidationResultType } from '../utils/dataValidation';
import { transformData, generateCSV } from '../utils/dataTransformation';
import { EditRowModal } from './EditRowModal';
import { ConfirmDialog } from './ConfirmDialog';

interface ValidationStepProps {
  onBack: () => void;
  uploadedFile: UploadedFile | null;
  selectedTemplate: BankTemplate | null;
  fieldMapping: FieldMapping;
  onStartEdit: (rowIndex?: number, validationErrors?: any[]) => void;
  onDataUpdate: (updatedData: any[]) => void;
}

export function ValidationStep({ 
  onBack: _onBack, 
  uploadedFile, 
  selectedTemplate, 
  fieldMapping,
  onStartEdit,
  onDataUpdate 
}: ValidationStepProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResultType | null>(null);
  const [transformedData, setTransformedData] = useState<Record<string, any>[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [showStartNewConfirm, setShowStartNewConfirm] = useState(false);

  // Automatically validate when component mounts or data changes
  useEffect(() => {
    if (uploadedFile && selectedTemplate && Object.keys(fieldMapping).length > 0) {
      performValidation();
    }
  }, [uploadedFile, selectedTemplate, fieldMapping]);

  const performValidation = async () => {
    if (!uploadedFile || !selectedTemplate) return;

    setIsValidating(true);

    try {
      // Perform real validation
      const result = validateData(uploadedFile.data, fieldMapping, selectedTemplate);
      setValidationResult(result);

      // Transform data for export
      const transformed = transformData(uploadedFile.data, fieldMapping, selectedTemplate);
      setTransformedData(transformed.data);

      toast.success(`Validation complete: ${result.valid} of ${result.total} rows valid`);
    } catch (error) {
      toast.error('Validation failed. Please check your data.');
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidate = async () => {
    await performValidation();
  };

  const generateCSVContent = () => {
    if (!selectedTemplate || transformedData.length === 0) return '';
    
    // Get all fields from template
    const fields = [...selectedTemplate.requiredFields, ...selectedTemplate.optionalFields];
    
    // Generate CSV using transformed data
    return generateCSV(transformedData, fields);
  };

  const handleCopyToClipboard = async () => {
    const csvContent = generateCSVContent();
    
    try {
      await navigator.clipboard.writeText(csvContent);
      setCopied(true);
      toast.success('Data copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleExport = async () => {
    if (!selectedTemplate || transformedData.length === 0) {
      toast.error('No data to export');
      return;
    }

    setIsExporting(true);

    try {
      // Generate CSV content from transformed data
      const csvContent = generateCSVContent();
      
      // Create downloadable file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${selectedTemplate.name.replace(/\s+/g, '_')}_${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast.success(`File exported successfully: ${filename}`);
    } catch (error) {
      toast.error('Failed to export file');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle opening edit modal for single row
  const handleEditRow = (rowIndex: number) => {
    setEditingRowIndex(rowIndex);
    setEditModalOpen(true);
  };

  // Handle saving edits from modal
  const handleSaveRow = (rowIndex: number, updatedRow: Record<string, any>) => {
    if (!uploadedFile) return;

    const newData = [...uploadedFile.data];
    newData[rowIndex] = updatedRow;
    
    // Update the uploaded file data
    onDataUpdate(newData);
    
    // Re-validate
    performValidation();
    
    toast.success('Row updated successfully');
    setEditModalOpen(false);
  };

  // Calculate validation percentage
  const validPercentage = validationResult 
    ? (validationResult.valid / validationResult.total) * 100 
    : 0;

  if (!uploadedFile || !selectedTemplate) {
    return <div>Missing data...</div>;
  }

  // Show loading state while validating
  if (!validationResult && isValidating) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Validating your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Validate & Export</h1>
        <p className="text-gray-600 text-sm">
          Review validation results and download your formatted file.
        </p>
      </div>

      {/* Sticky Validation Summary Banner */}
      {validationResult && !isValidating && (
        <div className="sticky top-0 z-10 mb-6">
          <div className={`px-6 py-4 rounded-xl border-2 shadow-sm ${
            validationResult.errors > 0 
              ? 'bg-red-50/95 border-red-200 backdrop-blur-sm' 
              : 'bg-green-50/95 border-green-200 backdrop-blur-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {validationResult.errors > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${
                      validationResult.errors > 0 ? 'text-red-900' : 'text-green-900'
                    }`}>
                      {validationResult.valid} of {validationResult.total} rows valid
                    </span>
                    <span className="text-sm text-gray-600">
                      ({validPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  {validationResult.errors > 0 && (
                    <p className="text-sm text-red-700 mt-0.5">
                      {validationResult.errors} errors must be fixed before export
                    </p>
                  )}
                </div>
              </div>
              <Button 
                onClick={handleValidate}
                disabled={isValidating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
                Re-validate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isValidating && !validationResult && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Validating your data...</p>
        </div>
      )}

      {/* Error Details */}
      {validationResult && validationResult.errors > 0 && !isValidating && (
        <Card className="p-6 rounded-2xl bg-white border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-gray-900 font-semibold">Error Details</h3>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {validationResult.errors} errors found
              </Badge>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onStartEdit(undefined, validationResult?.errorDetails || [])}
              className="text-blue-700 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit All Data
            </Button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {validationResult.errorDetails.slice(0, 20).map((error, index) => (
              <div key={index} className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg border border-red-200 bg-red-50/50">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900 leading-snug">
                    <span className="font-semibold">Row {error.row}:</span> {error.error}
                    {error.value !== undefined && error.value !== null && (
                      <span className="text-red-800"> | Value: <span className="font-mono">"{String(error.value)}"</span></span>
                    )}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-shrink-0 text-red-700 border-red-300 hover:bg-red-50"
                  onClick={() => handleEditRow(error.row - 1)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Fix
                </Button>
              </div>
            ))}
            {validationResult.errorDetails.length > 20 && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700">
                  Showing first 20 of {validationResult.errorDetails.length} total errors.
                  <Button 
                    size="sm" 
                    variant="link" 
                    onClick={() => onStartEdit(undefined, validationResult?.errorDetails || [])}
                    className="ml-2 text-blue-600 h-auto p-0"
                  >
                    View all in editor
                  </Button>
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Dashboard Cards */}
      {validationResult && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <h3 className="text-sm font-medium text-emerald-900">Valid Rows</h3>
            </div>
            <div className="text-3xl font-bold text-emerald-700">{validationResult.valid}</div>
            <p className="text-xs text-emerald-600 mt-1">Ready for export</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-sm font-medium text-red-900">Errors</h3>
            </div>
            <div className="text-3xl font-bold text-red-700">{validationResult.errors}</div>
            <p className="text-xs text-red-600 mt-1">Need correction</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-900">Total Records</h3>
            </div>
            <div className="text-3xl font-bold text-blue-700">{validationResult.total}</div>
            <p className="text-xs text-blue-600 mt-1">{selectedTemplate?.name}</p>
          </Card>
        </div>
      )}

      {/* Sticky Footer with CTAs - Always Visible */}
      <StickyFooter hideBack hideNext>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowStartNewConfirm(true)}
              variant="outline"
            >
              Start New
            </Button>
            {validationResult && validationResult.errors > 0 && (
              <Button 
                variant="outline" 
                onClick={() => onStartEdit(undefined, validationResult?.errorDetails || [])}
                className="text-blue-700 border-blue-300 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {validationResult && validationResult.valid > 0 && (
              <>
                <Button 
                  onClick={handleCopyToClipboard}
                  disabled={copied}
                  variant="outline"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy CSV
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting || !validationResult}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-gray-400"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              </>
            )}
            {(!validationResult || validationResult.valid === 0) && (
              <Button 
                disabled
                className="bg-gray-400 text-white cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            )}
          </div>
        </div>
      </StickyFooter>

      {/* Edit Row Modal */}
      {editModalOpen && editingRowIndex !== null && uploadedFile && (
        <EditRowModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          rowIndex={editingRowIndex}
          rowData={uploadedFile.data[editingRowIndex]}
          fieldMapping={fieldMapping}
          template={selectedTemplate}
          errors={validationResult?.errorDetails || []}
          onSave={handleSaveRow}
        />
      )}

      {/* Start New Confirmation Dialog */}
      <ConfirmDialog
        open={showStartNewConfirm}
        onOpenChange={setShowStartNewConfirm}
        onConfirm={() => window.location.reload()}
        title="Start a new import?"
        description="This will clear all your current data and start over. This action cannot be undone."
        confirmText="Start New"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}