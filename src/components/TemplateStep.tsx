import React, { useState } from 'react';
import { Upload, Library, FileText, CheckCircle2, ChevronDown, ChevronUp, Building2, Users, Package, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { BankTemplate } from '../App';
import { StickyFooter } from './StickyFooter';
import { ConfirmDialog } from './ConfirmDialog';

interface TemplateStepProps {
  onNext: () => void;
  onBack: () => void;
  selectedTemplate: BankTemplate | null;
  setSelectedTemplate: (template: BankTemplate) => void;
}

interface TemplateWithMeta extends BankTemplate {
  description: string;
  bestFor: string;
}

interface TemplateCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  templates: TemplateWithMeta[];
}

const templateCategories: TemplateCategory[] = [
  {
    id: 'banking',
    name: 'Banking & Finance',
    icon: Building2,
    description: 'Payment processing and financial transfers',
    templates: [
      {
        name: 'Standard ACH Transfer',
        description: 'Best for domestic ACH payments and direct deposits',
        bestFor: 'Payroll, vendor payments, recurring transfers',
        requiredFields: ['Account_Number', 'Recipient_Name', 'Routing_Code', 'Amount'],
        optionalFields: ['Contact_Email', 'Reference', 'Memo']
      },
      {
        name: 'Wire Transfer',
        description: 'Use for same-day domestic wire transfers',
        bestFor: 'Urgent payments, large transactions, real estate',
        requiredFields: ['Account_Number', 'Recipient_Name', 'Routing_Code', 'Amount', 'SWIFT_Code'],
        optionalFields: ['Contact_Email', 'Beneficiary_Address', 'Purpose_Code']
      },
      {
        name: 'International SWIFT',
        description: 'For cross-border payments and foreign currency',
        bestFor: 'Global payments, foreign vendors, multi-currency',
        requiredFields: ['Account_Number', 'Recipient_Name', 'IBAN', 'Amount', 'SWIFT_Code', 'Currency'],
        optionalFields: ['Contact_Email', 'Beneficiary_Address', 'Purpose_Code', 'Reference']
      }
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources',
    icon: Users,
    description: 'Employee data and workforce management',
    templates: [
      {
        name: 'Employee Master Data',
        description: 'Standard format for employee data systems',
        bestFor: 'Payroll, HRIS, benefits administration',
        requiredFields: ['Employee_ID', 'Full_Name', 'Department', 'Salary'],
        optionalFields: ['Contact_Email', 'Phone', 'Notes']
      },
      {
        name: 'Payroll Import',
        description: 'Format for payroll processing systems',
        bestFor: 'Salary payments, wage calculations, tax reporting',
        requiredFields: ['Employee_ID', 'Full_Name', 'Gross_Pay', 'Net_Pay', 'Pay_Period'],
        optionalFields: ['Tax_Deductions', 'Benefits', 'Bonus', 'Commission']
      },
      {
        name: 'Time & Attendance',
        description: 'Track employee hours and attendance',
        bestFor: 'Time tracking, shift management, overtime calculation',
        requiredFields: ['Employee_ID', 'Date', 'Clock_In', 'Clock_Out', 'Hours_Worked'],
        optionalFields: ['Break_Minutes', 'Overtime_Hours', 'Notes']
      }
    ]
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    icon: Package,
    description: 'Shipping, inventory, and fulfillment',
    templates: [
      {
        name: 'Shipment Orders',
        description: 'Format for shipping and tracking systems',
        bestFor: 'Order fulfillment, inventory management, shipping',
        requiredFields: ['Order_ID', 'Recipient_Name', 'Address', 'Package_Weight', 'Tracking_Code'],
        optionalFields: ['Contact_Email', 'Delivery_Instructions', 'Service_Level']
      },
      {
        name: 'Warehouse Inventory',
        description: 'Track stock levels and locations',
        bestFor: 'Inventory management, stock audits, warehouse operations',
        requiredFields: ['SKU', 'Product_Name', 'Quantity', 'Location', 'Unit_Cost'],
        optionalFields: ['Reorder_Point', 'Supplier', 'Category', 'Expiry_Date']
      },
      {
        name: 'Purchase Orders',
        description: 'Format for procurement and vendor orders',
        bestFor: 'Supplier orders, procurement, vendor management',
        requiredFields: ['PO_Number', 'Vendor_Name', 'Item_Description', 'Quantity', 'Unit_Price'],
        optionalFields: ['Delivery_Date', 'Payment_Terms', 'Notes']
      }
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: ShoppingCart,
    description: 'Online sales and customer orders',
    templates: [
      {
        name: 'Order Export',
        description: 'Standard format for online store integrations',
        bestFor: 'Marketplace exports, fulfillment, analytics',
        requiredFields: ['Order_ID', 'Customer_Name', 'SKU', 'Quantity', 'Total_Amount', 'Currency'],
        optionalFields: ['Contact_Email', 'Shipping_Address', 'Promo_Code', 'Notes']
      },
      {
        name: 'Product Catalog',
        description: 'Format for product listings and updates',
        bestFor: 'Product feeds, marketplace uploads, catalog management',
        requiredFields: ['Product_ID', 'Product_Name', 'Price', 'Category', 'Stock_Status'],
        optionalFields: ['Description', 'Image_URL', 'Brand', 'Weight']
      },
      {
        name: 'Customer Data',
        description: 'Customer information and contact details',
        bestFor: 'CRM imports, marketing campaigns, customer service',
        requiredFields: ['Customer_ID', 'Full_Name', 'Email', 'Phone'],
        optionalFields: ['Address', 'City', 'State', 'ZIP_Code', 'Country']
      }
    ]
  }
];

export function TemplateStep({ onNext, onBack, selectedTemplate, setSelectedTemplate }: TemplateStepProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['banking'])); // Banking expanded by default
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const handleTemplateSelect = (template: BankTemplate) => {
    setSelectedTemplate(template);
  };

  const handleBackClick = () => {
    if (selectedTemplate) {
      setShowBackConfirm(true);
    } else {
      onBack();
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleExpanded = (templateName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTemplates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templateName)) {
        newSet.delete(templateName);
      } else {
        newSet.add(templateName);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900 mb-2">Select Output Template</h1>
        <p className="text-gray-600 text-sm">
          Choose the format you want to transform your data into.
        </p>
      </div>

      {/* Tab Selection */}
      <div className="flex gap-4 mb-6">
        <Card 
          className={`p-6 cursor-pointer transition-all rounded-2xl ${
            activeTab === 'upload' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activeTab === 'upload' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-5 h-5 ${
                activeTab === 'upload' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={activeTab === 'upload' ? 'text-blue-900' : 'text-gray-900'}>
                Upload Custom Template
              </h3>
              <p className={`text-sm ${
                activeTab === 'upload' ? 'text-blue-700' : 'text-gray-600'
              }`}>
                Upload your own custom template file
              </p>
            </div>
          </div>
        </Card>

        <Card 
          className={`p-6 cursor-pointer transition-all rounded-2xl ${
            activeTab === 'library' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('library')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              activeTab === 'library' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Library className={`w-5 h-5 ${
                activeTab === 'library' ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className={activeTab === 'library' ? 'text-blue-900' : 'text-gray-900'}>
                Choose from Library
              </h3>
              <p className={`text-sm ${
                activeTab === 'library' ? 'text-blue-700' : 'text-gray-600'
              }`}>
                Select from pre-built templates
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Content */}
      {activeTab === 'upload' ? (
        <Card className="p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-white mb-32">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">Upload Custom Template</h3>
            <p className="text-gray-500 text-sm mb-4">
              Upload your own template file with your specific format
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Files
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6 mb-32">
          {templateCategories.map((category) => {
            const CategoryIcon = category.icon;
            const isCategoryExpanded = expandedCategories.has(category.id);
            const categoryTemplateCount = category.templates.length;

            return (
              <div key={category.id}>
                <Collapsible open={isCategoryExpanded} onOpenChange={() => toggleCategory(category.id)}>
                  {/* Category Header */}
                  <CollapsibleTrigger asChild>
                    <Card className="p-5 cursor-pointer transition-all rounded-xl border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:border-gray-300 hover:shadow-sm group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <CategoryIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-medium text-slate-900">{category.name}</h3>
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                {categoryTemplateCount} {categoryTemplateCount === 1 ? 'template' : 'templates'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCategoryExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                          )}
                        </div>
                      </div>
                    </Card>
                  </CollapsibleTrigger>

                  {/* Category Templates */}
                  <CollapsibleContent>
                    <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                      {category.templates.map((template, index) => {
                        const isSelected = selectedTemplate?.name === template.name;
                        const isExpanded = expandedTemplates.has(template.name);
                        
                        return (
                          <Card 
                            key={index}
                            className={`p-6 cursor-pointer transition-all rounded-xl ${
                              isSelected
                                ? 'border-2 border-emerald-300 bg-emerald-50/30 hover:border-emerald-400 shadow-sm'
                                : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
                            }`}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className={`text-lg font-medium ${isSelected ? 'text-emerald-900' : 'text-gray-900'}`}>
                                        {template.name}
                                      </h3>
                                      {isSelected && (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1">{template.description}</p>
                                    <p className="text-xs text-gray-500">
                                      <span className="font-medium">Best for:</span> {template.bestFor}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Fields Section */}
                                <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
                                  {/* Required Fields */}
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Required Fields
                                      </h4>
                                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                                        {template.requiredFields.length}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {template.requiredFields.map((field) => (
                                        <Badge key={field} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 border border-gray-200">
                                          {field}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Optional Fields with Expand/Collapse */}
                                  {template.optionalFields.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                          Optional Fields
                                        </h4>
                                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
                                          {template.optionalFields.length}
                                        </Badge>
                                        {template.optionalFields.length > 3 && (
                                          <button
                                            onClick={(e) => toggleExpanded(template.name, e)}
                                            className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                          >
                                            {isExpanded ? (
                                              <>
                                                <span>Show less</span>
                                                <ChevronUp className="w-3 h-3" />
                                              </>
                                            ) : (
                                              <>
                                                <span>Show all</span>
                                                <ChevronDown className="w-3 h-3" />
                                              </>
                                            )}
                                          </button>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {(isExpanded ? template.optionalFields : template.optionalFields.slice(0, 3)).map((field) => (
                                          <Badge key={field} variant="secondary" className="bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200">
                                            {field}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          })}

          {/* Empty State (if needed for no categories) */}
          {templateCategories.length === 0 && (
            <Card className="p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium mb-2">No Templates Available</h3>
                <p className="text-gray-600 text-sm mb-4 max-w-md">
                  No templates found in the library. You can upload a custom template or contact support to add new templates.
                </p>
                <Button onClick={() => setActiveTab('upload')} variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Custom Template
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Sticky Footer Navigation */}
      <StickyFooter
        onBack={handleBackClick}
        onNext={onNext}
        nextDisabled={!selectedTemplate}
      />

      {/* Back Confirmation Dialog */}
      <ConfirmDialog
        open={showBackConfirm}
        onOpenChange={setShowBackConfirm}
        onConfirm={onBack}
        title="Go back to upload?"
        description="Your template selection will be cleared if you go back. You'll need to select a template again."
        confirmText="Go Back"
        cancelText="Stay Here"
        variant="destructive"
      />
    </div>
  );
}