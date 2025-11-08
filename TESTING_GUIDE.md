# Testing PDF Preview Feature

## ✅ What's Been Implemented

### 1. PDF Preview Component (`PDFViewer.jsx`)

- Uses `react-pdf` library for rendering PDFs
- Shows first 5-10 pages (configurable via `maxPages` prop)
- Displays loading spinner while PDF loads
- Shows error messages if PDF fails to load
- Includes page numbers for each page
- Scrollable preview area
- Responsive design

### 2. Preview Integration

#### NotesList Page

- "Preview" button on each note card
- Opens full-screen modal with PDF preview
- Shows note metadata (subject, faculty, year, section)
- Download button available in modal
- Different behavior for free vs paid notes

#### NoteDetail Page

- Inline PDF preview below note details
- Shows different number of pages for free (10) vs paid (5) notes
- Warning message for paid notes about limited preview

### 3. Backend Setup

- Static file serving configured (`/uploads` route)
- PDF files accessible via `http://localhost:5000/uploads/filename.pdf`
- Download endpoint tracks download count

## 🧪 How to Test

### Step 1: Start Both Servers

**Backend:**

```bash
cd backend
npm start
# Should show: Server running on port 5000
```

**Frontend:**

```bash
cd frontend
npm run dev
# Should show: Local: http://localhost:5173 (or 5174/5175)
```

### Step 2: Register/Login

1. Go to http://localhost:5173 (or the port shown)
2. Click "Register" and create an account
3. Login with your credentials

### Step 3: Upload a Test PDF

1. Click "Upload Notes" in navbar
2. Select a PDF file (any PDF will work for testing)
3. Fill in the form:
   - Subject: "Machine Learning" (or any subject)
   - Year: "3rd Year"
   - Section: "A"
   - Faculty: "Dr. Smith"
   - Free/Paid: Choose "Free" for easy testing
4. Click "Upload Note"

### Step 4: Test Preview in Notes List

1. Click "Browse Notes" in navbar
2. Find your uploaded note
3. Click the "Preview" button (eye icon)
4. You should see:
   - Modal opens with note details in header
   - PDF pages loading (with spinner initially)
   - First 10 pages displayed (if PDF has that many)
   - Page numbers on each page
   - "Close" and "Download Free" buttons at bottom

### Step 5: Test Preview in Note Detail

1. From the notes list, click on the note card (not the preview button)
2. Scroll down to the "Document Preview" section
3. You should see:
   - PDF preview embedded in the page
   - Same functionality as modal
   - Note metadata above the preview

### Step 6: Test Download

1. In preview modal or detail page, click "Download Free"
2. PDF should download to your computer
3. Download counter should increment in database

## 🔍 What to Check

### Visual Elements

- ✅ PDF pages render correctly
- ✅ Page numbers display on each page
- ✅ Loading spinner shows while loading
- ✅ Scrollbar appears if multiple pages
- ✅ Modal closes when clicking X or Close button
- ✅ Violet/purple theme maintained throughout

### Functionality

- ✅ PDF loads from backend
- ✅ Preview shows limited pages (not entire document)
- ✅ Download works for free notes
- ✅ Different page limits for free vs paid notes
- ✅ Error handling if PDF fails to load

### Edge Cases to Test

- Upload very large PDF (20+ pages) - should only show first 10
- Upload very small PDF (1-2 pages) - should show all pages
- Upload corrupted file - should show error message
- Try preview without authentication - should work
- Try download without authentication - depends on your implementation

## 🐛 Troubleshooting

### PDF Not Loading

**Issue:** Preview shows loading spinner forever

**Solutions:**

1. Check backend is running on port 5000
2. Check PDF path is correct: `http://localhost:5000/uploads/filename.pdf`
3. Open browser DevTools (F12) → Network tab → Check if PDF file loads (200 status)
4. Check browser console for CORS errors

### CORS Errors

**Issue:** "Access to fetch... blocked by CORS policy"

**Solution:**
Backend already has CORS enabled in `server.js`. If issues persist:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
```

### PDF Worker Errors

**Issue:** "Setting up fake worker failed"

**Solution:**
Already configured in `PDFViewer.jsx`:

```javascript
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
```

If using offline, download worker file and serve locally.

### Preview Modal Not Closing

**Issue:** Modal stays open

**Solution:**
Check that `setShowPreview(false)` is being called on:

- X button click
- Close button click
- Download button click (optional)

## 📊 Expected Behavior

### Free Note Preview

1. Shows up to 10 pages
2. Download button immediately available
3. No payment required
4. Full document can be downloaded

### Paid Note Preview

1. Shows only 5 pages
2. "Purchase for ₹XX" button shown
3. Yellow warning box about limited preview
4. Download only after payment (payment integration pending)

## 🎯 Next Steps

After confirming PDF preview works:

1. Test with different PDF sizes
2. Test upload with multiple files
3. Test search and filter with uploaded notes
4. Test rating system
5. Prepare for payment integration (Razorpay)

## 📝 Notes

- PDF preview uses CDN worker from unpkg.com (requires internet)
- For production, consider hosting worker file locally
- Large PDFs may take time to load - consider adding timeout
- Mobile responsiveness is built-in via Tailwind CSS

## 🎨 Customization

To change preview page limits:

**In NotesList.jsx:**

```javascript
<PDFViewer
  pdfUrl={`http://localhost:5000${selectedNote.pdfPath}`}
  maxPages={10} // Change this number
/>
```

**In NoteDetail.jsx:**

```javascript
<PDFViewer
  pdfUrl={`http://localhost:5000${note.pdfPath}`}
  maxPages={note.isPaid ? 5 : 10} // Adjust these numbers
/>
```

---

**Status: ✅ IMPLEMENTED AND READY TO TEST**

The PDF preview is now fully functional. Follow the testing steps above to verify everything works correctly!
