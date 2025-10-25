# 🧪 Testing Guide - Priority 1 Implementation

## 🎯 What To Test

Now that Priority 1 is complete, you can test the **REAL** validation, transformation, and export functionality.

---

## 🚀 Quick Start Testing

### Step 1: Access the Application
```
URL: http://localhost:3001
Status: Server is running ✅
```

### Step 2: Use the Sample File
A sample file is included: `sample_recipients.csv`

Or create your own CSV with these columns:
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,ACME Corp,021000021,vendor@acme.com,1500.00
9876543210,Tech Solutions,011401533,billing@tech.com,2750.50
5551234567,ABC Company,026009593,payments@abc.com,500.00
```

---

## 📝 Test Scenarios

### Test 1: Happy Path (All Valid Data)
**Purpose:** Verify everything works with clean data

**Steps:**
1. Upload `sample_recipients.csv`
2. Select template: "Chase ACH Standard"
3. Map fields:
   - Acct_No → Account Number
   - Recipient_Name → Vendor Name
   - Routing_Code → Routing Number
   - Contact_Email → Contact Email
   - Amount → Payment Amount
4. Continue to Validation step

**Expected Result:**
- ✅ Validation shows high percentage (90%+) valid
- ✅ Few or no errors
- ✅ Export button is enabled
- ✅ Downloaded file contains YOUR data
- ✅ Field names match template (Acct_No, Recipient_Name, etc.)
- ✅ Values match source file

---

### Test 2: Validation with Errors
**Purpose:** Verify error detection works

**Create test file with errors:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,ACME Corp,021000021,vendor@acme.com,1500.00
,Empty Account,021000021,billing@tech.com,2750.50
5551234567,ABC Company,12345,invalid-email,500.00
9998887777,XYZ Corp,026009593,good@email.com,-100.00
1112223333,Test Vendor,123456789,test@example.com,
```

**Upload and map fields**

**Expected Result:**
- ✅ Validation shows errors detected
- ✅ Error details show:
  - Row 2: "Required field is empty" for Account Number
  - Row 3: "Invalid routing number (must be 9 digits)" for Routing Number
  - Row 3: "Invalid email format" for Contact Email
  - Row 4: "Invalid amount" for negative amount
  - Row 5: Empty amount detected
- ✅ Each error shows row number, field, and actual value
- ✅ Valid row count is accurate
- ✅ Can click "Edit" button on each error

---

### Test 3: Data Transformation
**Purpose:** Verify formatting is applied

**Create test file with messy formatting:**
```csv
Account Number,Vendor Name,Routing Number,Contact Email,Payment Amount
1234567890,john doe,021000021,USER@EXAMPLE.COM,"$1,500.00"
9876543210,ACME CORPORATION,011401533,BILLING@TECH.COM,"$2,750.50"
```

**Upload, map, and export**

**Open downloaded CSV and verify:**
- ✅ Amount: `1500.00` (no $ or comma, 2 decimals)
- ✅ Amount: `2750.50` (no $ or comma, 2 decimals)
- ✅ Email: `user@example.com` (lowercase)
- ✅ Email: `billing@tech.com` (lowercase)
- ✅ Name: `John Doe` (title case)
- ✅ Name: `Acme Corporation` (title case)
- ✅ Routing: `021000021` (9 digits preserved)

---

### Test 4: Field Mapping Application
**Purpose:** Verify mappings are correctly applied

**Source CSV columns:**
```
Col1, Col2, Col3, Col4, Col5
```

**Template requires:**
```
Acct_No, Recipient_Name, Routing_Code, Contact_Email, Amount
```

**Map:**
- Acct_No → Col3
- Recipient_Name → Col2
- Routing_Code → Col5
- Contact_Email → Col1
- Amount → Col4

**Expected Result:**
- ✅ Exported CSV has template column names (Acct_No, etc.)
- ✅ Values are from mapped source columns
- ✅ Order matches template, not source
- ✅ Example: If Col3 had "12345", Acct_No in export shows "12345"

---

### Test 5: Required vs Optional Fields
**Purpose:** Verify required field validation

**Template: "Chase ACH Standard"**
- Required: Acct_No, Recipient_Name, Routing_Code, Amount
- Optional: Contact_Email, Reference, Memo

