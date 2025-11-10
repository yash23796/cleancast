import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ProductApp } from './pages/ProductApp';
import { Toaster } from './components/ui/sonner';

export interface UploadedFile {
  name: string;
  headers: string[];
  data: any[];
}

export interface BankTemplate {
  name: string;
  requiredFields: string[];
  optionalFields: string[];
}

export interface FieldMapping {
  [key: string]: string;
}

export interface ValidationError {
  row: number;
  field: string;
  value: string;
  error: string;
}

export interface EditContext {
  isEditing: boolean;
  editingRow?: number;
  originalData: any[];
  validationErrors?: ValidationError[];
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<ProductApp />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}