# Firestore Migration Script

This directory contains the migration script to update your Firestore database schema for Tech Sprint 3.0.

## What This Script Does

The `migrate-firestore-data.js` script performs the following operations:

### 1. **Registrations Collection**
- Adds `role` field to all registrations (admin/staff/participant/leader)
  - Sets `role: "leader"` for users with `isTeamLead === 1`
  - Sets `role: "participant"` for regular users
  - Sets `role: "staff"` for admin/staff emails (customize detection logic)
- Migrates `teamName` → `teamCode`
- Removes deprecated fields:
  - phoneNumber
  - collegeId
  - yearOfStudy
  - branch
  - github_profile
  - linkedin_profile
  - portfolio
  - tshirtSize
  - dietaryPreference
  - socialProfile
  - accommodation
  - isTeamLead
  - isTeamMember

### 2. **Teams Collection**
- Creates `teamCode` field (auto-generates if missing)
- Migrates document IDs to use `teamCode` instead of random IDs
- Renames `participants` array to `memberIds`
- Adds empty fields: `problemStatement`, `solution`, `techStack`
- Removes deprecated fields:
  - referralCode
  - teamNumber
  - participants
- Updates all team member registrations to reference new `teamCode`

### 3. **Validation**
- Checks all registrations have `role` field
- Verifies no deprecated `teamName` fields remain
- Confirms team document IDs match `teamCode` values
- Ensures all teams have at least one member

## Prerequisites

Before running the migration:

1. **Backup Your Data**
   ```bash
   # Export Firestore data using Firebase CLI
   firebase firestore:export gs://your-project-bucket/backups
   ```

2. **Install Dependencies**
   ```bash
   npm install firebase-admin
   ```

3. **Set Up Firebase Admin Credentials**

   **Option A: Service Account Key (Development)**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the JSON file to `scripts/serviceAccountKey.json`
   - Update line 19 in `migrate-firestore-data.js`:
     ```javascript
     const serviceAccount = require('./serviceAccountKey.json');
     admin.initializeApp({
       credential: admin.credential.cert(serviceAccount)
     });
     ```

   **Option B: Application Default Credentials (Production)**
   - Set environment variable:
     ```bash
     # Windows
     set FIREBASE_PROJECT_ID=your-project-id
     
     # Linux/Mac
     export FIREBASE_PROJECT_ID=your-project-id
     ```
   - Authenticate with:
     ```bash
     gcloud auth application-default login
     ```

## How to Run

1. **Review the Script**
   - Open `migrate-firestore-data.js`
   - Check the `migrateRegistrations()` function
   - Customize the role detection logic (lines 41-47) if needed

2. **Run the Migration**
   ```bash
   cd scripts
   node migrate-firestore-data.js
   ```

3. **Monitor Output**
   - The script will log each operation
   - Review warnings and errors
   - Check validation results

4. **Expected Output**
   ```
   🚀 Starting Firestore migration...

   🔄 Migrating registrations collection...
     - user123: teamName "Team A" → teamCode "TEAMABC123"
     - user123: Added role "participant"
   ✅ Registrations migration complete: 50 updated, 0 errors

   🔄 Migrating teams collection...
     - Migrating team "Team A" from ID "abc123" to "TEAMABC123"
   ✅ Teams migration complete: 10 migrated, 0 errors

   🔍 Validating migration...
   ✅ Validation passed! No issues found.

   🎉 Migration completed successfully!
   ```

## After Migration

1. **Test Your Application**
   - Test user registration flow
   - Test team viewing and management
   - Test admin team creation
   - Verify problem statement editing (leader role)

2. **Admin Role Assignment**
   - Manually update specific users to have `role: "admin"` or `role: "staff"`
   - In Firebase Console, edit the registration document
   - Or create a separate script to batch update admin roles

3. **Update Team Codes**
   - If you want custom team codes instead of random ones
   - Manually edit team documents in Firebase Console
   - Or create a follow-up script to assign sequential codes (TEAM00001, TEAM00002, etc.)

## Rollback

If something goes wrong:

1. **Stop the Application**
   ```bash
   # Stop your dev server
   ```

2. **Restore from Backup**
   ```bash
   firebase firestore:import gs://your-project-bucket/backups
   ```

3. **Fix Issues**
   - Review migration logs
   - Update script logic
   - Re-run migration

## Troubleshooting

### Error: "Cannot find module 'firebase-admin'"
```bash
npm install firebase-admin
```

### Error: "Could not load default credentials"
- Make sure you've set up Firebase Admin credentials (see Prerequisites)
- Check environment variable `FIREBASE_PROJECT_ID` is set

### Warning: "Registration X missing role field"
- Script failed to assign role
- Check the role assignment logic in `migrateRegistrations()`
- Manually fix in Firebase Console

### Warning: "Team document ID doesn't match teamCode"
- Migration created new document but didn't delete old one
- Manually delete the old document in Firebase Console

## Manual Steps

After running the migration, you may want to:

1. **Add Payment QR Image**
   - Place your payment QR code image at:
     ```
     public/images/payment-QR.png
     ```
   - This is used by admin when creating teams

2. **Assign Admin Roles**
   ```javascript
   // Quick script to assign admin role
   const admin = require('firebase-admin');
   const db = admin.firestore();
   
   async function makeAdmin(email) {
     const snapshot = await db.collection('registrations')
       .where('email', '==', email)
       .get();
     
     if (snapshot.empty) {
       console.log('User not found');
       return;
     }
     
     await snapshot.docs[0].ref.update({ role: 'admin' });
     console.log('Admin role assigned');
   }
   
   makeAdmin('admin@example.com');
   ```

## Schema Reference

### Before Migration
```javascript
// registrations
{
  email: "user@example.com",
  firstName: "John",
  teamName: "Team Alpha",
  isTeamLead: 1,
  phoneNumber: "1234567890",
  // ... other deprecated fields
}

// teams
{
  teamName: "Team Alpha",
  participants: ["uid1", "uid2"],
  referralCode: "ABC123",
  // ... other fields
}
```

### After Migration
```javascript
// registrations
{
  email: "user@example.com",
  firstName: "John",
  teamCode: "TEAMABC123",
  role: "leader", // or "participant", "admin", "staff"
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// teams (document ID = teamCode)
{
  teamCode: "TEAMABC123",
  teamName: "Team Alpha",
  leaderId: "uid1",
  memberIds: ["uid1", "uid2"],
  problemStatement: "",
  solution: "",
  techStack: "",
  createdAt: Timestamp
}
```

## Support

If you encounter issues:
1. Check the migration logs carefully
2. Review the validation output
3. Check Firebase Console for data integrity
4. Restore from backup if needed

---

**Important**: Always backup your data before running migrations!