**Create test file:**
```csv
Account,Name,Routing,Email,Amount,Ref,Note
123,ACME,021000021,test@email.com,1500,,
456,Tech,,good@email.com,2750,REF123,
```

**Expected Result:**
- ✅ Row 1: Valid (all required fields present)
- ✅ Row 2: Error - Missing Routing_Code (required field empty)
- ✅ Empty optional fields (Ref, Note) don't cause errors
- ✅ Can still export row 1

---

### Test 6: Routing Number ABA Validation
**Purpose:** Verify sophisticated validation

**Create test file with routing numbers:**
```csv
Account,Name,Routing,Email,Amount
123,Test1,021000021,test@email.com,100.00
456,Test2,123456789,test@email.com,200.00
789,Test3,12345,test@email.com,300.00
```

**Expected Result:**
- ✅ Row 1: Valid (021000021 passes ABA checksum)
- ✅ Row 2: Error - Invalid routing number (fails ABA checksum)
- ✅ Row 3: Error - Invalid routing number (too short)
- ✅ Error message: "Invalid routing number (must be 9 digits)"

---

### Test 7: Email Validation
**Purpose:** Verify email format checking

**Create test file:**
```csv
Account,Name,Routing,Email,Amount
123,Test1,021000021,good@email.com,100.00
456,Test2,021000021,invalid-email,200.00
789,Test3,021000021,test@,300.00
111,Test4,021000021,@example.com,400.00
```

**Expected Result:**
- ✅ Row 1: Valid email
- ✅ Row 2: Error - "Invalid email format" (no @)
- ✅ Row 3: Error - "Invalid email format" (incomplete)
- ✅ Row 4: Error - "Invalid email format" (no user part)

---

### Test 8: Export Filename
**Purpose:** Verify filename generation

**Steps:**
1. Complete workflow with "Chase ACH Standard" template
2. Export file
3. Check downloaded filename

**Expected Result:**
- ✅ Filename format: `Chase_ACH_Standard_2025-10-07.csv`
- ✅ Template name with underscores (no spaces)
- ✅ Today's date appended
- ✅ .csv extension

---

### Test 9: Copy to Clipboard
**Purpose:** Verify clipboard functionality

**Steps:**
1. Complete validation
2. Click "Copy CSV" button
3. Open text editor
4. Paste (Ctrl/Cmd+V)

**Expected Result:**
- ✅ Button shows "Copied!" briefly
- ✅ Toast notification appears
- ✅ Pasted content is valid CSV
- ✅ Contains transformed data (not source data)
- ✅ Header row present
- ✅ Data rows present

---

### Test 10: Re-validation
**Purpose:** Verify re-validate works

**Steps:**
1. Complete initial validation
2. Note the results (e.g., "92 valid, 8 errors")
3. Click "Re-validate" button
4. Wait for completion

