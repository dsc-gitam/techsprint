# 🧪 Photobooth System Testing Checklist

## Pre-Event Testing

### ✅ Firebase Configuration
- [ ] Firebase Storage rules updated (storage-photobooth-rules.txt)
- [ ] Firestore rules updated (firestore-photobooth-rules.txt)
- [ ] Test Firebase console access to `printQueue` collection
- [ ] Test Firebase Storage `photobooth/` folder creation

### ✅ Printer Computer Setup
- [ ] Open `/printer/client` on dedicated computer
- [ ] Verify "Connected" green indicator appears
- [ ] Check Wake Lock permission granted
- [ ] Verify heartbeat timestamp updates every 30 seconds
- [ ] Keep browser tab open and test auto-reconnect (close/reopen page)

### ✅ Pixel Device - Camera Test
- [ ] Open `/photobooth/capture?uid=test123` on Pixel
- [ ] Grant camera permission when prompted
- [ ] Verify back camera activates (not selfie camera)
- [ ] Test "Capture Photo" button works
- [ ] Take 3-5 test photos
- [ ] Verify photos appear in "Captured" section
- [ ] Test "Delete" button on captured photos
- [ ] Click "Continue to Selection"

### ✅ Photo Selection Test
- [ ] Verify redirect to `/photobooth/select?uid=test123`
- [ ] Confirm photos load in grid layout
- [ ] Test photo selection (click to select)
- [ ] Verify green checkmark appears on selected photo
- [ ] Test "Print Selected Photo" button
- [ ] Confirm success screen appears
- [ ] Test "Back to Scanner" button

### ✅ Print Queue Test
- [ ] Open Firebase Firestore console
- [ ] Navigate to `printQueue` collection
- [ ] Verify new document created with:
  - userId: test123
  - status: "pending" → "printing" → "completed"
  - photoUrl: (Firebase Storage URL)
  - userName, teamName, classroom
  - createdAt timestamp

### ✅ Auto-Print Test
- [ ] Monitor printer client during photo selection
- [ ] Verify "Currently Printing..." banner appears
- [ ] Check browser triggers print dialog
- [ ] Verify physical print output (full-page photo, no margins)
- [ ] Confirm print quality is high (4K resolution visible)
- [ ] Check "Recent Prints" section updates
- [ ] Verify stats increment (Total Prints, Successful)

### ✅ Duplicate Prevention Test
- [ ] Create test user in Firestore `registrations` collection
- [ ] Add test user to a team
- [ ] Go to `/staff/scanner` as staff
- [ ] Select "Photobooth" action
- [ ] Scan test user QR code (first time) → Should succeed
- [ ] Complete photo capture and selection
- [ ] Return to scanner
- [ ] Scan SAME user QR code again → Should show "DUPLICATE BLOCKED!"
- [ ] Verify alert mentions previous usage timestamp

### ✅ Check-in Requirement Test
- [ ] Create new test user (not checked in)
- [ ] Try to access photobooth → Should show "must check-in first"
- [ ] Add check-in record to `checkins` collection
- [ ] Try photobooth again → Should succeed

### ✅ Payment Status Test
- [ ] Create test user with payment_status: "pending"
- [ ] Try photobooth → Should show "Payment not confirmed"
- [ ] Update payment_status to "captured"
- [ ] Try photobooth → Should succeed

### ✅ Gallery Test
- [ ] Open `/photobooth/gallery`
- [ ] Verify printed photo appears
- [ ] Test "Filter by Team" dropdown
- [ ] Test "Filter by Classroom" dropdown
- [ ] Click on photo to view full-size modal
- [ ] Test "Close" button on modal
- [ ] Verify real-time updates (print another photo, should auto-appear)

### ✅ Error Handling Tests
- [ ] **Camera failure**: Deny camera permission → Check fallback message
- [ ] **Network loss**: Disconnect WiFi during upload → Check error alert
- [ ] **Invalid user**: Scan non-existent QR code → Check "User not found"
- [ ] **Printer offline**: Turn off printer, try printing → Check retry logic
- [ ] **Browser refresh**: Refresh printer client → Check auto-reconnect

### ✅ Mobile Responsiveness
- [ ] Test `/photobooth/capture` on Pixel (portrait mode)
- [ ] Test `/photobooth/select` on Pixel (portrait mode)
- [ ] Test `/photobooth/gallery` on phone and tablet
- [ ] Verify buttons are large and tappable
- [ ] Check text is readable (no overflow)

---

## Event Day Testing

### 🔍 Morning Setup (30 min before event)
- [ ] Power on printer and verify WiFi connection
- [ ] Open printer client on dedicated computer
- [ ] Confirm green "Connected" indicator
- [ ] Test with one volunteer:
  - [ ] Check-in at scanner
  - [ ] Scan for photobooth
  - [ ] Take photos
  - [ ] Select favorite
  - [ ] Collect physical print
  - [ ] Verify photo in gallery
- [ ] Reset test: Delete test printQueue records if needed

### 📊 During Event Monitoring
Every 30 minutes, check:
- [ ] Printer client still shows "Connected"
- [ ] Stats incrementing correctly (Total Prints vs Successful)
- [ ] No failed prints accumulating
- [ ] Recent prints list updating
- [ ] Gallery page shows latest photos
- [ ] Printer has paper and ink

### 🆘 Emergency Fixes
| Issue | Solution |
|-------|----------|
| Printer disconnected (red indicator) | Refresh printer client page |
| Camera not working | Check Pixel camera permissions in browser settings |
| Photos not uploading | Check Pixel WiFi connection |
| Duplicate errors wrong | Check Firestore `checkins` and `printQueue` for user |
| Print quality low | Verify photo URL in printQueue shows Firebase Storage (not data URL) |
| No photos in gallery | Check Firestore `printQueue` for status: "completed" |

---

## Test Data Cleanup

After testing, clean up:
- [ ] Delete test documents from `printQueue` collection
- [ ] Delete test photos from Firebase Storage `photobooth/` folder
- [ ] Delete test checkins from `checkins` collection
- [ ] Clear Recent Prints on printer client (refresh page)

---

## Production Readiness Checklist

Before going live:
- [ ] All Firebase rules deployed
- [ ] Printer tested with real photo (full workflow)
- [ ] Staff trained on scanner → capture → selection workflow
- [ ] "Back to Scanner" button understood by staff
- [ ] Printer client computer placed near printer
- [ ] Backup: Extra Pixel device charged (in case primary fails)
- [ ] Backup: Admin has Firebase console access for manual overrides
- [ ] Gallery URL shared with participants (for digital copies)
- [ ] Camera permissions pre-granted on Pixel device

---

## Success Metrics

Track these during event:
- **Total Prints**: From printer client stats
- **Success Rate**: Successful / Total Prints (aim for >95%)
- **Failed Prints**: Should be <5 total
- **Average Time**: Scanner to print collection (~2-3 minutes ideal)
- **Gallery Views**: Check Firebase Analytics if enabled

---

## Known Limitations

Document these for team:
- **One print per person**: Cannot override without admin Firebase access
- **No re-selection**: Once printed, cannot choose different photo
- **Camera quality**: Depends on Pixel device specs (4K or 1920x1440 fallback)
- **Print speed**: Limited by WiFi printer (typically 30-60 seconds per photo)
- **Browser dependency**: Printer client requires modern browser (Chrome/Edge)

---

**Last Updated**: Pre-Event Testing Phase
**Next Review**: After first 10 prints on event day
