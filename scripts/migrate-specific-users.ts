/**
 * Migrate specific users from the provided email lists
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
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
const db = getFirestore();

// Email lists from the screenshots
const emailList = [
  // Page 1
  'mcnuckols@gmail.com',
  'johndrowe@icloud.com',
  'chris.rollins1331@gmail.com',
  'nicojamessl@gmail.com',
  'mccombssuzie@gmail.com',
  'quotes.and.randoms@gmail.com',
  'mlps3737@gmail.com',
  'paperhagenandy@gmail.com',
  'pchwr08@gmail.com',
  'chum341@outlook.com',
  'ddetsonn79@gmail.com',
  'adbrown.8629@gmail.com',
  'billicolprof@gmail.com',
  'standngap@outlook.com',
  'rodney.resch@aa.com',
  'homeway@scrtc.com',
  'ronbay425@gmail.com',

  // Page 2
  'hollyj16@att.net',
  'jordan_branscombe@hotmail.com',
  'haywirefizzy@icloud.com',
  'eburk65@gmail.com',
  'dwclow420@yahoo.com',
  'jcampbellcis@gmail.com',
  'adrianocampello@rocketmail.com',
  'aloettekelly@homesc.com',
  'gsprag@cox.net',
  'sadnferris@gmail.com',
  'tdierson78@charter.net',
  'skip@dobriin.org',
  'philipharrelson@gmail.com',
  'steve@rumzi.co',
];

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
 * Send migration email using Resend
 */
async function sendMigrationEmail(email: string, name: string, tempPassword: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return { success: false, error: 'No API key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'The Biblical Man <welcome@thebiblicalmantruth.com>',
        to: [email],
        subject: 'Your Biblical Man Account is Ready - Access Information',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Georgia, serif; background-color: #f5f5f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: #1c1917; color: #d4af37; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
              .notice-box { background: #fef3c7; border-left: 4px solid #d4af37; padding: 20px; margin: 20px 0; }
              .content { padding: 40px 30px; color: #292524; line-height: 1.6; }
              .cta-button { display: inline-block; background: #1c1917; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              .credentials-box { background: #fafaf9; border: 2px solid #e7e5e4; border-radius: 6px; padding: 20px; margin: 20px 0; }
              .footer { background: #fafaf9; padding: 20px; text-align: center; font-size: 12px; color: #78716c; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>THE BIBLICAL MAN</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #d4af37;">Your Access is Ready</p>
              </div>

              <div class="content">
                <div class="notice-box">
                  <h3 style="margin-top: 0; color: #78350f;">⚡ Your Member Access is Now Active</h3>
                  <p style="margin-bottom: 0; color: #78350f;">
                    Thank you for your $3 payment. Your full member access is ready.
                  </p>
                </div>

                <h2 style="color: #1c1917; margin-top: 0;">Welcome, ${name}!</h2>

                <p><strong>What's included in your membership:</strong></p>
                <ul>
                  <li><strong>40-Day Protocol Tracker</strong> - Track your daily disciplines</li>
                  <li><strong>Prayer Wall</strong> - Connect with the brotherhood</li>
                  <li><strong>Bible Study Library</strong> - This month: Nehemiah</li>
                  <li><strong>AI Scripture Tool</strong> - Biblical guidance powered by Gemini</li>
                  <li><strong>Voice Tutorial</strong> - Personalized onboarding</li>
                </ul>

                <div class="credentials-box">
                  <h3 style="margin-top: 0;">Your Login Credentials</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                  <p style="font-size: 14px; color: #57534e; margin-bottom: 0;">
                    ⚠️ Please login and change your password immediately for security.
                  </p>
                </div>

                <div style="text-align: center;">
                  <a href="https://thebiblicalmantruth.com" class="cta-button">Login to Your Account</a>
                </div>

                <p style="margin-top: 30px; padding: 20px; background: #fafaf9; border-radius: 6px; font-size: 14px;">
                  <strong>Need Help?</strong> If you have any questions or issues logging in,
                  reply to this email and we'll assist you personally.
                </p>

                <p style="margin-top: 30px; font-style: italic; color: #57534e;">
                  "As iron sharpens iron, so one man sharpens another." - Proverbs 27:17
                </p>
              </div>

              <div class="footer">
                <p>This email was sent because you made a $3.00 payment to The Biblical Man.</p>
                <p>&copy; 2024 The Biblical Man. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Check if user already exists
 */
async function userExists(email: string): Promise<boolean> {
  try {
    await auth.getUserByEmail(email);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create user account
 */
async function createUser(email: string) {
  try {
    // Check if already exists
    const exists = await userExists(email);
    if (exists) {
      console.log(`⏭️  Already exists: ${email}`);
      return { success: false, email, error: 'Already exists' };
    }

    console.log(`🔄 Creating account: ${email}`);

    // Generate temp password
    const tempPassword = generateTempPassword();
    const name = email.split('@')[0];

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password: tempPassword,
      displayName: name,
      emailVerified: true,
    });

    console.log(`✅ Account created: ${userRecord.uid}`);

    // Create Firestore profile
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      createdAt: new Date().toISOString(),
      migratedAt: new Date().toISOString(),
      paymentAmount: 3.00,
      paymentType: 'one-time',
      currentDay: 1,
      protocolStartDate: new Date().toISOString(),
      hasCompletedTutorial: false,
    });

    console.log(`✅ Profile created in Firestore`);

    // Send email
    const emailResult = await sendMigrationEmail(email, name, tempPassword);

    if (!emailResult.success) {
      // Store for manual retry
      await db.collection('migration_emails_pending').add({
        email,
        name,
        tempPassword,
        userId: userRecord.uid,
        error: emailResult.error,
        timestamp: new Date().toISOString(),
      });
      console.warn(`⚠️  Email failed, stored in migration_emails_pending`);
    } else {
      console.log(`✅ Email sent to: ${email}`);
    }

    return { success: true, email, userId: userRecord.uid };
  } catch (error: any) {
    console.error(`❌ Error for ${email}:`, error.message);
    return { success: false, email, error: error.message };
  }
}

/**
 * Main migration
 */
async function migrateUsers() {
  console.log('🚀 Migrating Specific Users\n');
  console.log('='.repeat(60));
  console.log(`📊 Total users to migrate: ${emailList.length}\n`);

  const startTime = Date.now();
  const results = [];

  for (const email of emailList) {
    const result = await createUser(email);
    results.push(result);

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 MIGRATION SUMMARY');
  console.log('='.repeat(60) + '\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const alreadyExisted = failed.filter(r => r.error?.includes('Already exists'));
  const actualFailures = failed.filter(r => !r.error?.includes('Already exists'));

  console.log(`✅ Successfully migrated: ${successful.length}`);
  console.log(`⏭️  Already existed: ${alreadyExisted.length}`);
  console.log(`❌ Failed: ${actualFailures.length}`);
  console.log(`📊 Total processed: ${results.length}`);

  if (actualFailures.length > 0) {
    console.log('\n⚠️  FAILURES:');
    actualFailures.forEach(f => {
      console.log(`   - ${f.email}: ${f.error}`);
    });
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n⏱️  Total time: ${elapsed}s`);
  console.log('\n✅ Migration complete!\n');
}

migrateUsers()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
