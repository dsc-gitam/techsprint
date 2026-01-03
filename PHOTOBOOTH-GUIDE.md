# 📸 Photobooth System Setup & Usage Guide

## System Overview
The photobooth system uses a **single Pixel device** for staff operations and client selection, plus a **dedicated computer** that runs the always-on printer client.

---

## 🔧 Setup Instructions

### 1. Printer Computer Setup (One-time)

**Requirements:**
- A computer connected to WiFi
- Access to WiFi printer on same network
- Modern web browser (Chrome/Edge recommended)

**Steps:**
1. Open browser and navigate to: `https://your-app-url/printer/client`
2. **Keep this page open 24/7** during the event
3. If prompted, allow "Wake Lock" permission to keep screen active
4. Verify "Connected" status (green indicator) appears
5. Leave computer running - it will auto-print when photos are selected

**What it does:**
- Monitors Firebase for new print jobs in real-time
- Auto-prints photos when participants select them
- Retries up to 3 times if print fails
- Shows stats: Total Prints, Successful, Failed

---

### 2. Pixel Device Setup (Staff Scanner)

The main scanner at `/staff/scanner` already includes photobooth access. Staff select "Photobooth" action before scanning QR codes.

---

## 📱 Workflow

### For Staff (using Pixel device):

1. **At Scanner Page (`/staff/scanner`)**
   - Select "📸 Photobooth" action
   - Scan participant's QR code
   - System checks:
     - ✅ User must be checked in first
     - ✅ Payment must be confirmed
     - ✅ No duplicate prints allowed (one per person)

2. **Take Photos (`/photobooth/capture`)**
   - Camera automatically opens (back camera, high quality)
   - Take multiple photos of the participant
   - Click "Continue to Selection" when done
   - Photos upload to Firebase Storage

3. **Participant Selects Photo (`/photobooth/select`)**
   - Hand device to participant
   - Participant sees their photos in a grid
   - Participant taps their favorite photo
   - Participant clicks "Print Selected Photo"
   - Success screen appears
   - Staff takes device back, clicks "Back to Scanner"

### For Printer (automatic - no staff needed):

The printer computer auto-prints as soon as participant selects a photo. No confirmation needed!

---

## 🎨 Features

### Photo Specifications
- **Resolution:** 4000x3000 (4K) with fallback to 1920x1440
- **Quality:** 95% JPEG (print-quality)
- **Camera:** Back-facing (environment mode)
- **Print Size:** Full-page, no margins (for custom frames)

### Security & Rules
- **One print per person** - Triple validation (scanner, selection, print queue)
- **Must check-in first** - Photobooth requires prior check-in
- **Payment required** - Only paid participants can use photobooth
- **Duplicate detection** - System blocks multiple prints automatically

### Auto-Recovery
- **Printer client** reconnects automatically if connection drops
- **Retry logic** - 3 attempts if print fails
- **Wake Lock** - Keeps printer computer awake
- **Heartbeat** - 30-second monitoring to confirm connection

---

## 🖼️ Digital Gallery

Public gallery available at: `/photobooth/gallery`

**Features:**
- Shows all completed prints
- Filter by Team or Classroom
- Click photo to view full-size
- Real-time updates (new photos appear automatically)

---

## 🔍 Troubleshooting

### Camera Not Working
- **Check permissions**: Browser needs camera access
- **Pixel device only**: Use back-facing camera
- If fails: System falls back to lower resolution automatically

### Printer Not Printing
- **Check connection**: Green "Connected" indicator on printer client
- **Check WiFi printer**: Ensure printer is on and connected
- **System retries**: Waits 3 seconds between attempts (max 3 times)
- **Manual retry**: Refresh printer client page if needed

### "Already Printed" Error
- **By design**: One print per person rule
- **Check printQueue**: Use Firestore console to verify status
- **Override**: Admin can manually delete printQueue record if needed

### Photos Not Uploading
- **Check Firebase Storage**: Verify storage rules allow staff writes
- **Check connection**: Ensure device has internet
- **Path structure**: Photos stored at `photobooth/{userId}/{timestamp}_{index}.jpg`

---

## 📊 Firestore Collections

### `printQueue` Collection
```
{
  userId: string,
  userName: string,
  teamName: string,
  teamCode: string,
  classroom: string,
  photoUrl: string,
  status: "pending" | "printing" | "completed" | "failed",
  createdAt: timestamp,
  printedAt: timestamp | null,
  printerName: string | null
}
```

### `checkins` Collection (photobooth records)
```
{
  userId: string,
  teamCode: string,
  type: "photobooth",
  timestamp: timestamp,
  scannedBy: string,
  location: "Tech Sprint 2026"
}
```

---

## 🔐 Firebase Security Rules

### Firestore Rules (`firestore.rules`)
```
match /printQueue/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && 
    (get(/databases/$(database)/documents/registrations/$(request.auth.uid)).data.role in ["staff", "admin"]);
  allow update: if request.auth != null;
}
```

### Storage Rules (`storage.rules`)
```
match /photobooth/{userId}/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
    (get(/databases/$(database)/documents/registrations/$(request.auth.uid)).data.role in ["staff", "admin"]);
}
```

---

## 💡 Tips for Success

1. **Test before event**: Run through full workflow with test user
2. **Keep printer client open**: Don't close the tab on printer computer
3. **Monitor stats**: Printer client shows success/failure count
4. **Multiple photos**: Take 3-5 photos so participant has choices
5. **Hand device carefully**: Make sure participant doesn't navigate away during selection
6. **Quick handoff**: Success screen has "Back to Scanner" for fast return to staff

---

## 🎯 Quick Reference

| Page | URL | Purpose |
|------|-----|---------|
| Scanner | `/staff/scanner` | Staff scans QR, selects photobooth |
| Capture | `/photobooth/capture?uid={userId}` | Staff takes photos |
| Selection | `/photobooth/select?uid={userId}` | Participant selects favorite |
| Printer | `/printer/client` | Always-on auto-print station |
| Gallery | `/photobooth/gallery` | Public display of all prints |

---

## 📞 Support Checklist

Before asking for help, verify:
- [ ] Printer client shows "Connected" (green)
- [ ] Camera permissions granted on Pixel
- [ ] User has checked in first
- [ ] User payment is "captured"
- [ ] User hasn't printed before
- [ ] Printer is on and connected to WiFi
- [ ] Browser console shows no errors (F12)

---

**Built for Tech Sprint 3.0 Hackathon**
