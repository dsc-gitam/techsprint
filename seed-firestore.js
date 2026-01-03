// Run this with: npm run seed
// Make sure you're signed in to Firebase in your browser first

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Load Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }
  
  return rows;
}

async function seedRegistrations() {
  console.log('📝 Seeding registrations...');
  
  const registrations = parseCSV(path.join(__dirname, 'registrations.csv'));
  console.log(`Found ${registrations.length} registrations to seed`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const registration of registrations) {
    try {
      const { uid, createdAt, updatedAt, ...data } = registration;
      
      await setDoc(doc(db, 'registrations', uid), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`  ✓ Seeded ${successCount}/${registrations.length} registrations`);
      }
    } catch (error) {
      console.error(`  ✗ Error seeding registration ${registration.uid}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Registrations complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function seedTeams() {
  console.log('👥 Seeding teams...');
  
  const teams = parseCSV(path.join(__dirname, 'teams.csv'));
  console.log(`Found ${teams.length} teams to seed`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const team of teams) {
    try {
      const { teamCode, createdAt, memberIds, ...data } = team;
      
      // Parse memberIds JSON array string
      let memberIdsArray = [];
      try {
        memberIdsArray = JSON.parse(memberIds);
      } catch (e) {
        console.error(`  ⚠ Warning: Could not parse memberIds for ${teamCode}`);
        memberIdsArray = [];
      }
      
      await setDoc(doc(db, 'teams', teamCode), {
        ...data,
        memberIds: memberIdsArray,
        createdAt: serverTimestamp(),
      });
      
      successCount++;
      console.log(`  ✓ Seeded team ${teamCode} (${memberIdsArray.length} members)`);
    } catch (error) {
      console.error(`  ✗ Error seeding team ${team.teamCode}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`✅ Teams complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function main() {
  console.log('🚀 Starting Firestore seeding...\n');
  console.log('='.repeat(70));
  
  const startTime = Date.now();
  
  try {
    const registrationStats = await seedRegistrations();
    const teamStats = await seedTeams();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('='.repeat(70));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(70));
    console.log(`Registrations: ${registrationStats.successCount} seeded, ${registrationStats.errorCount} errors`);
    console.log(`Teams: ${teamStats.successCount} seeded, ${teamStats.errorCount} errors`);
    console.log(`Duration: ${duration}s`);
    console.log('='.repeat(70));
    
    if (registrationStats.errorCount === 0 && teamStats.errorCount === 0) {
      console.log('✅ All data seeded successfully!');
    } else {
      console.log('⚠️  Seeding completed with some errors');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

main();
