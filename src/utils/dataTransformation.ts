/**
 * Data Transformation Utilities
 * Transforms source data using field mappings to match output template requirements
 */

import { BankTemplate, FieldMapping } from '../App';

export interface TransformationResult {
  data: Record<string, any>[];
  totalRows: number;
  transformedFields: string[];
}

/**
 * Transform source data using field mapping
 * @param sourceData - Original data from uploaded file
 * @param mapping - Field mapping (targetField -> sourceField)
 * @param template - Output template with required/optional fields
 * @returns Transformed data ready for export
 */
export const transformData = (
  sourceData: Record<string, any>[],
  mapping: FieldMapping,
  template: BankTemplate
): TransformationResult => {
  const transformedData: Record<string, any>[] = [];
  const allFields = [...template.requiredFields, ...template.optionalFields];

  sourceData.forEach((sourceRow) => {
    const transformedRow: Record<string, any> = {};

    // Apply mapping for each field in the template
    allFields.forEach((targetField) => {
      const sourceField = mapping[targetField];

      if (sourceField) {
        // Get value from source data
        let value = sourceRow[sourceField];

        // Apply field-specific formatting
        value = formatFieldValue(targetField, value);

        transformedRow[targetField] = value;
      } else {
        // Field not mapped, leave empty
        transformedRow[targetField] = '';
      }
    });

    transformedData.push(transformedRow);
  });

  return {
    data: transformedData,
    totalRows: transformedData.length,
    transformedFields: allFields,
  };
};

/**
 * Format field values based on field type
 * @param fieldName - Target field name
 * @param value - Value to format
 * @returns Formatted value
 */
export const formatFieldValue = (fieldName: string, value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string
  let formattedValue = String(value).trim();

  // Field-specific formatting
  const lowerFieldName = fieldName.toLowerCase();

  // Amount formatting
  if (lowerFieldName.includes('amount') || lowerFieldName.includes('amt')) {
    // Remove currency symbols and commas
    formattedValue = formattedValue.replace(/[$,]/g, '');
    
    // Parse and format to 2 decimal places
    const numValue = parseFloat(formattedValue);
    if (!isNaN(numValue)) {
      formattedValue = numValue.toFixed(2);
    }
  }

  // Phone number formatting (remove special characters)
  if (lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) {
    formattedValue = formattedValue.replace(/[^0-9]/g, '');
  }

  // Routing number formatting (ensure 9 digits)
  if (lowerFieldName.includes('routing')) {
    formattedValue = formattedValue.replace(/[^0-9]/g, '');
    // Pad with leading zeros if needed
    if (formattedValue.length < 9) {
      formattedValue = formattedValue.padStart(9, '0');
    }
  }

  // Account number formatting (remove special characters)
  if (lowerFieldName.includes('account') || lowerFieldName.includes('acct')) {
    formattedValue = formattedValue.replace(/[^0-9]/g, '');
  }

  // Email formatting (lowercase)
  if (lowerFieldName.includes('email') || lowerFieldName.includes('mail')) {
    formattedValue = formattedValue.toLowerCase();
  }

  // Name formatting (title case)
  if (lowerFieldName.includes('name')) {
    formattedValue = toTitleCase(formattedValue);
  }

  return formattedValue;
};

/**
 * Convert string to title case
 */
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate CSV content from transformed data
 * @param data - Transformed data array
 * @param fields - Field names for CSV header
 * @returns CSV string ready for download
 */
export const generateCSV = (
  data: Record<string, any>[],
  fields: string[]
): string => {
  // Create header row
  const header = fields.join(',');

  // Create data rows
  const rows = data.map((row) => {
    return fields
      .map((field) => {
        let value = row[field] || '';
        
        // Escape values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      })
      .join(',');
  });

  return [header, ...rows].join('\n');
};


