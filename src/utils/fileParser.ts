import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedFileData {
  headers: string[];
  data: any[];
  rowCount: number;
  columnCount: number;
}

/**
 * Parse CSV file using Papaparse
 */
export const parseCSVFile = (file: File): Promise<ParsedFileData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        
        const headers = results.meta.fields || [];
        const data = results.data;
        
        resolve({
          headers,
          data,
          rowCount: data.length,
          columnCount: headers.length
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`));
      }
    });
  });
};

/**
 * Parse Excel file using xlsx library
 */
export const parseExcelFile = (file: File): Promise<ParsedFileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }
        
        // First row is headers
        const headers = (jsonData[0] as any[]).map(h => String(h || '').trim());
        
        // Rest are data rows
        const dataRows = jsonData.slice(1).map((row: any) => {
          const rowObj: any = {};
          headers.forEach((header, index) => {
            rowObj[header] = row[index] !== undefined ? String(row[index]) : '';
          });
          return rowObj;
        });
        
        resolve({
          headers,
          data: dataRows,
          rowCount: dataRows.length,
          columnCount: headers.length
        });
      } catch (error) {
        reject(new Error(`Excel parsing error: ${(error as Error).message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Main file parser that detects type and uses appropriate parser
 */
export const parseFile = async (file: File): Promise<ParsedFileData> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return parseCSVFile(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcelFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload CSV or Excel files.');
  }
};


