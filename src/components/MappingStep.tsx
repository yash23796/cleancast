import React, { useEffect, useState } from 'react';
import { ArrowRight, Save, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DragDropMapper } from './DragDropMapper';
import { UploadedFile, BankTemplate, FieldMapping } from '../App';
import { StickyFooter } from './StickyFooter';
import { ConfirmDialog } from './ConfirmDialog';

interface MappingStepProps {
  onNext: () => void;
  onBack: () => void;
  uploadedFile: UploadedFile | null;
  selectedTemplate: BankTemplate | null;
  fieldMapping: FieldMapping;
  setFieldMapping: (mapping: FieldMapping) => void;
}

export function MappingStep({ 
  onNext, 
  onBack, 
  uploadedFile, 
  selectedTemplate, 
  fieldMapping, 
  setFieldMapping 
}: MappingStepProps) {
  const [autoMapped, setAutoMapped] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  // Auto-mapping suggestions
  const getAutoMapping = () => {
    if (!uploadedFile || !selectedTemplate) return {};
    
    const suggestions: FieldMapping = {};
    const fileHeaders = uploadedFile.headers.map(h => h.toLowerCase());
    const allTemplateFields = [...selectedTemplate.requiredFields, ...selectedTemplate.optionalFields];
    
    // Smart mapping logic
    allTemplateFields.forEach(templateField => {
      const templateLower = templateField.toLowerCase();
      
      // Direct matches
      const directMatch = fileHeaders.find(header => 
        header.includes(templateLower.replace('_', '')) ||
        templateLower.replace('_', '').includes(header)
      );
      
      if (directMatch) {
        const originalHeader = uploadedFile.headers[fileHeaders.indexOf(directMatch)];
        suggestions[templateField] = originalHeader;
        return;
      }
      
      // Fuzzy matches
      if (templateLower.includes('acct') || templateLower.includes('account')) {
        const accountMatch = fileHeaders.find(h => h.includes('account') || h.includes('acct'));
        if (accountMatch) {
          suggestions[templateField] = uploadedFile.headers[fileHeaders.indexOf(accountMatch)];
        }
      }
      
      if (templateLower.includes('name') || templateLower.includes('recipient')) {
        const nameMatch = fileHeaders.find(h => h.includes('name') || h.includes('vendor'));
        if (nameMatch) {
          suggestions[templateField] = uploadedFile.headers[fileHeaders.indexOf(nameMatch)];
        }
      }
      
      if (templateLower.includes('routing')) {
        const routingMatch = fileHeaders.find(h => h.includes('routing') || h.includes('bank'));
        if (routingMatch) {
          suggestions[templateField] = uploadedFile.headers[fileHeaders.indexOf(routingMatch)];
        }
      }
      
      if (templateLower.includes('email')) {
        const emailMatch = fileHeaders.find(h => h.includes('email'));
        if (emailMatch) {
          suggestions[templateField] = uploadedFile.headers[fileHeaders.indexOf(emailMatch)];
        }
      }
    });
    
    return suggestions;
  };

  const handleAutoMap = () => {
    const autoMapping = getAutoMapping();
    setFieldMapping(autoMapping);
    setAutoMapped(true);
  };

  const handleFieldMapping = (templateField: string, fileHeader: string) => {
    setFieldMapping({
      ...fieldMapping,
      [templateField]: fileHeader
    });
  };

  const getMappedCount = () => {
    if (!selectedTemplate) return 0;
    return selectedTemplate.requiredFields.filter(field => fieldMapping[field]).length;
  };

  const getTotalRequired = () => {
    return selectedTemplate?.requiredFields.length || 0;
  };

  const canProceed = () => {
    if (!selectedTemplate) return false;
    return selectedTemplate.requiredFields.every(field => fieldMapping[field]);
  };

  const hasMappings = Object.keys(fieldMapping).length > 0;

  const handleBackClick = () => {
    if (hasMappings) {
      setShowBackConfirm(true);
    } else {
      onBack();
    }
  };

  if (!uploadedFile || !selectedTemplate) {
    return <div>Missing data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-32">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Map Fields</h1>
        <p className="text-gray-600 text-sm">
          Match your file columns to the output template fields. Required fields must be mapped to continue.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Required Fields Mapped</span>
          <span className="text-sm text-gray-600">{getMappedCount()}/{getTotalRequired()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(getMappedCount() / getTotalRequired()) * 100}%` }}
          />
        </div>
      </div>

      {/* Auto-mapping suggestion */}
      <Card className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="text-blue-900 font-medium">Smart Auto-Mapping Available</h4>
              <p className="text-blue-700 text-sm">
                We can automatically map common fields. You can adjust them afterwards.
              </p>
            </div>
          </div>
          <Button 
            onClick={handleAutoMap}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={autoMapped}
          >
            {autoMapped ? 'Auto-Mapped' : 'Auto-Map Fields'}
          </Button>
        </div>
      </Card>

      {/* Mapping Interface Mode Selector */}
      <Tabs defaultValue="classic" className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 p-1 bg-gray-100 rounded-lg h-auto mb-6">
          <TabsTrigger 
            value="classic"
            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Classic View
          </TabsTrigger>
          <TabsTrigger 
            value="dragdrop"
            className="rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
          >
            Drag & Drop
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="classic" className="space-y-8">
          {/* Original Mapping Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Your File */}
        <Card className="p-6 rounded-2xl bg-white border border-gray-200">
          <h3 className="mb-4 text-gray-900">Your File</h3>
          <div className="space-y-3">
            {uploadedFile.headers.map((header, index) => (
              <div 
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700"
              >
                {header}
              </div>
            ))}
          </div>
        </Card>

        {/* Output Template */}
        <Card className="p-6 rounded-2xl bg-white border border-gray-200">
          <h3 className="mb-4 text-gray-900">Output Template</h3>
          <div className="space-y-3">
            {/* Required Fields */}
            {selectedTemplate.requiredFields.map((field) => {
              const isMapped = !!fieldMapping[field];
              return (
                <div 
                  key={field} 
                  className={`rounded-lg overflow-hidden transition-all ${
                    isMapped 
                      ? 'border-2 border-emerald-300 bg-emerald-50/30' 
                      : 'border-2 border-red-300 bg-red-50/30'
                  }`}
                >
                  <div className={`flex items-center justify-between p-3 ${
                    isMapped ? 'bg-emerald-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isMapped ? 'text-emerald-900' : 'text-red-900'}`}>
                        {field}
                      </span>
                      <Badge 
                        variant={isMapped ? "default" : "destructive"} 
                        className={`text-xs ${
                          isMapped 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        Required
                      </Badge>
                      {isMapped && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <Select
                      value={fieldMapping[field] || 'none'}
                      onValueChange={(value) => handleFieldMapping(field, value === 'none' ? '' : value)}
                    >
                      <SelectTrigger className={`w-full ${
                        isMapped 
                          ? 'border-emerald-300 focus:ring-emerald-500' 
                          : 'border-red-300 focus:ring-red-500'
                      }`}>
                        <SelectValue placeholder="Select field to map..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No mapping</SelectItem>
                        {uploadedFile.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}

            {/* Optional Fields */}
            {selectedTemplate.optionalFields.map((field) => {
              const isMapped = !!fieldMapping[field];
              return (
                <div 
                  key={field} 
                  className={`rounded-lg overflow-hidden transition-all ${
                    isMapped 
                      ? 'border-2 border-emerald-300 bg-emerald-50/30' 
                      : 'border border-gray-200 bg-gray-50/30'
                  }`}
                >
                  <div className={`flex items-center justify-between p-3 ${
                    isMapped ? 'bg-emerald-50' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isMapped ? 'text-emerald-900' : 'text-gray-700'}`}>
                        {field}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          isMapped 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        Optional
                      </Badge>
                      {isMapped && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <Select
                      value={fieldMapping[field] || 'none'}
                      onValueChange={(value) => handleFieldMapping(field, value === 'none' ? '' : value)}
                    >
                      <SelectTrigger className={`w-full ${
                        isMapped ? 'border-emerald-300 focus:ring-emerald-500' : ''
                      }`}>
                        <SelectValue placeholder="Select field to map..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No mapping</SelectItem>
                        {uploadedFile.headers.map((header) => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="dragdrop" className="space-y-8">
          {/* Drag & Drop Mapping Interface */}
          <div className="relative">
            <DragDropMapper 
              uploadedFile={uploadedFile}
              selectedTemplate={selectedTemplate}
              fieldMapping={fieldMapping}
              setFieldMapping={setFieldMapping}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Mapping Profile - Compact Card */}
      <Card className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl mb-32">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">
              Save this mapping configuration for future imports
            </span>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Save Profile
          </Button>
        </div>
      </Card>

      {/* Sticky Footer Navigation */}
      <StickyFooter
        onBack={handleBackClick}
        onNext={onNext}
        nextDisabled={!canProceed()}
      />

      {/* Back Confirmation Dialog */}
      <ConfirmDialog
        open={showBackConfirm}
        onOpenChange={setShowBackConfirm}
        onConfirm={onBack}
        title="Go back to template selection?"
        description="Your field mappings will be lost if you go back. You'll need to map fields again."
        confirmText="Go Back"
        cancelText="Stay Here"
        variant="destructive"
      />
    </div>
  );
}