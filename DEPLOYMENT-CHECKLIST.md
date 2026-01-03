# 🚀 Photobooth Deployment Checklist

## ✅ Pre-Deployment (Do These First)

### 1. Firebase Configuration
- [ ] Copy rules from `firestore-photobooth-rules.txt` to Firebase Console → Firestore Rules
- [ ] Copy rules from `storage-photobooth-rules.txt` to Firebase Console → Storage Rules
- [ ] Click **Publish** on both rule sets
- [ ] Verify rules are live (check Firebase Console timestamp)

### 2. Code Deployment
- [ ] Run `npm run build` to build production bundle
- [ ] Run `npm run dev` or deploy to hosting (Vercel/Firebase Hosting)
- [ ] Verify all routes accessible:
  - `/staff/scanner` ✓
  - `/photobooth/capture` ✓
  - `/photobooth/select` ✓
  - `/printer/client` ✓
  - `/photobooth/gallery` ✓

### 3. Hardware Setup

#### Printer Computer (Dedicated)
- [ ] Computer connected to WiFi (same network as printer)
- [ ] WiFi printer powered on and connected
- [ ] Test print from computer (verify printer works)
- [ ] Open browser (Chrome or Edge recommended)
- [ ] Navigate to: `https://your-app-url/printer/client`
- [ ] Allow Wake Lock permission when prompted
- [ ] Verify green "Connected" indicator appears
- [ ] **Do not close this tab or browser**
- [ ] Position computer near printer for monitoring

#### Pixel Device (Staff Scanner)
- [ ] Fully charged (or connected to power)
- [ ] WiFi connected
- [ ] Camera tested (open default camera app)
- [ ] Browser: Navigate to `/staff/scanner`
- [ ] Test QR scanner works (scan any test QR)
- [ ] Grant camera permission for photobooth

---

## 🧪 Testing Phase (30 Minutes Before Event)

### Create Test User
- [ ] Add test user to Firestore `registrations`:
  ```
  {
    uid: "test123",
    firstName: "Test",
    lastName: "User",
    teamCode: "TEAM01",
    payment_status: "captured",
    role: "participant"
  }
  ```
- [ ] Add test team to Firestore `teams`:
  ```
  {
    teamCode: "TEAM01",
    teamName: "Test Team",
    allottedClassroom: "Room 101"
  }
  ```
- [ ] Generate QR code for test user (or use UID directly)

### Full Workflow Test
1. [ ] **Check-in**: Add check-in record to `checkins` for test user
2. [ ] **Scan**: At `/staff/scanner`, select "Photobooth", scan test QR
3. [ ] **Capture**: Take 3-5 photos, click "Continue"
4. [ ] **Select**: Choose favorite photo, click "Print"
5. [ ] **Print**: Monitor printer client - should auto-print
6. [ ] **Collect**: Pick up physical print from printer
7. [ ] **Gallery**: Check `/photobooth/gallery` - photo should appear

### Verify Each Step
- [ ] Scanner validates: check-in ✓, payment ✓, no duplicates ✓
- [ ] Camera uses back camera (not selfie) ✓
- [ ] Photos upload to Firebase Storage `photobooth/test123/` ✓
- [ ] Selection shows all uploaded photos ✓
- [ ] Print queue document created in Firestore ✓
- [ ] Printer client shows "Currently Printing..." ✓
- [ ] Physical print outputs (full-page, high quality) ✓
- [ ] Print queue status updates: pending → printing → completed ✓
- [ ] Gallery displays completed print ✓
- [ ] Stats on printer client increment ✓

### Duplicate Prevention Test
- [ ] Scan same test user again
- [ ] Should show: "⚠️ DUPLICATE BLOCKED! Already printed!"
- [ ] Alert should show timestamp of previous print
- [ ] Verify no second print queue entry created

---

## 🗑️ Cleanup Test Data
- [ ] Delete test documents from `printQueue` collection
- [ ] Delete test photos from Storage `photobooth/test123/`
- [ ] Delete test check-in from `checkins` collection
- [ ] Refresh printer client page (clears recent prints display)
- [ ] Leave test user/team in place (or delete if not needed)

---

## 🎓 Staff Training (15 Minutes)

### Demo to Staff
- [ ] Show full workflow on test user
- [ ] Explain each screen transition
- [ ] Demonstrate duplicate blocking
- [ ] Show "Back to Scanner" button importance
- [ ] Explain 2-3 minute expected time per participant

### Hand Out Materials
- [ ] Print copies of `STAFF-PHOTOBOOTH-QUICKREF.md`
- [ ] Show where to find help (tech support location)
- [ ] Explain what to do if printer fails

