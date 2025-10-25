# 📁 File Format Guide

## Supported File Types

### ✅ CSV Files (.csv)
- Comma-separated values
- UTF-8 encoding recommended
- First row must contain headers
- Standard format used by Excel, Google Sheets

### ✅ Excel Files (.xlsx, .xls)
- Microsoft Excel format
- Both modern (.xlsx) and legacy (.xls) supported
- First row must contain headers
- Only the first sheet is processed

---

## 📋 Sample File Structure

### Example CSV Format:
```csv
Account Number,Vendor Name,Bank Routing,Email Address,Amount
1234567890,ACME Corp,021000021,payments@acme.com,1500.00
0987654321,Tech Solutions LLC,011401533,billing@techsolutions.com,2750.50
5678901234,Office Supplies Inc,121000248,accounts@officesupplies.com,892.25
```

### Example Excel Format:
| Account Number | Vendor Name | Bank Routing | Email Address | Amount |
|----------------|-------------|--------------|---------------|--------|
| 1234567890 | ACME Corp | 021000021 | payments@acme.com | 1500.00 |
| 0987654321 | Tech Solutions LLC | 011401533 | billing@techsolutions.com | 2750.50 |

---

## ✨ Best Practices

### 1. Headers (First Row)
- ✅ Use clear, descriptive column names
- ✅ Avoid special characters
- ✅ Use underscores or spaces, not both
- ❌ Don't leave header cells empty

### 2. Data Consistency
- ✅ Keep data format consistent in each column
- ✅ Use same date format throughout
- ✅ Use same number format (decimal separator)
- ❌ Don't mix data types in columns

### 3. Common Fields for Recipient Data
- Account Number / Account ID
- Recipient Name / Vendor Name
- Bank Name
- Routing Number / Sort Code
- Email Address
- Amount / Payment Amount
- Currency
- Reference / Invoice Number
- Date

### 4. File Size & Performance
- ✅ Recommended: < 5MB, < 10,000 rows
- ⚠️ Maximum: 10MB, < 50,000 rows
- 💡 Tip: Split large files for better performance

---

## 🔧 Preparing Your File

### From Excel:
1. Open your Excel file
2. Ensure first row has column headers
3. Remove any empty rows at the top
4. Save As → CSV (Comma delimited) or keep as .xlsx

### From Google Sheets:
1. Open your Google Sheet
2. File → Download → CSV or Excel (.xlsx)
3. Ensure first row has column headers

### Data Cleaning Tips:
- Remove duplicate rows
- Fill in empty cells or use consistent placeholders
- Ensure numbers don't have commas (1500 not 1,500)
- Use consistent date format (YYYY-MM-DD recommended)
- Remove special formatting (colors, borders not needed)

---

## ❌ Common Issues & Solutions

### Issue: "No columns found"
**Solution:** Ensure first row contains column headers

### Issue: "File is empty"
**Solution:** Check file has data rows (not just headers)

### Issue: "Invalid file type"
**Solution:** Save as .csv, .xlsx, or .xls format

### Issue: "File size exceeds limit"
**Solution:** Split into smaller files or remove unnecessary columns

### Issue: "Parsing error"
**Solution:** 
- Check for malformed data
- Ensure consistent delimiters
- Remove merged cells (Excel)
- Check for special characters

---

## 📊 Sample Test Files

Create a simple test file with these steps:

### Quick CSV Test File:
```csv
Name,Email,Amount
John Doe,john@example.com,100.00
Jane Smith,jane@example.com,250.50
Bob Johnson,bob@example.com,75.25
```

### Save and Test:
1. Copy the above content
2. Paste into Notepad/TextEdit
3. Save as `test_recipients.csv`
4. Upload to the application
5. Should see: 3 rows, 3 columns

---

## 🎯 Required vs Optional Fields

### When Uploading:
**Required:**
- ✅ At least one header row
- ✅ At least one data row
- ✅ File must be .csv, .xlsx, or .xls

**Optional:**
- Column names (you'll map them later)
- Specific number of columns
- Specific data format (you'll transform it)

### For Bank Export:
**Required fields depend on bank template:**
- Usually: Account Number, Routing Number, Amount
- May require: Recipient Name, Bank Name
- Optional: Email, Reference, Date

---

## 💡 Pro Tips

1. **Test with small file first** - Upload 5-10 rows to test format
2. **Keep original file** - Don't delete your source data
3. **Use UTF-8 encoding** - Avoids special character issues
4. **Avoid formulas in Excel** - Use values only
5. **Remove merged cells** - Excel merged cells cause issues
6. **Check for hidden columns** - Unhide all columns before export
7. **Remove filters** - Clear any Excel filters before export

---

## 🔒 Security Reminders

- ✅ Files are processed locally in your browser
- ✅ Data is never uploaded to servers
- ✅ Data is deleted when you close the tab
- ✅ No data is stored or logged
- ⚠️ Don't share sensitive test files
- ⚠️ Use strong passwords for encrypted files

---

## 📞 Need Help?

If your file isn't parsing correctly:
1. Check this guide's common issues section
2. Try creating a simple test file (see sample above)
3. Verify file format and extension
4. Check browser console for detailed errors


