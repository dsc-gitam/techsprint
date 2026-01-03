import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(require('./serviceAccountKey.json'))
  });
}

const db = getFirestore();

async function initializeLeaderboardConfig() {
  console.log('🔧 Initializing leaderboard configuration...');
  
  try {
    await db.collection('config').doc('leaderboard').set({
      visible: true, // Set to true to show leaderboard, false to hide
      updatedAt: Timestamp.now(),
    });
    
    console.log('✅ Leaderboard config initialized - currently VISIBLE');
    console.log('\nTo toggle visibility:');
    console.log('  Show: npx tsx toggle-leaderboard.ts show');
    console.log('  Hide: npx tsx toggle-leaderboard.ts hide');
  } catch (error) {
    console.error('❌ Error initializing config:', error);
    process.exit(1);
  }
}

async function toggleLeaderboard(visible: boolean) {
  console.log(`🔄 ${visible ? 'Showing' : 'Hiding'} leaderboard...`);
  
  try {
    await db.collection('config').doc('leaderboard').update({
      visible,
      updatedAt: Timestamp.now(),
    });
    
    console.log(`✅ Leaderboard is now ${visible ? 'VISIBLE' : 'HIDDEN'}`);
  } catch (error) {
    console.error('❌ Error toggling leaderboard:', error);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];
  
  if (!command) {
    await initializeLeaderboardConfig();
  } else if (command === 'show') {
    await toggleLeaderboard(true);
  } else if (command === 'hide') {
    await toggleLeaderboard(false);
  } else {
    console.log('Usage:');
    console.log('  npx tsx toggle-leaderboard.ts          # Initialize config (visible by default)');
    console.log('  npx tsx toggle-leaderboard.ts show     # Show leaderboard');
    console.log('  npx tsx toggle-leaderboard.ts hide     # Hide leaderboard');
    process.exit(1);
  }
  
  process.exit(0);
}

main();
