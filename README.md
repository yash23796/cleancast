# CleanCast

Transform messy data into standardized, system-ready formats in minutes.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

## 🚀 Features

- **Universal Data Transformation**: Convert CSV and Excel files to any template format
- **Smart Field Mapping**: Auto-detect and map fields with intelligent suggestions
- **Real-time Validation**: Catch errors before export with comprehensive validation
- **Multiple Templates**: Pre-built templates for banking, HR, logistics, and e-commerce
- **100% Client-Side**: All processing happens in your browser - no uploads, no servers
- **Beautiful UI**: Clean, modern interface built with Tailwind CSS and Radix UI

## 📋 Template Categories

- **Banking**: ACH, Wire Transfer, SWIFT formats
- **HR**: Employee data, payroll, time & attendance
- **Logistics**: Shipment orders, inventory, purchase orders  
- **E-commerce**: Order exports, product catalogs, customer data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **File Parsing**: PapaParse (CSV), SheetJS (Excel)
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yash23796/cleancast.git

# Navigate to project directory
cd cleancast

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚦 Getting Started

1. **Upload Your Data**: Import CSV or Excel files
2. **Select Template**: Choose from pre-built templates or upload custom ones
3. **Map Fields**: Match your columns to template requirements
4. **Validate & Export**: Review validation results and download formatted file

## 📂 Project Structure

```
cleancast/
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── Dashboard.tsx
│   │   ├── UploadStep.tsx
│   │   ├── TemplateStep.tsx
│   │   ├── MappingStep.tsx
│   │   └── ValidationStep.tsx
│   ├── utils/          # Utility functions
│   │   ├── fileParser.ts
│   │   ├── dataValidation.ts
│   │   └── dataTransformation.ts
│   ├── styles/         # Global styles
│   ├── App.tsx         # Main application
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── index.html          # HTML template
```

## 🧪 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

## 🔒 Security & Privacy

- **No external servers**: All processing happens client-side
- **No data storage**: Files are never saved or transmitted
- **No tracking**: Zero analytics or telemetry
- **Open source**: Full transparency of code

See [SECURITY.md](SECURITY.md) for detailed security information.

## 🎨 Customization

### Adding Custom Templates

Edit `src/components/TemplateStep.tsx` to add new template categories:

```typescript
{
  id: 'custom',
  name: 'Custom Category',
  icon: YourIcon,
  description: 'Your description',
  templates: [
    {
      name: 'Your Template',
      requiredFields: ['Field1', 'Field2'],
      optionalFields: ['Field3']
    }
  ]
}
```

### Styling

The project uses Tailwind CSS. Modify `tailwind.config.js` to customize the theme:

```javascript
theme: {
  extend: {
    fontFamily: {
      'brand': ['Inter', 'system-ui', 'sans-serif'],
    },
  },
}
```

## 📝 Validation Rules

CleanCast includes built-in validation for:

- **Email addresses**: RFC-compliant validation
- **Phone numbers**: Format checking
- **Dates**: ISO 8601 format support
- **Numeric fields**: Type and range validation
- **Required fields**: Presence validation
- **Custom patterns**: Configurable regex patterns

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- File parsing by [PapaParse](https://www.papaparse.com/) and [SheetJS](https://sheetjs.com/)

## 📧 Contact

Project Link: [https://github.com/yash23796/cleancast](https://github.com/yash23796/cleancast)

---

Made with ❤️ for better data workflows

