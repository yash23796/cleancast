import React, { useState } from 'react';
import { History, ChevronDown, ChevronUp, User, Upload, Edit, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface AuditEntry {
  id: string;
  timestamp: Date;
  action: 'upload' | 'template_select' | 'field_map' | 'validation' | 'edit' | 'export';
  description: string;
  details?: string;
  user: string;
  status: 'success' | 'warning' | 'error';
}

interface AuditLogProps {
  entries?: AuditEntry[];
}

const mockEntries: AuditEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    action: 'upload',
    description: 'File uploaded: vendors_export.csv',
    details: '156 rows, 8 columns detected',
    user: 'John Smith',
    status: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    action: 'template_select',
    description: 'Template selected: Standard ACH Transfer',
    details: '4 required fields, 3 optional fields',
    user: 'John Smith',
    status: 'success'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    action: 'field_map',
    description: 'Auto-mapping applied',
    details: '4/4 required fields mapped successfully',
    user: 'System',
    status: 'success'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    action: 'validation',
    description: 'Data validation completed',
    details: '148 valid rows, 8 errors found',
    user: 'System',
    status: 'warning'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    action: 'edit',
    description: 'Manual edits applied',
    details: '3 records updated, 2 errors resolved',
    user: 'John Smith',
    status: 'success'
  }
];

export function AuditLog({ entries = mockEntries }: AuditLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActionIcon = (action: AuditEntry['action']) => {
    switch (action) {
      case 'upload':
        return <Upload className="w-4 h-4" />;
      case 'template_select':
        return <Check className="w-4 h-4" />;
      case 'field_map':
        return <Edit className="w-4 h-4" />;
      case 'validation':
        return <Check className="w-4 h-4" />;
      case 'edit':
        return <Edit className="w-4 h-4" />;
      case 'export':
        return <Check className="w-4 h-4" />;
      default:
        return <History className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: AuditEntry['status']) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className="p-4 rounded-2xl bg-white border border-gray-200">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <h4 className="text-gray-900">Activity History</h4>
                <p className="text-gray-600 text-sm">{entries.length} recent actions</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
            {entries.map((entry, index) => (
              <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  entry.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  entry.status === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-gray-900 text-sm truncate">{entry.description}</h5>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(entry.status)}`}
                      >
                        {entry.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span>
                    </div>
                  </div>
                  
                  {entry.details && (
                    <p className="text-xs text-gray-600 mb-1">{entry.details}</p>
                  )}
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{entry.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}