import { useCallback, useState } from 'react';
import { ChevronRight, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { UploadedFile, BankTemplate, FieldMapping } from '../App';

interface DragDropMapperProps {
  uploadedFile: UploadedFile;
  selectedTemplate: BankTemplate;
  fieldMapping: FieldMapping;
  setFieldMapping: (mapping: FieldMapping) => void;
}

interface DragState {
  isDragging: boolean;
  draggedField: string | null;
  draggedType: 'source' | 'target' | null;
  hoveredTarget: string | null;
}

export function DragDropMapper({ 
  uploadedFile, 
  selectedTemplate, 
  fieldMapping, 
  setFieldMapping 
}: DragDropMapperProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedField: null,
    draggedType: null,
    hoveredTarget: null
  });

  const handleDragStart = useCallback((field: string, type: 'source' | 'target') => {
    setDragState({
      isDragging: true,
      draggedField: field,
      draggedType: type,
      hoveredTarget: null
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetField: string) => {
    e.preventDefault();
    if (dragState.draggedType === 'source') {
      setDragState(prev => ({ ...prev, hoveredTarget: targetField }));
    }
  }, [dragState.draggedType]);

  const handleDragLeave = useCallback(() => {
    setDragState(prev => ({ ...prev, hoveredTarget: null }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetField: string) => {
    e.preventDefault();
    
    if (dragState.draggedField && dragState.draggedType === 'source') {
      // Map the dragged source field to the target field
      setFieldMapping({
        ...fieldMapping,
        [targetField]: dragState.draggedField
      });
    }
    
    setDragState({
      isDragging: false,
      draggedField: null,
      draggedType: null,
      hoveredTarget: null
    });
  }, [dragState.draggedField, dragState.draggedType, fieldMapping, setFieldMapping]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedField: null,
      draggedType: null,
      hoveredTarget: null
    });
  }, []);

  const clearMapping = (targetField: string) => {
    const newMapping = { ...fieldMapping };
    delete newMapping[targetField];
    setFieldMapping(newMapping);
  };

  const isSourceFieldMapped = (sourceField: string) => {
    return Object.values(fieldMapping).includes(sourceField);
  };

  const getMappedSourceField = (targetField: string) => {
    return fieldMapping[targetField];
  };

  const getSuggestion = (targetField: string): string | null => {
    const targetLower = targetField.toLowerCase();
    const fileHeaders = uploadedFile.headers;
    
    // Find the best match
    for (const header of fileHeaders) {
      const headerLower = header.toLowerCase();
      
      // Direct substring matches
      if (headerLower.includes(targetLower.replace('_', '')) || 
          targetLower.replace('_', '').includes(headerLower)) {
        return isSourceFieldMapped(header) ? null : header;
      }
    }
    
    // Fuzzy matches
    if (targetLower.includes('acct') || targetLower.includes('account')) {
      const match = fileHeaders.find(h => 
        (h.toLowerCase().includes('account') || h.toLowerCase().includes('acct')) && 
        !isSourceFieldMapped(h)
      );
      if (match) return match;
    }
    
    if (targetLower.includes('name') || targetLower.includes('recipient')) {
      const match = fileHeaders.find(h => 
        (h.toLowerCase().includes('name') || h.toLowerCase().includes('vendor')) && 
        !isSourceFieldMapped(h)
      );
      if (match) return match;
    }
    
    if (targetLower.includes('routing')) {
      const match = fileHeaders.find(h => 
        (h.toLowerCase().includes('routing') || h.toLowerCase().includes('bank')) && 
        !isSourceFieldMapped(h)
      );
      if (match) return match;
    }
    
    if (targetLower.includes('email')) {
      const match = fileHeaders.find(h => 
        h.toLowerCase().includes('email') && !isSourceFieldMapped(h)
      );
      if (match) return match;
    }
    
    return null;
  };

  const applySuggestion = (targetField: string, sourceField: string) => {
    setFieldMapping({
      ...fieldMapping,
      [targetField]: sourceField
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Source Fields */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200">
        <h3 className="mb-4 text-gray-900 flex items-center gap-2">
          <span>Your File</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {uploadedFile.headers.length} columns
          </Badge>
        </h3>
        
        <div className="space-y-2">
          {uploadedFile.headers.map((header, index) => {
            const isMapped = isSourceFieldMapped(header);
            const isDragged = dragState.draggedField === header && dragState.draggedType === 'source';
            
            return (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(header, 'source')}
                onDragEnd={handleDragEnd}
                className={`
                  p-3 rounded-lg border cursor-move transition-all
                  ${isDragged ? 'opacity-50 scale-105' : ''}
                  ${isMapped 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{header}</span>
                  {isMapped && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Arrow */}
      <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-white border border-gray-200 rounded-full p-3 shadow-sm">
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Target Fields */}
      <Card className="p-6 rounded-2xl bg-white border border-gray-200">
        <h3 className="mb-4 text-gray-900 flex items-center gap-2">
          <span>Output Template</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {selectedTemplate.name}
          </Badge>
        </h3>
        
        <div className="space-y-3">
          {/* Required Fields */}
          {selectedTemplate.requiredFields.map((field) => {
            const mappedSource = getMappedSourceField(field);
            const suggestion = getSuggestion(field);
            const isHovered = dragState.hoveredTarget === field;
            
            return (
              <div
                key={field}
                onDragOver={(e) => handleDragOver(e, field)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, field)}
                className={`
                  rounded-lg transition-all
                  ${isHovered 
                    ? 'border-2 border-blue-400 bg-blue-50 scale-105' 
                    : mappedSource 
                      ? 'border-2 border-emerald-300 bg-emerald-50/30' 
                      : 'border-2 border-red-300 bg-red-50/30'
                  }
                `}
              >
                <div className={`flex items-center justify-between p-3 ${
                  mappedSource ? 'bg-emerald-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${mappedSource ? 'text-emerald-900' : 'text-red-900'}`}>
                      {field}
                    </span>
                    <Badge 
                      variant={mappedSource ? "default" : "destructive"} 
                      className={`text-xs ${
                        mappedSource 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      Required
                    </Badge>
                    {mappedSource && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  {mappedSource && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearMapping(field)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="px-3 pb-3">
                  {mappedSource ? (
                    <div className="p-2 bg-white border border-emerald-200 rounded text-emerald-700 text-sm font-medium">
                      ✓ Mapped to: {mappedSource}
                    </div>
                  ) : suggestion ? (
                    <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2 text-blue-700 text-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Suggested: {suggestion}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(field, suggestion)}
                        className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="p-2 border-2 border-dashed border-red-200 rounded text-red-600 text-sm text-center bg-white">
                      Drop a field here or drag from left
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Optional Fields */}
          {selectedTemplate.optionalFields.map((field) => {
            const mappedSource = getMappedSourceField(field);
            const suggestion = getSuggestion(field);
            const isHovered = dragState.hoveredTarget === field;
            
            return (
              <div
                key={field}
                onDragOver={(e) => handleDragOver(e, field)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, field)}
                className={`
                  rounded-lg transition-all
                  ${isHovered 
                    ? 'border-2 border-blue-400 bg-blue-50 scale-105' 
                    : mappedSource 
                      ? 'border-2 border-emerald-300 bg-emerald-50/30' 
                      : 'border border-gray-200 bg-gray-50/30'
                  }
                `}
              >
                <div className={`flex items-center justify-between p-3 ${
                  mappedSource ? 'bg-emerald-50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${mappedSource ? 'text-emerald-900' : 'text-gray-700'}`}>
                      {field}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        mappedSource 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      Optional
                    </Badge>
                    {mappedSource && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  {mappedSource && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => clearMapping(field)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
                
                <div className="px-3 pb-3">
                  {mappedSource ? (
                    <div className="p-2 bg-white border border-emerald-200 rounded text-emerald-700 text-sm font-medium">
                      ✓ Mapped to: {mappedSource}
                    </div>
                  ) : suggestion ? (
                    <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex items-center gap-2 text-blue-700 text-sm">
                        <Sparkles className="w-3 h-3" />
                        <span>Suggested: {suggestion}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion(field, suggestion)}
                        className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="p-2 border-2 border-dashed border-gray-300 rounded text-gray-500 text-sm text-center">
                      Drop a field here (optional)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}