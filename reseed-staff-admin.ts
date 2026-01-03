import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
if (!getApps().length) {
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

async function reseedStaffAndAdmin() {
  console.log('🔄 Re-seeding staff and admin accounts with correct UIDs...');
  
  const staffAdmin = parseCSV(path.join(__dirname, 'staff-admin-correct.csv')) as Registration[];
  console.log(`Found ${staffAdmin.length} staff/admin accounts to re-seed\n`);
  
  let adminCount = 0;
  let staffCount = 0;
  let errorCount = 0;
  
  for (const account of staffAdmin) {
    try {
      const { uid, createdAt, updatedAt, ...data } = account;
      
      await db.collection('registrations').doc(uid).set({
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      if (data.role === 'admin') {
        adminCount++;
        console.log(`  ✓ Admin: ${data.firstName} ${data.lastName} (${data.email})`);
      } else {
        staffCount++;
        console.log(`  ✓ Staff: ${data.firstName} ${data.lastName} (${data.email})`);
      }
    } catch (error) {
      console.error(`  ✗ Error seeding account ${account.uid}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 RE-SEEDING SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Admins: ${adminCount} accounts`);
  console.log(`✅ Staff: ${staffCount} accounts`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(70));
  
  if (errorCount === 0) {
    console.log('✅ All staff and admin accounts re-seeded successfully!');
  } else {
    console.log('⚠️  Re-seeding completed with some errors');
  }
  
  return { adminCount, staffCount, errorCount };
}

async function main() {
  console.log('🚀 Starting staff/admin re-seeding...\n');
  console.log('=' .repeat(70));
  
  const startTime = Date.now();
  
  try {
    await reseedStaffAndAdmin();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`\n⏱️  Duration: ${duration}s`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during re-seeding:', error);
    process.exit(1);
  }
}

main();
