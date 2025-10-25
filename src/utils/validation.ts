/**
 * Validation utilities for bank data fields
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: true }; // Empty is OK for optional fields
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate US routing number (ABA routing number)
 * Must be 9 digits
 */
export const validateRoutingNumber = (routing: string): ValidationResult => {
  if (!routing) {
    return { isValid: false, error: 'Routing number is required' };
  }
  
  // Remove any spaces or dashes
  const cleanRouting = routing.replace(/[\s-]/g, '');
  
  if (!/^\d{9}$/.test(cleanRouting)) {
    if (cleanRouting.length < 9) {
      return {
        isValid: false,
        error: 'Routing number too short (must be 9 digits)'
      };
    }
    return {
      isValid: false,
      error: 'Invalid routing number format (must be 9 digits)'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate account number
 * Usually 8-17 digits
 */
export const validateAccountNumber = (account: string): ValidationResult => {
  if (!account) {
    return { isValid: false, error: 'Account number is required' };
  }
  
  const cleanAccount = account.replace(/[\s-]/g, '');
  
  if (!/^\d+$/.test(cleanAccount)) {
    return {
      isValid: false,
      error: 'Account number must contain only digits'
    };
  }
  
  if (cleanAccount.length < 4 || cleanAccount.length > 17) {
    return {
      isValid: false,
      error: 'Account number must be 4-17 digits'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate amount/monetary value
 */
export const validateAmount = (amount: string): ValidationResult => {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }
  
  const num = parseFloat(amount.replace(/,/g, ''));
  
  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Amount must be numeric'
    };
  }
  
  if (num < 0) {
    return {
      isValid: false,
      error: 'Amount cannot be negative'
    };
  }
  
  if (num === 0) {
    return {
      isValid: false,
      error: 'Amount must be greater than zero'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate SWIFT/BIC code
 * Format: 8 or 11 alphanumeric characters
 */
export const validateSWIFTCode = (swift: string): ValidationResult => {
  if (!swift) {
    return { isValid: false, error: 'SWIFT code is required' };
  }
  
  const cleanSwift = swift.replace(/[\s-]/g, '').toUpperCase();
  
  if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanSwift)) {
    return {
      isValid: false,
      error: 'Invalid SWIFT code format'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate IBAN (International Bank Account Number)
 */
export const validateIBAN = (iban: string): ValidationResult => {
  if (!iban) {
    return { isValid: false, error: 'IBAN is required' };
  }
  
  const cleanIBAN = iban.replace(/[\s-]/g, '').toUpperCase();
  
  // Basic length check (15-34 characters)
  if (cleanIBAN.length < 15 || cleanIBAN.length > 34) {
    return {
      isValid: false,
      error: 'Invalid IBAN length'
    };
  }
  
  // Check format: 2 letters + 2 digits + alphanumeric
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleanIBAN)) {
    return {
      isValid: false,
      error: 'Invalid IBAN format'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate required field (not empty)
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  
  return { isValid: true };
};

/**
 * Validate field based on field name/type
 */
export const validateField = (fieldName: string, value: string, isRequired: boolean): ValidationResult => {
  // Check if required
  if (isRequired && (!value || value.trim() === '')) {
    return {
      isValid: false,
      error: 'Required field is empty'
    };
  }
  
  // If empty and not required, it's valid
  if (!value || value.trim() === '') {
    return { isValid: true };
  }
  
  const fieldLower = fieldName.toLowerCase();
  
  // Email validation
  if (fieldLower.includes('email')) {
    return validateEmail(value);
  }
  
  // Routing number validation
  if (fieldLower.includes('routing')) {
    return validateRoutingNumber(value);
  }
  
  // Account number validation
  if (fieldLower.includes('account') || fieldLower.includes('acct')) {
    return validateAccountNumber(value);
  }
  
  // Amount validation
  if (fieldLower.includes('amount')) {
    return validateAmount(value);
  }
  
  // SWIFT code validation
  if (fieldLower.includes('swift')) {
    return validateSWIFTCode(value);
  }
  
  // IBAN validation
  if (fieldLower.includes('iban')) {
    return validateIBAN(value);
  }
  
  return { isValid: true };
};


