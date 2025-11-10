import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Save, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { UploadedFile, BankTemplate, FieldMapping, EditContext } from '../App';
import { StickyFooter } from './StickyFooter';
import { ConfirmDialog } from './ConfirmDialog';

interface EditStepProps {
  uploadedFile: UploadedFile | null;
  selectedTemplate: BankTemplate | null;
  fieldMapping: FieldMapping;
  editContext: EditContext;
  onSave: (updatedData: any[]) => void;
  onCancel: () => void;
}

interface CellEdit {
  rowIndex: number;
  field: string;
  originalValue: string;
  newValue: string;
}

interface EditTableRowProps {
  row: any;
  rowIndex: number;
  mappedFields: string[];
  validationErrors: {[key: string]: string};
  getCellEdit: (rowIndex: number, field: string) => CellEdit | undefined;
  handleCellEdit: (rowIndex: number, field: string, newValue: string) => void;
}

const EditTableRow = memo(({ 
  row, 
  rowIndex, 
  mappedFields, 
  validationErrors, 
  getCellEdit, 
  handleCellEdit 
}: EditTableRowProps) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-500 align-top">
        {rowIndex + 1}
      </td>
      {mappedFields.map((field) => {
        const cellEdit = getCellEdit(rowIndex, field);
        const cellKey = `${rowIndex}-${field}`;
        const hasError = validationErrors[cellKey];
        const isChanged = !!cellEdit;
        
        return (
          <td key={field} className="px-4 py-3 align-top">
            <div className="relative">
              <Input
                value={row[field] || ''}
                onChange={(e) => handleCellEdit(rowIndex, field, e.target.value)}
                className={`text-sm ${
                  hasError
                    ? 'border-red-300 bg-red-50 focus:border-red-400'
                    : isChanged
                    ? 'border-blue-300 bg-blue-50 focus:border-blue-400'
                    : 'border-gray-200'
                }`}
              />
              {isChanged && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
              {hasError && (
                <div className="mt-1 flex items-start gap-1 p-2 bg-red-50 rounded border border-red-200">
                  <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-red-700 font-medium">Error:</div>
                    <div className="text-xs text-red-600">{hasError}</div>
                  </div>
                </div>
              )}
              {isChanged && !hasError && (
                <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs text-blue-700">
                    <span className="font-medium">Changed from:</span>
                    <div className="text-blue-600 font-mono mt-0.5">"{cellEdit?.originalValue}"</div>
                  </div>
                </div>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
});

export function EditStep({ 
  uploadedFile, 
  selectedTemplate, 
  fieldMapping, 
  editContext,
  onSave, 
  onCancel 
}: EditStepProps) {
  const [editedData, setEditedData] = useState<any[]>([]);
  const [cellEdits, setCellEdits] = useState<CellEdit[]>([]);
  const [showChangesOnly, setShowChangesOnly] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (uploadedFile?.data) {
      setEditedData([...uploadedFile.data]);
    }
  }, [uploadedFile?.data]);

  // Pre-populate validation errors from editContext on mount
  useEffect(() => {
    if (editContext.validationErrors && editContext.validationErrors.length > 0) {
      const initialErrors: {[key: string]: string} = {};
      
      // Convert validation errors to cell-level errors
      editContext.validationErrors.forEach((error) => {
        // Find the source field name from the field mapping
        const sourceField = fieldMapping[error.field];
        if (sourceField) {
          const cellKey = `${error.row - 1}-${sourceField}`;
          initialErrors[cellKey] = error.error;
        }
      });
      
      setValidationErrors(initialErrors);
    }
  }, [editContext.validationErrors, fieldMapping]);

  // Get mapped fields for display - memoized to prevent recalculation
  const mappedFields = useMemo(() => {
    const mapped: string[] = [];
    if (fieldMapping) {
      Object.entries(fieldMapping).forEach(([_, fileHeader]) => {
        if (fileHeader) {
          mapped.push(fileHeader);
        }
      });
    }
    return mapped;
  }, [fieldMapping]);

  // Validate a cell value - memoized to prevent recalculation
  const validateCell = useCallback((field: string, value: string) => {
    if (!value && selectedTemplate?.requiredFields.some(req => fieldMapping[req] === field)) {
      return 'Required field cannot be empty';
    }
    
    if (field.toLowerCase().includes('email') && value && !value.includes('@')) {
      return 'Invalid email format';
    }
    
    if (field.toLowerCase().includes('amount') && value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return 'Amount must be numeric';
      }
      if (num < 0) {
        return 'Amount cannot be negative';
      }
    }
    
    if (field.toLowerCase().includes('routing') && value) {
      if (value.length < 9) {
        return 'Routing number too short';
      }
      if (!/^\d+$/.test(value)) {
        return 'Routing number must contain only digits';
      }
    }
    
    return null;
  }, [selectedTemplate, fieldMapping]);

  const handleCellEdit = useCallback((rowIndex: number, field: string, newValue: string) => {
    // Update the data
    setEditedData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [field]: newValue };
      return newData;
    });

    // Track the edit
    const editKey = `${rowIndex}-${field}`;
    setCellEdits(prevEdits => {
      const existingEditIndex = prevEdits.findIndex(edit => 
        edit.rowIndex === rowIndex && edit.field === field
      );

      if (existingEditIndex >= 0) {
        const newEdits = [...prevEdits];
        if (newValue === editContext.originalData[rowIndex]?.[field]) {
          // Value reverted to original, remove edit
          newEdits.splice(existingEditIndex, 1);
        } else {
          // Update existing edit
          newEdits[existingEditIndex] = { ...newEdits[existingEditIndex], newValue };
        }
        return newEdits;
      } else if (newValue !== editContext.originalData[rowIndex]?.[field]) {
        // New edit
        return [...prevEdits, {
          rowIndex,
          field,
          originalValue: editContext.originalData[rowIndex]?.[field] || '',
          newValue
        }];
      }
      return prevEdits;
    });

    // Validate the cell
    setValidationErrors(prevErrors => {
      const error = validateCell(field, newValue);
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[editKey] = error;
      } else {
        delete newErrors[editKey];
      }
      return newErrors;
    });
  }, [editContext.originalData, validateCell]);

  const getCellEdit = useCallback((rowIndex: number, field: string) => {
    return cellEdits.find(edit => edit.rowIndex === rowIndex && edit.field === field);
  }, [cellEdits]);

  const hasErrors = Object.keys(validationErrors).length > 0;
  const hasChanges = cellEdits.length > 0;

  // Memoize filtered data to prevent recalculation
  const filteredData = useMemo(() => {
    let data = editedData;
    
    if (showErrorsOnly) {
      // Get unique row indices that have errors
      const errorRowIndices = new Set(
        Object.keys(validationErrors).map(cellKey => {
          const [rowIndex] = cellKey.split('-');
          return parseInt(rowIndex, 10);
        })
      );
      data = editedData.filter((_, index) => errorRowIndices.has(index));
    } else if (showChangesOnly) {
      const changedRowIndices = new Set(cellEdits.map(edit => edit.rowIndex));
      data = editedData.filter((_, index) => changedRowIndices.has(index));
    }
    
    // Limit to 100 rows for performance
    return data.slice(0, 100);
  }, [showErrorsOnly, showChangesOnly, editedData, cellEdits, validationErrors]);

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onCancel();
  };

  // Early return if required data is missing
  if (!uploadedFile || !selectedTemplate || !uploadedFile.data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading edit interface...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering if data is empty
  if (editedData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">No data to edit</p>
          <Button variant="outline" onClick={onCancel} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Validation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-32">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={handleCancelClick} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Validation
          </Button>
        </div>
        
        <div>
          <h1 className="text-slate-900 text-3xl font-semibold mb-2">Edit Data</h1>
          <p className="text-gray-600 text-sm">
            Make corrections to your data. Changes are highlighted and validated in real-time.
          </p>
        </div>
      </div>

      {/* Sticky Status Banner */}
      {(hasErrors || (editContext.validationErrors && editContext.validationErrors.length > 0) || hasChanges) && (
        <div className="sticky top-0 z-10 mb-6">
          <div className={`px-6 py-4 rounded-xl border-2 shadow-sm ${
            hasErrors 
              ? 'bg-red-50/95 border-red-200 backdrop-blur-sm' 
              : hasChanges
                ? 'bg-blue-50/95 border-blue-200 backdrop-blur-sm'
                : 'bg-amber-50/95 border-amber-200 backdrop-blur-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {hasErrors ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                ) : hasChanges ? (
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-semibold ${
                      hasErrors ? 'text-red-900' : hasChanges ? 'text-blue-900' : 'text-amber-900'
                    }`}>
                      {hasErrors 
                        ? `${Object.keys(validationErrors).length} errors to fix` 
                        : hasChanges
                          ? `${cellEdits.length} changes made`
                          : 'Error cells highlighted below'}
                    </span>
                  </div>
                  <p className={`text-sm mt-0.5 ${
                    hasErrors ? 'text-red-700' : hasChanges ? 'text-blue-700' : 'text-amber-700'
                  }`}>
                    {hasErrors 
                      ? 'Please correct all errors before saving' 
                      : hasChanges
                        ? 'Save your changes or cancel to revert'
                        : 'Fix highlighted fields before saving'}
                  </p>
                </div>
              </div>
              {editedData.length > 100 && (
                <Badge variant="outline" className="text-xs">
                  Showing 100 of {editedData.length} rows
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filters:</span>
          <div className="flex items-center gap-2">
            {/* Show Errors Filter Pill */}
            <button
              onClick={() => {
                setShowErrorsOnly(!showErrorsOnly);
                if (!showErrorsOnly) setShowChangesOnly(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showErrorsOnly
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showErrorsOnly && <Check className="w-4 h-4 inline mr-1.5" />}
              Rows with Errors
              {Object.keys(validationErrors).length > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  showErrorsOnly ? 'bg-red-500' : 'bg-red-100 text-red-800'
                }`}>
                  {Object.keys(validationErrors).length}
                </span>
              )}
            </button>
            
            {/* Show Changes Filter Pill */}
            <button
              onClick={() => {
                setShowChangesOnly(!showChangesOnly);
                if (!showChangesOnly) setShowErrorsOnly(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showChangesOnly
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showChangesOnly && <Check className="w-4 h-4 inline mr-1.5" />}
              Rows with Changes
              {hasChanges && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  showChangesOnly ? 'bg-blue-500' : 'bg-blue-100 text-blue-800'
                }`}>
                  {cellEdits.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="rounded-2xl bg-white border border-gray-200 overflow-hidden mb-32">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-600 w-16 align-top">Row</th>
                {mappedFields.map((field) => (
                  <th key={field} className="px-4 py-3 text-left text-sm text-gray-600 min-w-40 align-top">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold">{field}</span>
                      {selectedTemplate.requiredFields.some(req => fieldMapping[req] === field) && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 text-xs whitespace-nowrap">
                          Required
                        </Badge>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, rowIndex) => {
                const actualRowIndex = (showChangesOnly || showErrorsOnly)
                  ? editedData.indexOf(row)
                  : rowIndex;
                
                return (
                  <EditTableRow
                    key={actualRowIndex}
                    row={row}
                    rowIndex={actualRowIndex}
                    mappedFields={mappedFields}
                    validationErrors={validationErrors}
                    getCellEdit={getCellEdit}
                    handleCellEdit={handleCellEdit}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Changes Summary */}
      {hasChanges && (
        <Card className="mt-6 p-6 rounded-2xl bg-blue-50 border border-blue-200">
          <h3 className="text-blue-900 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Summary of Changes
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cellEdits.slice(0, 20).map((edit, index) => (
              <div key={index} className="text-sm text-blue-800">
                <span className="font-medium">Row {edit.rowIndex + 1}, {edit.field}:</span>
                <span className="text-blue-600"> "{edit.originalValue}"</span>
                <span className="text-blue-800"> → </span>
                <span className="text-blue-600">"{edit.newValue}"</span>
              </div>
            ))}
            {cellEdits.length > 20 && (
              <div className="text-sm text-blue-700 font-medium pt-2 border-t border-blue-200">
                +{cellEdits.length - 20} more changes
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Sticky Footer with CTAs */}
      <StickyFooter onBack={handleCancelClick} hideNext>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancelClick}>
              Cancel
            </Button>
            {hasChanges && (
              <span className="text-sm text-gray-600">
                {cellEdits.length} unsaved change{cellEdits.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <Button
            onClick={() => onSave(editedData)}
            disabled={hasErrors}
            className={hasErrors 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
            {hasChanges && ` (${cellEdits.length})`}
          </Button>
        </div>
      </StickyFooter>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        onConfirm={confirmCancel}
        title="Discard changes?"
        description={`You have ${cellEdits.length} unsaved change${cellEdits.length !== 1 ? 's' : ''}. If you go back now, all changes will be lost.`}
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        variant="destructive"
      />
    </div>
  );
}