**Expected Result:**
- ✅ Button shows "Validating..." with spinning icon
- ✅ Results refresh
- ✅ Same results as before (data hasn't changed)
- ✅ Toast notification: "Validation complete: X of Y rows valid"

---

### Test 11: Large File Performance
**Purpose:** Test with realistic data volume

**Create test file with 500-1000 rows**

**Expected Result:**
- ✅ Upload completes (may take 1-2 seconds)
- ✅ Validation completes (may take 1-2 seconds)
- ✅ Export completes (may take 1-2 seconds)
- ✅ No browser freezing
- ✅ Accurate validation (all rows checked)
- ✅ Downloaded file has all rows

---

### Test 12: Edge Cases

#### Empty File
```csv
Account,Name,Routing,Email,Amount
```
**Expected:** Error on upload "File is empty"

#### Single Row
```csv
Account,Name,Routing,Email,Amount
123,Test,021000021,test@email.com,100.00
```
**Expected:** 
- ✅ Validation: "1 of 1 rows valid"
- ✅ Export works
- ✅ Downloaded file has 1 data row

#### Special Characters in Data
```csv
Account,Name,Routing,Email,Amount
123,"Company, Inc.",021000021,test@email.com,100.00
456,"Quote""Test",021000021,test@email.com,200.00
```
**Expected:**
- ✅ CSV properly escapes commas
- ✅ CSV properly escapes quotes
- ✅ Downloaded file is valid CSV
- ✅ Opens correctly in Excel

#### Unicode Characters
```csv
Account,Name,Routing,Email,Amount
123,Café René,021000021,test@email.com,100.00
456,北京公司,021000021,test@email.com,200.00
```
**Expected:**
- ✅ Characters preserved in export
- ✅ UTF-8 encoding maintained
- ✅ Opens correctly in Excel

---

## 🎯 What Should NOT Work (Expected Limitations)

### Known Limitations (Priority 2/3):
- ❌ **Template Creation:** Can't create custom templates (hardcoded list)
- ❌ **Smart Suggestions:** Field suggestions are basic pattern matching
- ❌ **Data Editing:** Edit button exists but doesn't work
- ❌ **Audit Log:** Shows mock data only
- ❌ **Excel Export:** Button present but not functional

These are expected and documented as Priority 2 items.

---

## ✅ Success Criteria

### Your implementation is working if:
1. ✅ Validation shows REAL numbers matching your file
2. ✅ Errors are REAL errors from your data
3. ✅ Export downloads YOUR data (not mock data)
4. ✅ Field mappings are APPLIED in export
5. ✅ Data is FORMATTED (amounts, emails, names)
6. ✅ CSV is PROPERLY ESCAPED
7. ✅ Routing numbers are VALIDATED (ABA checksum)
8. ✅ Emails are VALIDATED (format check)
9. ✅ Required fields are CHECKED
10. ✅ Error details are SPECIFIC and ACCURATE

---

## 🐛 Troubleshooting

### Issue: Validation shows 0 valid rows
**Possible causes:**
- Field mapping incomplete
- Required fields not mapped
- Check if any required fields are mapped

### Issue: Export downloads empty file
**Possible causes:**
- All rows have errors
- Check validation results
- Review error details

### Issue: Downloaded file has wrong data
**Check:**
- Field mappings (are they correct?)
- Template selection (did you choose the right one?)
- Source file (is it the file you uploaded?)

### Issue: Validation takes too long
**Expected behavior:**
- Files < 100 rows: < 1 second
- Files 100-1000 rows: 1-3 seconds
- Files > 1000 rows: 3-5 seconds

If slower, check browser console for errors.

---

## 📊 Validation Reference

### Email Validation Rules:
- Must contain `@`
- Must have domain with `.`
- Format: `user@domain.com`

### Routing Number Rules:
- Exactly 9 digits
- Passes ABA checksum algorithm
- Format: `021000021`

### Account Number Rules:
- Between 4 and 17 digits
- Only numeric characters

### Amount Rules:
- Must be a positive number
- Can have decimals
- No letters or invalid characters
- Format: `1500.00`

### Phone Number Rules:
- 10 digits (US) or 11 digits (with country code)
- Format: `5551234567`

### ZIP Code Rules:
- 5 digits: `12345`
- Or 9 digits: `12345-6789`

---

## 🎉 Testing Checklist

Use this to verify Priority 1 is complete:

- [ ] Upload works with my data
- [ ] Validation shows real numbers
- [ ] Errors are detected correctly
- [ ] Error details show row/field/value
- [ ] Email validation works
- [ ] Routing number validation works
- [ ] Required field check works
- [ ] Export downloads my data
- [ ] Field mappings are applied
- [ ] Data is formatted (amounts, emails, names)
- [ ] CSV is properly escaped
- [ ] Filename includes template name and date
- [ ] Copy to clipboard works
- [ ] Re-validate button works
- [ ] Large files work (500+ rows)

**If all boxes are checked: ✅ Priority 1 is working!**

---

## 📞 What To Do If Something Doesn't Work

1. **Check browser console** (F12) for errors
2. **Check terminal** where dev server is running
3. **Verify file format** - CSV should be comma-delimited
4. **Check field mappings** - all required fields mapped?
5. **Try sample file** - does `sample_recipients.csv` work?

If issues persist, the validation and transformation code is in:
- `src/utils/dataValidation.ts`
- `src/utils/dataTransformation.ts`
- `src/components/ValidationStep.tsx`


