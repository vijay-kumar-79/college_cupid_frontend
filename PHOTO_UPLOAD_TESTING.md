# Photo Upload Feature - Testing Guide

## Prerequisites
1. Backend server running
2. Frontend development server running
3. User authenticated and logged in
4. `./images` directory exists in backend root

## Test Scenarios

### 1. Basic Photo Upload
**Steps:**
1. Navigate to Home page
2. Click "Complete Your Profile" (if not already started)
3. Complete Steps 1-3 (Basic Info, Preferences, Interests)
4. Click "Next" to reach Step 4 (Photos)
5. Click on the upload box (camera icon)
6. Select 1 image file
7. Wait for upload to complete

**Expected Result:**
- Photo appears in grid
- "Main" badge appears on first photo
- Upload count shows "1/6 photos uploaded"
- Submit button becomes enabled

### 2. Multiple Photo Upload
**Steps:**
1. On Step 4, click upload box
2. Select multiple images (2-5 files)
3. Wait for all uploads to complete

**Expected Result:**
- All photos appear in grid
- Only first photo has "Main" badge
- Count updates correctly (e.g., "3/6 photos uploaded")
- Photos display in order uploaded

### 3. Maximum Photos Limit
**Steps:**
1. Upload 6 photos (one at a time or multiple)
2. Try to upload a 7th photo

**Expected Result:**
- Alert: "You can upload a maximum of 6 photos"
- Upload box disappears after 6 photos
- Count shows "6/6 photos uploaded"

### 4. Photo Deletion
**Steps:**
1. Upload 2-3 photos
2. Click the "×" button on any photo
3. Confirm photo is removed

**Expected Result:**
- Photo disappears from grid
- Count decreases (e.g., "2/6" → "1/6")
- Upload box reappears if was at max
- If all photos deleted, submit button disables

### 5. Main Photo Badge
**Steps:**
1. Upload first photo
2. Note "Main" badge
3. Upload second photo
4. Delete first photo

**Expected Result:**
- First photo always has "Main" badge
- After deleting first photo, second photo becomes main
- "Main" badge automatically moves to first photo in array

### 6. Upload Progress Indicator
**Steps:**
1. Select a large image file (>5MB)
2. Observe upload box during upload

**Expected Result:**
- Upload box shows spinner
- Text changes to "Uploading..."
- Upload box is disabled during upload

### 7. Form Validation
**Steps:**
1. Navigate to Step 4 without uploading photos
2. Try to click "Complete Profile" button

**Expected Result:**
- Submit button is disabled (grayed out)
- Cannot submit form

**Then:**
1. Upload at least 1 photo
2. Button becomes enabled

### 8. Network Error Handling
**Steps:**
1. Stop backend server
2. Try to upload a photo

**Expected Result:**
- Alert: "Failed to upload photos. Please try again."
- Photo does not appear in grid
- Upload state returns to normal

### 9. Delete Error Handling
**Steps:**
1. Upload a photo
2. Manually delete the file from backend `/images` folder
3. Try to delete the photo from UI

**Expected Result:**
- Alert or error message
- Photo may or may not be removed from UI (depends on implementation)

### 10. Image Display
**Steps:**
1. Upload various image formats (JPG, PNG, GIF)
2. Upload images with different aspect ratios

**Expected Result:**
- All images display correctly
- Images maintain aspect ratio with object-fit: cover
- Square containers (1:1 ratio)
- No distortion

### 11. Responsive Design
**Steps:**
1. Upload 3-6 photos
2. Resize browser window to mobile width (<480px)
3. Resize to tablet width (480px-768px)

**Expected Result:**
- Grid adjusts: Desktop (3-4 cols) → Tablet (2-3 cols) → Mobile (2 cols)
- Photos remain square
- Upload box scales appropriately

### 12. Navigation Between Steps
**Steps:**
1. Upload 2 photos on Step 4
2. Click "← Back" to Step 3
3. Click "Next →" to return to Step 4

**Expected Result:**
- Uploaded photos persist
- Photos still displayed
- No duplicate uploads

### 13. Complete Profile Submission
**Steps:**
1. Complete all form steps including uploading 2-3 photos
2. Click "Complete Profile" button
3. Check network request payload

**Expected Result:**
- Form data includes `photos` array with imageUrls
- Profile saves successfully
- User redirected or shown success message

## API Endpoints to Verify

### Upload Endpoint
```
POST /api/uploadImage
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- dp: <image_file>

Response:
{
  "success": true,
  "imageUrl": "http://localhost:5000/api/getImage/?photoId=<uuid>"
}
```

### Delete Endpoint
```
DELETE /api/deleteImage/:photoId
Authorization: Bearer <token>

Response:
{
  "message": "Image deleted successfully"
}
```

### Get Image Endpoint
```
GET /api/getImage/?photoId=<uuid>

Response: Image file (binary)
```

## Browser Console Checks

### During Upload
- No console errors
- Network tab shows POST to `/api/uploadImage`
- Response includes `success: true` and `imageUrl`

### During Delete
- No console errors
- Network tab shows DELETE to `/api/deleteImage/:photoId`
- Response shows 200 status

### State Updates
```javascript
// In React DevTools, check formData state:
{
  photos: [
    "http://localhost:5000/api/getImage/?photoId=abc-123",
    "http://localhost:5000/api/getImage/?photoId=def-456"
  ]
}
```

## Backend Verification

### Check File System
```bash
cd backend
ls -la images/
```
Should see:
- `<uuid>.jpg` - Original uploaded files
- `<uuid>-compressed.jpg` - Compressed files

### Check Console Logs
- Upload success messages
- Image compression logs
- No error stack traces

## Edge Cases

1. **Empty file selection**: Cancel file picker → No change
2. **Unsupported format**: Try uploading .txt → May show error or reject
3. **Very large file**: Upload 50MB image → May timeout or compress heavily
4. **Rapid uploads**: Upload multiple files quickly → All should queue properly
5. **Same image twice**: Upload same file twice → Should create separate entries

## Common Issues

### Photos not displaying
- Check CORS settings on backend
- Verify `REACT_APP_BASE_URL` in .env
- Check network tab for 404s on image URLs

### Upload fails
- Verify JWT token in localStorage
- Check backend `/images` directory exists and is writable
- Verify multer middleware is working

### Delete not working
- Check photoId extraction from URL
- Verify file naming: `{photoId}-compressed.jpg`
- Check file permissions in `/images` directory

## Success Criteria
✅ Can upload 1-6 photos  
✅ First photo labeled as "Main"  
✅ Can delete any photo  
✅ Upload progress shown  
✅ Max limit enforced  
✅ Min 1 photo required for submission  
✅ Photos persist during navigation  
✅ Responsive on all screen sizes  
✅ No console errors  
✅ Clean error handling  
