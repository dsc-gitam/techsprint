/**
 * Firestore Migration Script
 * 
 * This script migrates your existing Firestore data to the new schema:
 * - Updates registrations collection to use teamCode instead of teamName
 * - Adds role field to registrations (admin/staff/participant/leader)
 * - Updates teams collection to use teamCode as document ID
 * - Adds memberIds array to teams (replaces participants)
 * 
 * IMPORTANT: 
 * 1. Backup your Firestore data before running this script!
 * 2. Update the Firebase Admin SDK credentials
 * 3. Run with: node scripts/migrate-firestore-data.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// OPTION 1: Use service account key file
// const serviceAccount = require('./path-to-your-service-account-key.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// OPTION 2: Use environment variables (recommended for production)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();

async function migrateRegistrations() {
  console.log('🔄 Migrating registrations collection...');
  
  const registrationsRef = db.collection('registrations');
  const snapshot = await registrationsRef.get();
  
  let updated = 0;
  let errors = 0;
  
  for (const doc of snapshot.docs) {
    try {
      const data = doc.data();
      const updates = {};
      
      // Migrate teamName to teamCode
      if (data.teamName && !data.teamCode) {
        // For now, we'll generate a team code based on team name
        // You might want to match this with actual team codes if they exist
        const teamCode = 'TEAM' + Math.random().toString(36).substring(2, 8).toUpperCase();
        updates.teamCode = teamCode;
        console.log(`  - ${doc.id}: teamName "${data.teamName}" → teamCode "${teamCode}"`);
      }
      
      // Add role field if missing
      if (!data.role) {
        if (data.isTeamLead === 1) {
          updates.role = 'leader';
        } else if (data.email && (data.email.includes('admin') || data.email.includes('staff'))) {
          // Adjust this logic based on how you identify admin/staff
          updates.role = 'staff';
        } else {
          updates.role = 'participant';
        }
        console.log(`  - ${doc.id}: Added role "${updates.role}"`);
      }
      
      // Remove deprecated fields
      const deprecatedFields = [
        'phoneNumber', 'collegeId', 'yearOfStudy', 'branch',
        'github_profile', 'linkedin_profile', 'portfolio',
        'tshirtSize', 'dietaryPreference', 'socialProfile',
        'accommodation', 'isTeamLead', 'isTeamMember', 'teamName'
      ];
      
      for (const field of deprecatedFields) {
        if (data[field] !== undefined) {
          updates[field] = admin.firestore.FieldValue.delete();
        }
      }
      
      // Add timestamps if missing
      if (!data.createdAt) {
        updates.createdAt = admin.firestore.FieldValue.serverTimestamp();
      }
      updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      
      if (Object.keys(updates).length > 0) {
        await registrationsRef.doc(doc.id).update(updates);
        updated++;
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${doc.id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`✅ Registrations migration complete: ${updated} updated, ${errors} errors\n`);
}

async function migrateTeams() {
  console.log('🔄 Migrating teams collection...');
  
  const teamsRef = db.collection('teams');
  const snapshot = await teamsRef.get();
  
  let migrated = 0;
  let errors = 0;
  
  for (const doc of snapshot.docs) {
    try {
      const data = doc.data();
      
      // Generate team code if doesn't exist
      let teamCode = data.teamCode;
      if (!teamCode) {
        teamCode = 'TEAM' + Math.random().toString(36).substring(2, 8).toUpperCase();
      }
      
      // Prepare new document data
      const newData = {
        teamCode,
        teamName: data.teamName,
        leaderId: data.leaderId || data.participants?.[0] || '',
        memberIds: data.memberIds || data.participants || [],
        problemStatement: data.problemStatement || '',
        solution: data.solution || '',
        techStack: data.techStack || '',
        createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      };
      
      // If document ID is not the team code, create new document
      if (doc.id !== teamCode) {
        console.log(`  - Migrating team "${data.teamName}" from ID "${doc.id}" to "${teamCode}"`);
        
        // Create new document with teamCode as ID
        await teamsRef.doc(teamCode).set(newData);
        
        // Update all members to use new teamCode
        const registrationsRef = db.collection('registrations');
        const membersQuery = registrationsRef.where('teamName', '==', data.teamName);
        const membersSnapshot = await membersQuery.get();
        
        for (const memberDoc of membersSnapshot.docs) {
          await registrationsRef.doc(memberDoc.id).update({
            teamCode: teamCode,
            teamName: admin.firestore.FieldValue.delete()
          });
        }
        
        // Delete old document
        await teamsRef.doc(doc.id).delete();
        migrated++;
      } else {
        // Just update existing document
        const updates = {};
        if (!data.memberIds && data.participants) {
          updates.memberIds = data.participants;
        }
        if (!data.problemStatement) updates.problemStatement = '';
        if (!data.solution) updates.solution = '';
        if (!data.techStack) updates.techStack = '';
        
        // Remove deprecated fields
        if (data.participants) {
          updates.participants = admin.firestore.FieldValue.delete();
        }
        if (data.referralCode) {
          updates.referralCode = admin.firestore.FieldValue.delete();
        }
        if (data.teamNumber) {
          updates.teamNumber = admin.firestore.FieldValue.delete();
        }
        
        if (Object.keys(updates).length > 0) {
          await teamsRef.doc(doc.id).update(updates);
          migrated++;
        }
      }
    } catch (error) {
      console.error(`  ❌ Error migrating team ${doc.id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`✅ Teams migration complete: ${migrated} migrated, ${errors} errors\n`);
}

async function validateMigration() {
  console.log('🔍 Validating migration...');
  
  // Check registrations
  const registrationsSnapshot = await db.collection('registrations').get();
  let regIssues = 0;
  
  for (const doc of registrationsSnapshot.docs) {
    const data = doc.data();
    if (!data.role) {
      console.warn(`  ⚠️  Registration ${doc.id} missing role field`);
      regIssues++;
    }
    if (data.teamName) {
      console.warn(`  ⚠️  Registration ${doc.id} still has deprecated teamName field`);
      regIssues++;
    }
  }
  
  // Check teams
  const teamsSnapshot = await db.collection('teams').get();
  let teamIssues = 0;
  
  for (const doc of teamsSnapshot.docs) {
    const data = doc.data();
    if (doc.id !== data.teamCode) {
      console.warn(`  ⚠️  Team document ID "${doc.id}" doesn't match teamCode "${data.teamCode}"`);
      teamIssues++;
    }
    if (!data.memberIds || data.memberIds.length === 0) {
      console.warn(`  ⚠️  Team ${doc.id} has no members`);
      teamIssues++;
    }
  }
  
  if (regIssues === 0 && teamIssues === 0) {
    console.log('✅ Validation passed! No issues found.\n');
  } else {
    console.log(`⚠️  Validation found ${regIssues} registration issues and ${teamIssues} team issues\n`);
  }
}

async function runMigration() {
  try {
    console.log('🚀 Starting Firestore migration...\n');
    console.log('⚠️  WARNING: Make sure you have backed up your Firestore data!\n');
    
    await migrateRegistrations();
    await migrateTeams();
    await validateMigration();
    
    console.log('🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the migration logs above');
    console.log('2. Test your application thoroughly');
    console.log('3. If issues occur, restore from backup');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
