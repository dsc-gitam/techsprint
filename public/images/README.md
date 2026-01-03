# Images Directory

This directory contains images used by the application.

## Required Images

### Payment QR Code (`payment-QR.png`)

**Location**: `public/images/payment-QR.png`

**Purpose**: Displayed in the admin team management interface when creating teams on-spot. Participants scan this QR code to make payments.

**How to Add**:
1. Generate or obtain your payment QR code (UPI, bank transfer, etc.)
2. Save it as `payment-QR.png` in this directory
3. Recommended size: 300x300 pixels or larger
4. Format: PNG with transparent background preferred

**Where It's Used**:
- Admin page: `/admin/teams` 
- Function: Shows QR when admin clicks "Show Payment QR" button
- Admin can then manually confirm payment once received

## Current Files

- `payment-QR.png` - ⚠️ **PLACEHOLDER - Replace with your actual payment QR code**

---

**Note**: If you don't add the actual QR image, the admin payment flow will show a broken image. The app will still function, but payment collection will require manual coordination outside the system.
