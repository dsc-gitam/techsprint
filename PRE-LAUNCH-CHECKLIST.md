# 🚀 Pre-Launch Checklist

## ✅ Code Changes (Completed)
- [x] Schema refactoring complete
- [x] All TypeScript errors fixed
- [x] Admin team management page created
- [x] Profile page updated
- [x] Registration shows "Sold Out"
- [x] Timeline removed from navigation
- [x] Schedule updated to Jan 3-4, 2026
- [x] Venue changed to ICT entrance

## 🔄 Migration (To Do)

### Before Migration
- [ ] **CRITICAL**: Create Firestore backup
  ```bash
  firebase firestore:export gs://your-project-bucket/backups
  ```
- [ ] Install firebase-admin
  ```bash
  npm install firebase-admin
  ```
- [ ] Set up Firebase Admin credentials
  - [ ] Download service account key OR
  - [ ] Set FIREBASE_PROJECT_ID environment variable
- [ ] Review migration script logic
- [ ] Customize admin/staff detection if needed

### During Migration
- [ ] Run migration script
  ```bash
  cd scripts
  node migrate-firestore-data.js
  ```
- [ ] Monitor output for errors
- [ ] Check validation results
- [ ] Note any warnings

### After Migration
- [ ] Zero validation errors?
- [ ] All registrations have `role` field?
- [ ] All teams have `teamCode` as document ID?
- [ ] All `memberIds` populated correctly?

## 🖼️ Assets (To Do)
- [ ] Add payment QR image to `public/images/payment-QR.png`
  - Recommended: 300x300px PNG
  - Used by admin for on-spot payment collection

## 👤 Admin Setup (To Do)
- [ ] Identify admin users
- [ ] Manually set `role: "admin"` in Firebase Console
  - Go to Firestore → registrations → [user-uid] → edit
  - Set role field to "admin" or "staff"
- [ ] Test admin access to `/admin/teams`

## 🧪 Testing (To Do)

### User Flow
- [ ] Visit /profile as regular user
- [ ] Can see team members
- [ ] Can see team info
- [ ] Cannot create/join/leave teams
- [ ] Registration page shows "Sold Out"

### Leader Flow
- [ ] Visit /profile as team leader
- [ ] Can edit problem statement
- [ ] Can edit solution
- [ ] Can edit tech stack
- [ ] Changes save correctly
- [ ] Other members see updates

### Admin Flow
- [ ] Login as admin user
- [ ] Visit /admin
- [ ] Click "Manage Teams"
- [ ] Can see all participants
- [ ] Can create new team
  - [ ] Select team members
  - [ ] Assign leader
  - [ ] Team code auto-generates
- [ ] Can show payment QR
- [ ] Can confirm payment
- [ ] Payment status updates in Firestore

## 📊 Database Verification (To Do)
- [ ] Check Firebase Console
  - [ ] `registrations` collection:
    - [ ] All have `role` field
    - [ ] All have `teamCode` (if in team)
    - [ ] No `teamName` field
    - [ ] No deprecated fields
  - [ ] `teams` collection:
    - [ ] Document IDs match `teamCode`
    - [ ] All have `memberIds` array
    - [ ] All have `leaderId`
    - [ ] All have problem fields (empty OK)
    - [ ] No `participants` field
    - [ ] No `referralCode` field

## 🔧 Configuration (To Do)
- [ ] Update Firebase security rules if needed
- [ ] Check Firebase Auth settings
- [ ] Verify hosting configuration
- [ ] Update environment variables

## 🌐 Deployment (To Do)
- [ ] Build application
  ```bash
  npm run build
  ```
- [ ] Test production build locally
  ```bash
  npm start
  ```
- [ ] Deploy to hosting
  ```bash
  firebase deploy
  ```

## 📱 Post-Deployment Testing
- [ ] Visit live URL
- [ ] Test user registration flow
- [ ] Test profile page
- [ ] Test admin page
- [ ] Check QR code display
- [ ] Verify payment confirmation works
- [ ] Test on mobile devices
- [ ] Check dark mode

## 📝 Documentation (To Do)
- [ ] Document admin credentials
- [ ] Create admin user guide
- [ ] Share team codes with teams
- [ ] Prepare support FAQs

## ⚠️ Rollback Plan
If something goes wrong:
1. Stop application
2. Restore Firestore backup:
   ```bash
   firebase firestore:import gs://your-project-bucket/backups
   ```
3. Revert code changes (git revert)
4. Fix issues
5. Re-run migration

---

## 🎉 Launch Day Checklist
- [ ] All above items completed
- [ ] Team ready for support
- [ ] Monitoring in place
- [ ] Backup procedures documented
- [ ] Admin accounts verified
- [ ] Payment QR confirmed working

---

**Current Status**: ⏳ Ready for Migration  
**Next Action**: Create Firestore backup and run migration script

**Files to Review**:
- [MIGRATION-SUMMARY.md](MIGRATION-SUMMARY.md) - Complete overview
- [scripts/README.md](scripts/README.md) - Migration instructions
- [scripts/migrate-firestore-data.js](scripts/migrate-firestore-data.js) - Migration script
