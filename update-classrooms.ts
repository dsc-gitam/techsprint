import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(require('./serviceAccountKey.json'))
  });
}

const db = getFirestore();

// Classroom configuration
const CLASSROOMS = ['105', '106', '107', '111', '112', '113', '118'];

// Team to classroom mapping from TSV
const TEAM_CLASSROOM_MAP: { [key: string]: string } = {
  'TEAM01': '105', 'TEAM02': '105', 'TEAM03': '105', 'TEAM04': '105',
  'TEAM05': '105', 'TEAM06': '105', 'TEAM07': '105', 'TEAM08': '105',
  'TEAM09': '105', 'TEAM10': '105', 'TEAM11': '105', 'TEAM12': '105',
  'TEAM13': '106', 'TEAM14': '106', 'TEAM15': '106', 'TEAM16': '106',
  'TEAM17': '106', 'TEAM18': '106', 'TEAM19': '106', 'TEAM20': '106',
  'TEAM21': '107', 'TEAM22': '107', 'TEAM23': '107', 'TEAM24': '107',
  'TEAM25': '107', 'TEAM26': '107', 'TEAM27': '107', 'TEAM28': '111',
  'TEAM29': '111', 'TEAM30': '111', 'TEAM31': '111', 'TEAM32': '111',
  'TEAM33': '112', 'TEAM34': '112', 'TEAM35': '112', 'TEAM36': '112',
  'TEAM37': '112', 'TEAM38': '113', 'TEAM39': '113', 'TEAM40': '113',
  'TEAM41': '113', 'TEAM42': '118', 'TEAM43': '118'
};

async function seedClassrooms() {
  console.log('🏫 Seeding classrooms...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const classroom of CLASSROOMS) {
    try {
      await db.collection('classrooms').doc(classroom).set({
        name: `Room ${classroom}`,
        capacity: 50,
        isAvailable: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      
      successCount++;
      console.log(`  ✓ Created classroom ${classroom}`);
    } catch (error) {
      console.error(`  ✗ Error creating classroom ${classroom}:`, error);
      errorCount++;
    }
  }
  
  console.log(`✅ Classrooms complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function updateTeamsWithClassrooms() {
  console.log('📝 Updating teams with allotedClassrooms...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [teamCode, classroom] of Object.entries(TEAM_CLASSROOM_MAP)) {
    try {
      await db.collection('teams').doc(teamCode).update({
        allotedClassrooms: classroom,
        updatedAt: Timestamp.now(),
      });
      
      successCount++;
      console.log(`  ✓ Updated ${teamCode} → Room ${classroom}`);
    } catch (error) {
      console.error(`  ✗ Error updating ${teamCode}:`, error);
      errorCount++;
    }
  }
  
  console.log(`✅ Teams update complete: ${successCount} success, ${errorCount} errors\n`);
  return { successCount, errorCount };
}

async function main() {
  console.log('🚀 Starting classroom setup and team updates...\n');
  console.log('=' .repeat(70));
  
  const startTime = Date.now();
  
  try {
    const classroomStats = await seedClassrooms();
    const teamStats = await updateTeamsWithClassrooms();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('=' .repeat(70));
    console.log('📊 UPDATE SUMMARY');
    console.log('=' .repeat(70));
    console.log(`Classrooms created: ${classroomStats.successCount} success, ${classroomStats.errorCount} errors`);
    console.log(`Teams updated: ${teamStats.successCount} success, ${teamStats.errorCount} errors`);
    console.log(`Duration: ${duration}s`);
    console.log('=' .repeat(70));
    
    if (classroomStats.errorCount === 0 && teamStats.errorCount === 0) {
      console.log('✅ All updates completed successfully!');
    } else {
      console.log('⚠️  Update completed with some errors');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during update:', error);
    process.exit(1);
  }
}

main();
