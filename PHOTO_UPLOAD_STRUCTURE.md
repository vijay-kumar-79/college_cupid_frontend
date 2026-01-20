# Photo Upload Feature - Structure & Layout

## Component Hierarchy

```
Home Component
└── Profile Form (formStep === 4)
    └── Photo Upload Step
        ├── Header
        │   ├── Title: "Upload Photos"
        │   └── Description: "Add 1-6 photos..."
        │
        ├── Photo Upload Container
        │   ├── Photos Grid
        │   │   ├── Photo Item 1 (if uploaded)
        │   │   │   ├── Image
        │   │   │   ├── Main Badge (first only)
        │   │   │   └── Delete Button (×)
        │   │   │
        │   │   ├── Photo Item 2-6 (if uploaded)
        │   │   │   ├── Image
        │   │   │   └── Delete Button (×)
        │   │   │
        │   │   └── Upload Box (if < 6 photos)
        │   │       ├── Hidden File Input
        │   │       └── Upload Label
        │   │           ├── Camera Icon 📷
        │   │           └── "Add Photo" / "Uploading..."
        │   │
        │   └── Help Text: "X/6 photos uploaded..."
        │
        └── Form Actions
            ├── Back Button
            └── Submit Button (disabled if no photos)
```

## Visual Layout

```
┌─────────────────────────────────────────────────┐
│                Upload Photos                    │
│   Add 1-6 photos to your profile. Your first   │
│   photo will be your main profile picture.     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Main   │  │         │  │         │        │
│  │ ┌─────┐ │  │         │  │         │        │
│  │ │ IMG │×│  │  IMG   ×│  │  IMG   ×│        │
│  │ └─────┘ │  │         │  │         │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │         │  │         │  │ ┌─────┐ │        │
│  │  IMG   ×│  │  IMG   ×│  │ │ 📷  │ │        │
│  │         │  │         │  │ │ Add │ │        │
│  └─────────┘  └─────────┘  │ └─────┘ │        │
│                             └─────────┘        │
│                                                 │
│       3/6 photos uploaded. JPG, PNG, or GIF    │
│              Max 10MB per photo.               │
│                                                 │
├─────────────────────────────────────────────────┤
│  ← Back              Complete Profile →        │
└─────────────────────────────────────────────────┘
```

## State Management

### Form Data State
```javascript
formData: {
  name: string,
  email: string,
  gender: string,
  program: string,
  yearOfJoin: number,
  interests: string[],
  sexualOrientation: { type: string, display: boolean },
  relationshipGoals: { goal: string, display: boolean },
  personalityType: string,
  publicKey: string,
  currentInterest: string,
  photos: string[]  // <-- ADDED
}
```

### Upload State
```javascript
uploadingPhoto: boolean  // <-- ADDED
```

## Key Functions

### handlePhotoUpload(e)
```
Input: FileList from input[type="file"]
Process:
  1. Validate file count (max 6 total)
  2. Create FormData for each file
  3. POST to /api/uploadImage
  4. Append returned URLs to formData.photos
  5. Handle errors with alert
Output: Updated formData.photos array
```

### handlePhotoDelete(photoUrl)
```
Input: Photo URL string
Process:
  1. Extract photoId from URL
  2. DELETE to /api/deleteImage/:photoId
  3. Filter out URL from formData.photos
  4. Handle errors with alert
Output: Updated formData.photos array
```

## API Integration Flow

### Upload Flow
```
User selects file(s)
      ↓
handlePhotoUpload triggered
      ↓
Validate count (current + new ≤ 6)
      ↓
setUploadingPhoto(true)
      ↓
For each file:
  Create FormData
  POST /api/uploadImage
  Add imageUrl to array
      ↓
Update formData.photos
      ↓
setUploadingPhoto(false)
```

### Delete Flow
```
User clicks × button
      ↓
handlePhotoDelete(photoUrl)
      ↓
Extract photoId from URL
      ↓
DELETE /api/deleteImage/:photoId
      ↓
Filter photoUrl from formData.photos
      ↓
Update state
```

