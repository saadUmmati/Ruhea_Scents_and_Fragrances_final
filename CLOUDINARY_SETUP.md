# Cloudinary Setup Guide for RUHEA Admin Panel

## Issue (FIXED ✅)
Image uploads in the admin panel's ProductForm were not working because:
1. Cloudinary environment variables were missing
2. **The `cloudName` prop was missing from `CldUploadWidget` components** (now fixed)

## What Was Fixed
- ✅ Added `cloudName` prop to both upload widgets (featured image & gallery)
- ✅ Added Cloudinary environment variables to `.env.example`

## Required Environment Variables

The ProductForm uses `next-cloudinary` for image uploads and requires these environment variables:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

## Setup Steps

### 1. Create a Free Cloudinary Account
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Cloud Name
1. Log in to your Cloudinary dashboard
2. Find your **Cloud Name** on the dashboard (top left)
3. Copy the Cloud Name

### 3. Create an Upload Preset
1. In Cloudinary dashboard, go to **Settings** (gear icon) → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `ruhea_preset` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** (important for client-side uploads)
   - **Folder**: Optionally set to `ruhea-products` to organize uploads
   - **Allowed formats**: jpg, png, webp, gif
5. Click **Save**

### 4. Add to Your Environment File
1. Copy `.env.example` to `.env.local` (if you haven't already)
2. Add your Cloudinary credentials:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ruhea_preset
```

**Example:**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhxyz1234
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ruhea_preset
```

### 5. Restart the Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Verification

1. Go to `http://localhost:3000/admin/products/new`
2. Click on the **Media** tab
3. Click **Upload Featured** or **Upload Gallery Images**
4. The Cloudinary upload widget should open
5. Select an image to upload
6. The image should upload and display in the form

## Troubleshooting

### Upload Widget Doesn't Open
- **Check browser console** for errors
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Make sure you restarted the dev server after adding env variables

### "Upload preset not found" Error
- Verify the preset exists in Cloudinary dashboard
- Ensure `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` matches the preset name
- Make sure the preset is set to **Unsigned** mode

### Images Upload But Don't Display
- Check that the Cloudinary account is active
- Verify the uploaded images are visible in your Cloudinary Media Library
- Check browser network tab for CORS errors

## Alternative: Use Direct Image URLs

If you don't want to set up Cloudinary right now, you can:
1. Upload images to any image hosting service (Imgur, Unsplash, etc.)
2. Copy the direct image URL
3. In the ProductForm, manually paste URLs into the `featured_image` or `images` fields

## Notes

- **Free tier limits**: Cloudinary free tier includes 25GB storage and 25GB monthly bandwidth
- **Image transformations**: Cloudinary automatically optimizes images for web
- **Security**: Unsigned presets are safe for client uploads when properly configured
- All uploaded images will be stored in your Cloudinary account

## Current ProductForm Code Reference

The upload widget is implemented in:
- File: `/components/admin/products/ProductForm.tsx`
- Lines: 424-443 (Featured Image), 484-503 (Gallery Images)
