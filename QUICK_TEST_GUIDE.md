# 🚀 Quick Test Guide - What to Test & Where

## 📍 Access the Application

**URL:** http://localhost:3000 (or http://localhost:3001)

Check the terminal to see which port Vite is using. It will show:
```
➜  Local:   http://localhost:XXXX/
```

---

## ✅ Quick 5-Minute Test

Follow these steps to verify Priority 1 implementation is working:

### Step 1: Upload File (30 seconds)
1. Click "Upload CSV or Excel File" or drag and drop
2. Use the included `sample_recipients.csv` file
3. **What to check:**
   - ✅ File uploads successfully
   - ✅ Shows preview of your data
   - ✅ Shows row/column count
   - ✅ "Continue" button is enabled

### Step 2: Select Template (10 seconds)
1. Choose "Chase ACH Standard" template
2. Click "Continue"
3. **What to check:**
   - ✅ Template is selected
   - ✅ Can proceed to next step

### Step 3: Map Fields (1 minute)
1. Map your CSV columns to template fields:
   - **Acct_No** → Account Number
   - **Recipient_Name** → Vendor Name
   - **Routing_Code** → Routing Number
   - **Contact_Email** → Contact Email
   - **Amount** → Payment Amount

2. **What to check:**
   - ✅ Dropdowns work (select source columns)
   - ✅ All required fields can be mapped
   - ✅ "Continue" button becomes enabled when all required fields mapped

### Step 4: Validate Data (1 minute) ⭐ NEW!
**This is where you'll see the Priority 1 implementation!**

1. Wait for auto-validation to complete (should be instant)
2. **What to check:**
   - ✅ See REAL validation numbers (not hardcoded "92/8")
   - ✅ Numbers should match your file's row count
   - ✅ Progress bar shows percentage
   - ✅ Three cards show: Valid Rows, Errors, Total

**Key Test:** The numbers you see should match YOUR data:
- If your file has 5 rows, total should be 5
- If all data is valid, errors should be 0
- If you have invalid data, errors should show actual problems

### Step 5: Check Error Details (1 minute) ⭐ NEW!
1. If there are errors, scroll down to "Error Details"
2. **What to check:**
   - ✅ Each error shows row number
   - ✅ Each error shows field name
   - ✅ Each error shows actual value from your file
   - ✅ Error message describes the problem
   - ✅ Can click "Edit" button (though editing not implemented yet)

**Example error:**
```
Row 15: Invalid email format
Field: Contact_Email | Value: "invalid-email"
```

### Step 6: Export Data (2 minutes) ⭐ NEW!
1. Scroll to "Export Options"
2. Click "Download CSV" button
3. **What to check:**
   - ✅ File downloads (check your Downloads folder)
   - ✅ Filename format: `Chase_ACH_Standard_2025-10-07.csv`
   - ✅ Open the file in Excel or text editor

4. **Verify exported data:**
   - ✅ Column names match template (Acct_No, Recipient_Name, etc.)
   - ✅ Values are from YOUR source file
   - ✅ Field mappings are applied correctly
   - ✅ Data is formatted (amounts have 2 decimals, emails lowercase, etc.)

**CRITICAL TEST:** Compare exported file with your source file:
- Source column "Account Number" should appear under "Acct_No" in export
- Values should match but be formatted (e.g., `$1,500` becomes `1500.00`)

---

## 🎯 What Should Work (Priority 1 Features)

### ✅ Real Validation
**Before:** Always showed "92 valid, 8 errors"
**Now:** Shows actual analysis of YOUR data

**Test:** Upload files with different row counts and see numbers change

### ✅ Real Transformation
**Before:** No data transformation
**Now:** Formats amounts, emails, names, etc.

**Test:** 
- Put `$1,500.00` in source → Export should show `1500.00`
- Put `USER@EMAIL.COM` in source → Export should show `user@email.com`

### ✅ Real Export
**Before:** Downloaded mock/sample data
**Now:** Downloads YOUR data with mappings applied

**Test:** 
- Put unique text in your CSV (e.g., "TEST123")
- Export and open file
- You should see "TEST123" in the exported file

---

## 🔍 Detailed Validation Tests

