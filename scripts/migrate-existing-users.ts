/**
 * User Migration Script
 *
 * This script migrates existing Stripe customers who have paid but don't have
 * Firebase accounts yet. It processes them in batches and sends welcome emails.
 *
 * Usage:
 *   ts-node scripts/migrate-existing-users.ts
 */

import Stripe from 'stripe';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

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

interface MigrationResult {
  success: boolean;
  email: string;
  userId?: string;
  error?: string;
}

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
 * Send migration welcome email using Resend
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
        subject: 'Your Biblical Man Access is Now Ready - Important Account Information',
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
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #d4af37;">We've Been Expecting You</p>
              </div>

              <div class="content">
                <div class="notice-box">
                  <h3 style="margin-top: 0; color: #78350f;">⚡ Important: Your Account is Now Active</h3>
                  <p style="margin-bottom: 0; color: #78350f;">
                    We recently upgraded our member system. Your existing subscription has been migrated,
                    and your full access is ready.
                  </p>
                </div>

                <h2 style="color: #1c1917; margin-top: 0;">Welcome Back, ${name}!</h2>

                <p>
                  Thank you for your patience during our system upgrade. We've successfully migrated your
                  account and you now have full access to all member features.
                </p>

                <p><strong>What's New:</strong></p>
                <ul>
                  <li><strong>Enhanced Member Dashboard</strong> - Streamlined experience</li>
                  <li><strong>40-Day Protocol Tracker</strong> - Track your daily disciplines</li>
                  <li><strong>Prayer Wall</strong> - Connect with the brotherhood</li>
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
                <p>This email was sent because you have an active subscription to The Biblical Man.</p>
                <p>Your subscription continues uninterrupted with this upgrade.</p>
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
    console.log(`✅ Migration email sent to: ${email}`);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending migration email:', error);
    return { success: false, error };
  }
}

/**
 * Check if user already exists in Firebase
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
 * Create user account from Stripe subscription
 */
async function migrateUser(
  customer: Stripe.Customer,
  subscription: Stripe.Subscription
): Promise<MigrationResult> {
  const email = customer.email;
  const name = customer.name || email?.split('@')[0] || 'Brother';

  if (!email) {
    return { success: false, email: 'unknown', error: 'No email found' };
  }

  try {
    // Check if user already exists
    const exists = await userExists(email);
    if (exists) {
      console.log(`⏭️  User already exists: ${email}`);
      return { success: false, email, error: 'User already exists' };
    }

    console.log(`🔄 Migrating user: ${email}`);

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password: tempPassword,
      displayName: name,
      emailVerified: true, // They verified via payment
    });

    console.log(`✅ Firebase user created: ${userRecord.uid}`);

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      customerId: customer.id,
      createdAt: customer.created ? new Date(customer.created * 1000).toISOString() : new Date().toISOString(),
      migratedAt: new Date().toISOString(),
      plan: subscription.items.data[0]?.price?.id || 'unknown',
      currentDay: 1,
      protocolStartDate: new Date().toISOString(),
      hasCompletedTutorial: false,
    });

    console.log(`✅ User profile created in Firestore`);

    // Send migration email with credentials
    const emailResult = await sendMigrationEmail(email, name, tempPassword);

    if (!emailResult.success) {
      // Store credentials for manual recovery
      await db.collection('migration_emails_pending').add({
        email,
        name,
        tempPassword,
        userId: userRecord.uid,
        error: emailResult.error,
        timestamp: new Date().toISOString(),
      });

      console.warn(`⚠️  Email failed for ${email}, stored in migration_emails_pending`);
    }

    return { success: true, email, userId: userRecord.uid };
  } catch (error: any) {
    console.error(`❌ Error migrating ${email}:`, error.message);
    return { success: false, email, error: error.message };
  }
}

/**
 * Fetch all active Stripe subscriptions
 */
async function fetchActiveSubscriptions(): Promise<Array<{ customer: Stripe.Customer; subscription: Stripe.Subscription }>> {
  console.log('📥 Fetching active subscriptions from Stripe...\n');

  const subscriptions: Array<{ customer: Stripe.Customer; subscription: Stripe.Subscription }> = [];

  for await (const subscription of stripe.subscriptions.list({
    status: 'active',
    limit: 100,
  })) {
    try {
      const customer = await stripe.customers.retrieve(subscription.customer as string);

      if (customer.deleted) {
        continue;
      }

      subscriptions.push({ customer, subscription });
    } catch (error) {
      console.error(`Error fetching customer ${subscription.customer}:`, error);
    }
  }

  console.log(`📊 Found ${subscriptions.length} active subscriptions\n`);
  return subscriptions;
}

/**
 * Main migration function
 */
async function migrateExistingUsers() {
  console.log('🚀 Starting User Migration Process\n');
  console.log('=' .repeat(60) + '\n');

  const startTime = Date.now();
  const results: MigrationResult[] = [];

  try {
    // Fetch active subscriptions
    const subscriptions = await fetchActiveSubscriptions();

    // Process each subscription
    for (const { customer, subscription } of subscriptions) {
      const result = await migrateUser(customer, subscription);
      results.push(result);

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📈 MIGRATION SUMMARY');
    console.log('='.repeat(60) + '\n');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const alreadyExisted = failed.filter(r => r.error?.includes('already exists'));
    const actualFailures = failed.filter(r => !r.error?.includes('already exists'));

    console.log(`✅ Successfully migrated: ${successful.length}`);
    console.log(`⏭️  Already existed: ${alreadyExisted.length}`);
    console.log(`❌ Failed: ${actualFailures.length}`);
    console.log(`📊 Total processed: ${results.length}`);

    if (actualFailures.length > 0) {
      console.log('\n⚠️  FAILED MIGRATIONS:');
      actualFailures.forEach(f => {
        console.log(`   - ${f.email}: ${f.error}`);
      });
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n⏱️  Total time: ${elapsed}s`);
    console.log('\n✅ Migration complete!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateExistingUsers()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { migrateExistingUsers };
