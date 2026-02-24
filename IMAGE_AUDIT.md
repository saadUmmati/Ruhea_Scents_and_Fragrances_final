# Website Image Audit Report - RUHEA Fragrances

## Issues Found

### 1. Featured Categories Component ❌
**File:** `components/home/featured-categories.tsx`

**Problem:** "Women's Perfumes" category image may contain women  
- Line 14-15: Women's Perfumes section
- Image URL: Unsplash photo (likely contains women)

**Action Needed:** Replace with product-only or men-focused imagery

### 2. Brand Story Component ⚠️
**File:** `components/home/brand-story.tsx`

**Problem:** Generic perfumer image (needs verification)
- Line 12: "Perfumer crafting scents" image
- Image URL: Unsplash photo

**Action Needed:** Replace with culturally appropriate image (male perfumer or product-only)

### 3. Instagram Feed Component ❌
**File:** `components/home/instagram-feed.tsx`

**Problem:** 6 Unsplash images - unknown content
- Lines 9, 14, 19, 24, 29, 34: All Instagram post images
- May contain women/inappropriate imagery

**Action Needed:** Replace all 6 images with verified product photography

### 4. Cultural Showcase Component ✅
**File:** `components/home/cultural-showcase.tsx`

**Status:** FIXED - Jummah Essentials now uses uploaded attar image
**Remaining:** 2 other occasions still use Unsplash (Wedding, Ramadan)

**Action Needed:** Verify Wedding and Ramadan images don't contain women

## Summary

**Total Components Checked:** 9
**

Issues Found:** 3 components with potential problems
**Images Needing Replacement:** ~10-12 images

## Replacement Strategy

1. **Generate/Source appropriate images** without women
2. **Focus on:**
   - Product photography only
   - Male models if people needed
   - Islamic/cultural patterns and designs
   - Natural ingredients and materials

3. **Priority Order:**
   1. Women's Perfumes → Rename to "Floral Fragrances" + product image
   2. Instagram Feed → All 6 images
   3. Brand Story → Perfumer image
   4. Cultural Showcase remaining images
