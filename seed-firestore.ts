import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
if (!getApps().length) {
  // Using service account key for authentication
  initializeApp({
    credential: cert(require('./serviceAccountKey.json'))
  });
}

const db = getFirestore();

interface Registration {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  university: string;
  otherUniversity: string;
  displayPicture: string;
  payment_status: string;
  teamCode: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Team {
  teamCode: string;
  teamName: string;
  leaderId: string;
  memberIds: string;
  problemStatement: string;
  solution: string;
  techStack: string;
  createdAt: string;
}

function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows: any[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
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
      const row: any = {};
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
  
  const registrations = parseCSV(path.join(__dirname, 'registrations.csv')) as Registration[];
  console.log(`Found ${registrations.length} registrations to seed`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const registration of registrations) {
    try {
      const { uid, createdAt, updatedAt, ...data } = registration;
      
      await db.collection('registrations').doc(uid).set({
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      successCount++;
      if (successCount % 50 === 0) {
        console.log(`  ✓ Seeded ${successCount}/${registrations.length} registrations`);
      }
    } catch (error) {
      console.error(`  ✗ Error seeding registration ${registration.uid}:`, error);
      errorCount++;
    }
  }
  
  console.log(`✅ Registrations complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function seedTeams() {
  console.log('👥 Seeding teams...');
  
  const teams = parseCSV(path.join(__dirname, 'teams.csv')) as Team[];
  console.log(`Found ${teams.length} teams to seed`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const team of teams) {
    try {
      const { teamCode, createdAt, memberIds, ...data } = team;
      
      // Parse memberIds JSON array string
      let memberIdsArray: string[] = [];
      try {
        memberIdsArray = JSON.parse(memberIds);
      } catch (e) {
        console.error(`  ⚠ Warning: Could not parse memberIds for ${teamCode}`);
        memberIdsArray = [];
      }
      
      await db.collection('teams').doc(teamCode).set({
        ...data,
        memberIds: memberIdsArray,
        createdAt: Timestamp.now(),
      });
      
      successCount++;
      console.log(`  ✓ Seeded team ${teamCode} (${memberIdsArray.length} members)`);
    } catch (error) {
      console.error(`  ✗ Error seeding team ${team.teamCode}:`, error);
      errorCount++;
    }
  }
  
  console.log(`✅ Teams complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function main() {
  console.log('🚀 Starting Firestore seeding...\n');
  console.log('=' .repeat(70));
  
  const startTime = Date.now();
  
  try {
    const registrationStats = await seedRegistrations();
    const teamStats = await seedTeams();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('=' .repeat(70));
    console.log('📊 SEEDING SUMMARY');
    console.log('=' .repeat(70));
    console.log(`Registrations: ${registrationStats.successCount} seeded, ${registrationStats.errorCount} errors`);
    console.log(`Teams: ${teamStats.successCount} seeded, ${teamStats.errorCount} errors`);
    console.log(`Duration: ${duration}s`);
    console.log('=' .repeat(70));
    
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
