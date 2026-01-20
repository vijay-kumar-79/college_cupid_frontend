# Photo Upload Implementation

## Overview
Added a photo upload step (Step 4) to the profile completion form in Home.js. Users can now upload 1-6 photos, with the first photo being designated as their main profile picture.

## Changes Made

### 1. Home.js - State Management
- Added `photos: []` to formData state to store uploaded photo URLs
- Added `uploadingPhoto` state to track upload progress
- Updated form steps from 3 to 4

### 2. Home.js - Functions Added

#### handlePhotoUpload(e)
- Handles multiple file uploads
- Validates max 6 photos limit
- Uses FormData to send files to backend
- Makes POST request to `/api/uploadImage` endpoint
- Stores returned imageUrls in formData.photos array
- Shows loading state during upload

#### handlePhotoDelete(photoUrl)
- Extracts photoId from URL
- Makes DELETE request to `/api/deleteImage/:photoId` endpoint
- Removes deleted photo from formData.photos array
- Handles errors gracefully

### 3. Home.js - UI Components

#### Step 4 Form
- Photos grid layout displaying uploaded photos
- First photo has "Main" badge overlay
- Delete button (×) on each photo
- Upload box with camera icon for adding new photos
- File input accepts image/* formats
- Shows upload progress with spinner
- Displays photo count (X/6 photos uploaded)
- Validation: requires at least 1 photo before submission

#### Form Steps Indicator
- Updated to show 4 steps instead of 3
- Step 4 labeled as "Photos"

### 4. Home.css - Styles Added

#### Photo Upload Container
- `.photo-upload-container` - Main container
- `.photos-grid` - CSS Grid layout (auto-fill, min 150px)
- Responsive: 120px min on mobile

#### Photo Item
- `.photo-item` - Individual photo wrapper
- Square aspect ratio (1:1)
- Rounded corners (12px)
- `.photo-item img` - Cover fit image

#### Badges & Controls
- `.main-badge` - Gradient badge for first photo
- `.delete-photo-btn` - Circular delete button with hover effects

#### Upload Box
- `.photo-upload-box` - Dashed border upload area
- `.upload-label` - Clickable label with icon
- `.upload-icon` - Camera emoji (📷)
- Hover effects with border color change

### 5. API Integration

#### Upload Endpoint
```
POST /api/uploadImage
Headers: Authorization: Bearer <token>
Body: FormData with 'dp' field
Response: { success: true, imageUrl: "..." }
```

#### Delete Endpoint
```
DELETE /api/deleteImage/:photoId
Headers: Authorization: Bearer <token>
Response: { message: "Image deleted successfully" }
```

## Backend Requirements
- imageRouter.js - Handles upload/delete routes
- imageController.js - Contains upload/delete logic
- multer middleware - File upload handling
- compressImage middleware - Image compression
- authenticateToken middleware - JWT authentication

## User Flow
1. User completes Basic Info (Step 1)
2. User completes Preferences (Step 2)
3. User adds Interests (Step 3)
4. User uploads Photos (Step 4) - NEW
5. User submits profile

## Features
- Multiple photo upload
- Photo preview
- Main photo designation
- Photo deletion
- Upload progress indication
- File type validation (image/*)
- Photo count limit (max 6)
- Minimum requirement (at least 1)
- Responsive grid layout
- Error handling

## Validation
- Minimum 1 photo required
- Maximum 6 photos allowed
- Image files only (image/*)
- Form submission disabled until at least 1 photo uploaded

## Mobile Responsive
- Grid adapts to smaller screens
- Touch-friendly delete buttons
- Optimized icon sizes
- Flexible step indicator layout