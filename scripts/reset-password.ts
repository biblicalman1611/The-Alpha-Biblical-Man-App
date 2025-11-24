/**
 * Reset password for a specific user
 */

import { initializeApp, cert } from 'firebase-admin/app';
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

const auth = getAuth();

/**
 * Generate a secure temporary password
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Reset user password
 */
async function resetPassword(email: string) {
  console.log(`\n🔄 Resetting password for: ${email}\n`);

  try {
    // Check if user exists
    const userRecord = await auth.getUserByEmail(email);
    console.log(`✅ User found: ${userRecord.uid}`);
    console.log(`   Display Name: ${userRecord.displayName || 'Not set'}`);
    console.log(`   Email Verified: ${userRecord.emailVerified}`);
    console.log(`   Created: ${userRecord.metadata.creationTime}`);

    // Generate new password
    const newPassword = generateTempPassword();

    // Update password
    await auth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    console.log(`\n✅ Password reset successful!`);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`NEW LOGIN CREDENTIALS`);
    console.log('='.repeat(60));
    console.log(`Email: ${email}`);
    console.log(`Temporary Password: ${newPassword}`);
    console.log('='.repeat(60));
    console.log(`\n⚠️  Please login and change your password immediately.\n`);

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.error(`❌ Error: No user found with email ${email}`);
      console.log(`\nThe user account doesn't exist. Would you like to create it?`);
    } else {
      console.error(`❌ Error resetting password:`, error.message);
    }
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'arevx1611@gmail.com';

resetPassword(email)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