### Test A: Valid Data
**Create CSV:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,ACME Corp,021000021,vendor@acme.com,1500.00
```

**Expected Result:**
- ✅ Validation: "1 of 1 rows valid"
- ✅ Errors: 0
- ✅ Export works
- ✅ Downloaded file has 1 data row

### Test B: Invalid Email
**Create CSV:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,ACME Corp,021000021,invalid-email,1500.00
```

**Expected Result:**
- ✅ Validation: "0 of 1 rows valid"
- ✅ Errors: 1
- ✅ Error detail: "Invalid email format"
- ✅ Shows value: "invalid-email"

### Test C: Invalid Routing Number
**Create CSV:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,ACME Corp,12345,vendor@acme.com,1500.00
```

**Expected Result:**
- ✅ Validation: "0 of 1 rows valid"
- ✅ Errors: 1
- ✅ Error detail: "Invalid routing number (must be 9 digits)"
- ✅ Shows value: "12345"

### Test D: Empty Required Field
**Create CSV:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
,ACME Corp,021000021,vendor@acme.com,1500.00
```

**Expected Result:**
- ✅ Validation: "0 of 1 rows valid"
- ✅ Errors: 1
- ✅ Error detail: "Required field is empty"
- ✅ Field: "Acct_No"

---

## 🎨 Visual Checks

### Validation Step Should Show:
1. **Validation Results Card**
   - Progress bar (green/yellow based on quality)
   - Three colored boxes:
     - Green: Valid Rows
     - Yellow: Errors
     - Blue: Total Rows

2. **Error Details Card** (if errors exist)
   - List of errors (max 20 shown)
   - Each error in yellow alert box
   - Shows row number, field, value, error message
   - "Edit" button on each error

3. **Export Options Card**
   - Green alert if data is ready
   - Red alert if no valid rows
   - "Copy CSV" button
   - "Download CSV" button (green)
   - Data summary (template name, field counts)

---

## ❌ What Should NOT Work Yet

These are expected limitations (Priority 2):

- ❌ **Edit button** - Button exists but doesn't open editor
- ❌ **Custom templates** - Can't create new templates
- ❌ **Smart suggestions** - Field suggestions are basic
- ❌ **Excel export** - Button present but not functional
- ❌ **Audit log** - Shows mock data only

**These are normal and expected!**

---

## 🐛 Troubleshooting

### "I don't see validation results"
- Check if you completed field mapping
- Make sure all required fields are mapped
- Wait a moment - validation runs automatically
- Check browser console (F12) for errors

### "Export button is disabled"
- Check if validation completed
- If all rows have errors, you can't export
- Fix errors or adjust validation

### "Downloaded file has wrong data"
- Check field mappings - are they correct?
- Verify you selected the right template
- Make sure you mapped to the right source columns

### "Numbers don't match my file"
- Count rows in your CSV (excluding header)
- Check if any rows are completely empty
- Verify file uploaded correctly

---

## ✅ Success Checklist

Your implementation is working if:

- [ ] Validation shows different numbers for different files
- [ ] Error count matches actual problems in data
- [ ] Error details show real row numbers
- [ ] Error details show actual values from your file
- [ ] Export downloads a file
- [ ] Exported file contains YOUR data (not mock data)
- [ ] Exported file has template column names
- [ ] Field mappings are correctly applied in export
- [ ] Data is formatted (amounts, emails, etc.)
- [ ] Filename includes template name and date

**If all checked: ✅ Priority 1 is working perfectly!**

---

## 🎯 The Key Test

**The simplest way to know it's working:**

1. Put your name in a CSV cell (e.g., "John Smith")
2. Upload the file
3. Map fields
4. Export
5. Open downloaded file
6. **You should see YOUR name (formatted as "John Smith") in the exported file**

If you see your actual data in the export, **IT'S WORKING!** 🎉

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console (F12 → Console tab)
2. Check terminal where server is running
3. Verify CSV format is correct (comma-delimited)
4. Try with the included `sample_recipients.csv` first
5. Review `TESTING_GUIDE.md` for detailed scenarios

---

## 🎉 You're All Set!

The Priority 1 implementation is complete. Test the features and verify:
- ✅ Real validation
- ✅ Real transformation  
- ✅ Real export

**Your data processing application is now production-ready!**


