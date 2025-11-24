/**
 * Create Firestore profile for user
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/Users/thebi/The-Alpha-Biblical-Man-App/.env.migration' });

// Initialize Firebase Admin
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID || 'the-biblical-man',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore();
const auth = getAuth();

async function createProfile(email: string) {
  console.log(`\n🔄 Creating Firestore profile for: ${email}\n`);

  try {
    // Get user from Firebase Auth
    const userRecord = await auth.getUserByEmail(email);
    console.log(`✅ Found user: ${userRecord.uid}`);

    // Check if profile already exists
    const profileDoc = await db.collection('users').doc(userRecord.uid).get();

    if (profileDoc.exists) {
      console.log(`⚠️  Profile already exists! Updating it...`);
    }

    // Create/Update profile
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      name: userRecord.displayName || email.split('@')[0],
      createdAt: profileDoc.exists ? profileDoc.data()?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentDay: 1,
      protocolStartDate: new Date().toISOString(),
      hasCompletedTutorial: false,
      paymentAmount: 3.00,
      paymentType: 'one-time',
    }, { merge: true });

    console.log(`✅ Profile created/updated successfully!`);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`User can now login and access the dashboard!`);
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error(`❌ Error:`, error.message);
  }
}

const email = process.argv[2] || 'arevx1611@gmail.com';

createProfile(email)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