### Common Questions
- [ ] **"What if they already printed?"** → Blocked automatically, one per person
- [ ] **"Can they print multiple photos?"** → No, one photo per person
- [ ] **"What if photo doesn't print?"** → Printer retries 3 times, then check printer
- [ ] **"How do they get digital copy?"** → Gallery page (public)
- [ ] **"What if camera doesn't work?"** → Check permissions, restart browser

---

## 📊 Event Day Monitoring

### Morning (Before Doors Open)
- [ ] Power on printer computer
- [ ] Open printer client (verify green connection)
- [ ] Test printer (print test page)
- [ ] Charge Pixel device to 100%
- [ ] Staff devices logged in to admin/staff accounts
- [ ] Quick staff refresher on workflow

### During Event (Check Every 30 Min)
- [ ] Printer client still connected (green indicator)
- [ ] Printer has paper
- [ ] Printer has ink/toner
- [ ] Stats look normal (failures < 5%)
- [ ] Recent prints list updating
- [ ] Gallery showing latest photos
- [ ] No long queue at printer station

### Troubleshooting Contacts
- [ ] Tech support location: ________________
- [ ] Admin Firebase access: ________________
- [ ] Printer vendor support: ________________
- [ ] Backup device location: ________________

---

## 🚨 Emergency Procedures

### Printer Client Disconnects
1. Check green indicator → red = disconnected
2. Refresh browser page
3. Wait 5 seconds for reconnection
4. Verify green indicator returns
5. If still red: Check WiFi, restart browser

### Camera Not Working
1. Check browser permissions (Settings → Camera)
2. Test with default camera app (verify hardware)
3. Clear browser cache
4. Restart browser
5. If still failing: Use backup device

### Printer Jammed
1. Printer client will retry 3 times
2. Check printer display for jam error
3. Clear jam per printer manual
4. Print queue will auto-retry
5. If multiple failures: Note user details, print later

### Duplicate Error (False Positive)
1. User claims never printed before
2. Check Firestore `printQueue` collection
3. Search for userId
4. If genuinely false: Admin delete record
5. User can retry immediately

### Photos Not Uploading
1. Check Pixel WiFi connection
2. Check Firebase Storage console
3. Verify `photobooth/{userId}/` folder exists
4. Check browser console for errors (F12)
5. Try recapture if persistent

---

## 📈 Success Metrics

Track throughout event:
- [ ] **Total participants**: _____ (from check-in)
- [ ] **Total photos printed**: _____ (printer client stats)
- [ ] **Success rate**: _____ % (successful / total)
- [ ] **Average time per person**: _____ minutes
- [ ] **Failed prints**: _____ (should be < 5)
- [ ] **Duplicate blocks**: _____ (system working correctly)
- [ ] **Gallery views**: _____ (if analytics enabled)

---

## 🎯 Post-Event (After Event Ends)

### Immediate
- [ ] Keep printer client open for 30 min (catch late submissions)
- [ ] Verify all pending prints completed
- [ ] Check Firestore for any "printing" status (stuck jobs)
- [ ] Update any stuck jobs to "failed" manually

### Data Collection
- [ ] Export `printQueue` collection (backup)
- [ ] Download all photos from Storage `photobooth/` (backup)
- [ ] Screenshot printer client stats
- [ ] Note any recurring issues

### Cleanup (Optional)
- [ ] Keep photos for X days (announce to participants)
- [ ] After retention period: Delete Storage `photobooth/` folder
- [ ] Archive `printQueue` collection (don't delete immediately)
- [ ] Clear browser cache on printer computer

### Debrief
- [ ] What worked well?
- [ ] What issues occurred?
- [ ] How many people used photobooth?
- [ ] Any feature requests?
- [ ] Would we use this system again?

---

## 📋 Final Pre-Launch Checklist

**5 Minutes Before Opening Doors:**
- [ ] Printer on ✓
- [ ] Printer client connected (green) ✓
- [ ] Pixel device charged ✓
- [ ] Scanner page loaded ✓
- [ ] Staff briefed ✓
- [ ] Test user deleted ✓
- [ ] Firebase rules live ✓
- [ ] Tech support ready ✓

**GO LIVE!** 🚀

---

## 📞 Support Contacts

**Tech Support**: ___________________________
**Firebase Admin**: ___________________________
**Staff Lead**: ___________________________
**Printer Vendor**: ___________________________

---

## 🎉 Backup Plan

If system fails completely:
1. Announce photobooth temporarily unavailable
2. Collect participant emails/QR codes
3. Take photos with separate camera
4. Email digital copies post-event
5. Apologize with swag/discount code

---

**Deployment Date**: _______________
**Event Date**: _______________
**Deployed By**: _______________
**Status**: ☐ Ready ☐ Testing ☐ Live ☐ Complete

---

**Good luck! You've got this! 🚀📸**
