/**
 * Data Validation Utilities
 * Validates data against template requirements
 */

import { BankTemplate, FieldMapping } from '../App';

export interface ValidationError {
  row: number;
  field: string;
  error: string;
  value?: any;
}

export interface ValidationResult {
  valid: number;
  errors: number;
  warnings: number;
  total: number;
  errorDetails: ValidationError[];
  warningDetails: ValidationError[];
}

/**
 * Validate data against template requirements
 * @param sourceData - Original data from uploaded file
 * @param mapping - Field mapping (targetField -> sourceField)
 * @param template - Output template with validation rules
 * @returns Validation results with detailed errors
 */
export const validateData = (
  sourceData: Record<string, any>[],
  mapping: FieldMapping,
  template: BankTemplate
): ValidationResult => {
  const errorDetails: ValidationError[] = [];
  const warningDetails: ValidationError[] = [];

  sourceData.forEach((row, rowIndex) => {
    // Validate required fields
    template.requiredFields.forEach((targetField: string) => {
      const sourceField = mapping[targetField];

      if (!sourceField) {
        // Required field not mapped
        errorDetails.push({
          row: rowIndex + 1,
          field: targetField,
          error: 'Required field not mapped',
        });
      } else {
        const value = row[sourceField];

        if (value === null || value === undefined || String(value).trim() === '') {
          // Required field is empty
          errorDetails.push({
            row: rowIndex + 1,
            field: targetField,
            error: 'Required field is empty',
            value: value,
          });
        } else {
          // Validate field format
          const formatError = validateFieldFormat(targetField, value);
          if (formatError) {
            errorDetails.push({
              row: rowIndex + 1,
              field: targetField,
              error: formatError,
              value: value,
            });
          }
        }
      }
    });

    // Validate optional fields (warnings only)
    template.optionalFields.forEach((targetField: string) => {
      const sourceField = mapping[targetField];

      if (sourceField) {
        const value = row[sourceField];

        if (value !== null && value !== undefined && String(value).trim() !== '') {
          // Validate field format
          const formatError = validateFieldFormat(targetField, value);
          if (formatError) {
            warningDetails.push({
              row: rowIndex + 1,
              field: targetField,
              error: formatError,
              value: value,
            });
          }
        }
      }
    });
  });

  const totalRows = sourceData.length;
  const errorCount = errorDetails.length;
  const warningCount = warningDetails.length;
  
  // Count rows with at least one error
  const rowsWithErrors = new Set(errorDetails.map(e => e.row)).size;
  const validRows = totalRows - rowsWithErrors;

  return {
    valid: validRows,
    errors: errorCount,
    warnings: warningCount,
    total: totalRows,
    errorDetails,
    warningDetails,
  };
};

/**
 * Validate individual field format
 * @param fieldName - Target field name
 * @param value - Value to validate
 * @returns Error message if invalid, null if valid
 */
export const validateFieldFormat = (fieldName: string, value: any): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const stringValue = String(value).trim();
  if (stringValue === '') {
    return null;
  }

  const lowerFieldName = fieldName.toLowerCase();

  // Email validation
  if (lowerFieldName.includes('email') || lowerFieldName.includes('mail')) {
    if (!isValidEmail(stringValue)) {
      return 'Invalid email format';
    }
  }

  // Routing/tracking code validation (9-digit codes)
  if (lowerFieldName.includes('routing') || lowerFieldName.includes('tracking')) {
    if (!isValidRoutingNumber(stringValue)) {
      return 'Invalid code format (must be 9 digits)';
    }
  }

  // Account/ID number validation
  if (lowerFieldName.includes('account') || lowerFieldName.includes('acct') || lowerFieldName.includes('_id')) {
    if (!isValidAccountNumber(stringValue)) {
      return 'Invalid ID format';
    }
  }

  // Amount validation
  if (lowerFieldName.includes('amount') || lowerFieldName.includes('amt')) {
    if (!isValidAmount(stringValue)) {
      return 'Invalid amount (must be a positive number)';
    }
  }

  // Phone number validation
  if (lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) {
    if (!isValidPhoneNumber(stringValue)) {
      return 'Invalid phone number format';
    }
  }

  // ZIP code validation
  if (lowerFieldName.includes('zip') || lowerFieldName.includes('postal')) {
    if (!isValidZipCode(stringValue)) {
      return 'Invalid ZIP code format';
    }
  }

  return null;
};

/**
 * Email validation regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Routing/tracking code validation (9 digits)
 */
export const isValidRoutingNumber = (routing: string): boolean => {
  // Trim and remove non-digits
  const cleanRouting = String(routing).trim().replace(/[^0-9]/g, '');

  // Must be exactly 9 digits
  if (cleanRouting.length !== 9) {
    return false;
  }

  // All 9-digit numeric values are accepted
  return true;
  
  // Optional: Uncomment for ABA checksum validation
  // const digits = cleanRouting.split('').map(Number);
  // const checksum =
  //   (3 * (digits[0] + digits[3] + digits[6]) +
  //     7 * (digits[1] + digits[4] + digits[7]) +
  //     (digits[2] + digits[5] + digits[8])) %
  //   10;
  // return checksum === 0;
};

/**
 * Account/ID number validation
 */
export const isValidAccountNumber = (account: string): boolean => {
  // Remove non-digits
  const cleanAccount = account.replace(/[^0-9]/g, '');

  // Must be between 4 and 17 digits
  return cleanAccount.length >= 4 && cleanAccount.length <= 17;
};

/**
 * Amount validation
 */
export const isValidAmount = (amount: string): boolean => {
  // Remove currency symbols and commas
  const cleanAmount = amount.replace(/[$,]/g, '');

  // Parse as number
  const numValue = parseFloat(cleanAmount);

  // Must be a valid positive number
  return !isNaN(numValue) && numValue > 0;
};

/**
 * Phone number validation (US format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove non-digits
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Must be 10 or 11 digits (with or without country code)
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

/**
 * ZIP code validation (US format: 5 digits or 5+4)
 */
export const isValidZipCode = (zip: string): boolean => {
  // Remove non-digits and hyphens
  const cleanZip = zip.replace(/[^0-9-]/g, '');

  // Match 5 digits or 5+4 format
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(cleanZip);
};

/**
 * Check for duplicate values in a field
 */
export const findDuplicates = (
  data: Record<string, any>[],
  fieldName: string
): Map<any, number[]> => {
  const valueMap = new Map<any, number[]>();

  data.forEach((row, index) => {
    const value = row[fieldName];
    if (value !== null && value !== undefined && String(value).trim() !== '') {
      if (!valueMap.has(value)) {
        valueMap.set(value, []);
      }
      valueMap.get(value)!.push(index + 1);
    }
  });

  // Filter to only duplicates
  const duplicates = new Map<any, number[]>();
  valueMap.forEach((rows, value) => {
    if (rows.length > 1) {
      duplicates.set(value, rows);
    }
  });

  return duplicates;
};