## CSS Classes

### Container Classes
- `.photo-upload-container` - Main wrapper
- `.photos-grid` - Grid layout for photos
- `.photo-item` - Individual photo wrapper
- `.photo-upload-box` - Upload area

### Element Classes
- `.photo-item img` - Photo image element
- `.main-badge` - "Main" badge overlay
- `.delete-photo-btn` - Delete button
- `.upload-label` - Upload area label
- `.upload-icon` - Camera icon
- `.form-help` - Help text

### State Classes
- `.spinner-small` - Loading spinner
- `:disabled` - Disabled upload state

## Grid Breakpoints

```
Desktop (>768px):
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
  gap: 1rem

Mobile (<480px):
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))
  gap: 0.75rem
```

## File Structure

```
college_cupid_frontend/
├── src/
│   └── pages/
│       ├── Home.js          (Component logic)
│       └── Home.css         (Styles)
│
└── docs/ (optional)
    ├── PHOTO_UPLOAD_IMPLEMENTATION.md
    ├── PHOTO_UPLOAD_TESTING.md
    └── PHOTO_UPLOAD_STRUCTURE.md (this file)
```

## Backend Dependencies

### Router: imageRouter.js
- POST `/uploadImage` - Authenticated
- GET `/getImage` - Public
- DELETE `/deleteImage/:photoId` - Authenticated

### Controller: imageController.js
- uploadImage() - Saves file, returns URL
- getImage() - Serves image file
- deleteImage() - Removes file from disk

### Middleware
- `authenticateToken` - JWT verification
- `multer` - File upload handling
- `compressImage` - Image compression

### Storage
- Location: `backend/images/`
- Format: `{uuid}.jpg` (original)
- Format: `{uuid}-compressed.jpg` (processed)

## Form Step Flow

```
Step 1: Basic Info
  ↓ Next
Step 2: Preferences
  ↓ Next
Step 3: Interests
  ↓ Next
Step 4: Photos ← NEW STEP
  ↓ Complete Profile
Profile Saved
```

## Validation Rules

| Rule | Condition | Error Handling |
|------|-----------|----------------|
| Min photos | >= 1 | Disable submit button |
| Max photos | <= 6 | Alert + prevent upload |
| File type | image/* | Browser validation |
| File size | Handled by backend | Server error response |
| Authentication | Valid JWT | 401 error |

## User Interactions

### Click Upload Box
→ Opens file picker
→ Multiple selection enabled
→ Only image/* files shown

### Select Files
→ setUploadingPhoto(true)
→ Show spinner in upload box
→ Upload each file sequentially
→ Display uploaded photos
→ setUploadingPhoto(false)

### Click Delete (×)
→ Confirm deletion (backend)
→ Remove from formData.photos
→ Re-render grid
→ Show upload box if < 6 photos

### Click Back
→ Navigate to Step 3
→ Preserve uploaded photos

### Click Submit
→ Include photos array in form submission
→ Complete profile creation

## Accessibility Features

- Semantic HTML (button, label, input)
- Alt text on images
- Keyboard navigation support
- Focus states on interactive elements
- Screen reader friendly labels
- Error messages announced
- Loading states indicated

## Performance Considerations

- Image compression (backend)
- Lazy loading potential
- Optimized grid layout
- CSS transforms for animations
- Debounced uploads (sequential)
- Error boundary considerations

## Security

- JWT authentication required
- File type validation (client + server)
- File size limits (backend)
- Unique UUIDs for filenames
- No path traversal in delete
- CORS configuration required

## Future Enhancements

- [ ] Image cropping before upload
- [ ] Drag & drop reordering
- [ ] Drag & drop file upload
- [ ] Image preview modal
- [ ] Batch delete
- [ ] Progress bar for large files
- [ ] Image filters/effects
- [ ] Webcam capture option