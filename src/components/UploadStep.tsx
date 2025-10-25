import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Alert, AlertDescription } from './ui/alert';
import { UploadedFile } from '../App';
import { parseFile } from '../utils/fileParser';
import { toast } from 'sonner';
import { StickyFooter } from './StickyFooter';
import { ConfirmDialog } from './ConfirmDialog';

interface UploadStepProps {
  onNext: () => void;
  onBack: () => void;
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;
}

export function UploadStep({ onNext, onBack, uploadedFile, setUploadedFile }: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit. Please upload a smaller file.');
      }

      // Validate file type
      const validExtensions = ['csv', 'xlsx', 'xls'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !validExtensions.includes(extension)) {
        throw new Error('Invalid file type. Please upload a CSV or Excel file.');
      }

      // Parse the file using our utility
      const parsedData = await parseFile(file);
      
      // Validate parsed data
      if (parsedData.rowCount === 0) {
        throw new Error('File is empty. Please upload a file with data.');
      }

      if (parsedData.columnCount === 0) {
        throw new Error('No columns found in file. Please check your file format.');
      }

      // Set the uploaded file data
      const uploadedFileData: UploadedFile = {
        name: file.name,
        headers: parsedData.headers,
        data: parsedData.data
      };
      
      setUploadedFile(uploadedFileData);
      setShowPreview(true); // Auto-show preview on successful upload
      toast.success(`Successfully parsed ${parsedData.rowCount} rows and ${parsedData.columnCount} columns!`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse file';
      setError(errorMessage);
      toast.error(errorMessage);
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Upload Your Data</h1>
        <p className="text-gray-600 text-sm">
          Upload your CSV or Excel file containing the data you want to transform.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-white mb-6">
        <div
          className={`relative transition-colors duration-200 ${
            isDragOver ? 'bg-blue-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center py-12">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Processing file...</p>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-emerald-900 mb-2">{uploadedFile.name}</h3>
                <p className="text-emerald-700 text-sm mb-2">
                  {uploadedFile.data.length} rows • {uploadedFile.headers.length} columns
                </p>
                <Button
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                  className="text-sm"
                >
                  Upload Different File
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">Drag & drop your file here</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Supports CSV and Excel files
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Data Preview */}
      {uploadedFile && (
        <Card className="p-6 rounded-2xl bg-white border border-gray-200 mb-6">
          <Collapsible open={showPreview} onOpenChange={setShowPreview}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 mb-4">
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide Preview' : 'Show Data Preview'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="text-gray-900">First 5 rows of your data</h4>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {uploadedFile.headers.map((header, index) => (
                          <TableHead key={index} className="whitespace-nowrap bg-gray-50">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedFile.data.slice(0, 5).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {uploadedFile.headers.map((header, colIndex) => (
                            <TableCell key={colIndex} className="whitespace-nowrap">
                              {row[header] || '-'}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {uploadedFile.data.length > 5 && (
                  <div className="bg-gray-50 px-4 py-2 border-t text-sm text-gray-600">
                    ... and {uploadedFile.data.length - 5} more rows
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Security & Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-32">
        <Card className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h4 className="text-emerald-900 mb-1 font-medium">100% Secure</h4>
              <p className="text-emerald-700 text-sm">
                Your data is processed entirely in your browser. We never upload or store your sensitive information on any server.
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-900 mb-1 font-medium">Coming Soon</h4>
              <p className="text-blue-700 text-sm">
                Direct connections to QuickBooks, NetSuite, and other accounting systems.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Footer Navigation */}
      <StickyFooter
        onBack={() => uploadedFile ? setShowBackConfirm(true) : onBack()}
        onNext={onNext}
        nextDisabled={!uploadedFile}
      />

      {/* Back Confirmation Dialog */}
      <ConfirmDialog
        open={showBackConfirm}
        onOpenChange={setShowBackConfirm}
        onConfirm={onBack}
        title="Go back to dashboard?"
        description="Your uploaded file will be cleared if you go back. You'll need to upload again."
        confirmText="Go Back"
        cancelText="Stay Here"
        variant="destructive"
      />
    </div>
  );
}