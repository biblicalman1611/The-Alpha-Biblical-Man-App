/**
 * Stripe Webhook Handler for The Biblical Man App
 *
 * This Cloud Function handles Stripe payment events and creates user accounts
 * when subscriptions are successfully created.
 *
 * Deploy this to Google Cloud Functions or add to your existing server
 */

import Stripe from 'stripe';
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Initialize Firebase Admin (only if not already initialized)
if (!initializeApp.length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

/**
 * Send welcome email to new user using Resend API
 */
async function sendWelcomeEmail(email: string, name: string, tempPassword: string) {
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
        subject: 'Welcome to The Biblical Man - Your Access is Ready',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Georgia, serif; background-color: #f5f5f4; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: #1c1917; color: #d4af37; padding: 40px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
              .content { padding: 40px 30px; color: #292524; line-height: 1.6; }
              .cta-button { display: inline-block; background: #1c1917; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              .credentials-box { background: #fafaf9; border: 2px solid #e7e5e4; border-radius: 6px; padding: 20px; margin: 20px 0; }
              .credentials-box strong { color: #1c1917; }
              .footer { background: #fafaf9; padding: 20px; text-align: center; font-size: 12px; color: #78716c; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>THE BIBLICAL MAN</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #d4af37;">Your Brotherhood Awaits</p>
              </div>

              <div class="content">
                <h2 style="color: #1c1917; margin-top: 0;">Welcome, ${name}!</h2>

                <p>Your payment has been successfully processed, and your access to The Biblical Man member area is now active.</p>

                <p><strong>Here's what's waiting for you:</strong></p>
                <ul>
                  <li><strong>40-Day Protocol</strong> - Daily disciplines to build your foundation</li>
                  <li><strong>Prayer Wall</strong> - Connect with brothers in faith</li>
                  <li><strong>Bible Study Library</strong> - This month: Nehemiah</li>
                  <li><strong>Scripture Tool</strong> - AI-powered biblical guidance</li>
                  <li><strong>Voice Tutorial</strong> - Personalized onboarding experience</li>
                </ul>

                <div class="credentials-box">
                  <h3 style="margin-top: 0;">Your Login Credentials</h3>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                  <p style="font-size: 14px; color: #57534e; margin-bottom: 0;">
                    ⚠️ You will be prompted to change your password on first login for security.
                  </p>
                </div>

                <div style="text-align: center;">
                  <a href="https://thebiblicalmantruth.com" class="cta-button">Access Member Area Now</a>
                </div>

                <p style="margin-top: 30px; font-style: italic; color: #57534e;">
                  "As iron sharpens iron, so one man sharpens another." - Proverbs 27:17
                </p>
              </div>

              <div class="footer">
                <p>This email was sent because you successfully subscribed to The Biblical Man.</p>
                <p>If you did not make this purchase, please contact support immediately.</p>
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
    console.log('Welcome email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
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
 * Create user account in Firebase from Stripe subscription
 */
async function createUserFromSubscription(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string);

    if (customer.deleted) {
      throw new Error('Customer was deleted');
    }

    const email = customer.email;
    const name = customer.name || email?.split('@')[0] || 'Brother';

    if (!email) {
      throw new Error('No email found for customer');
    }

    console.log(`Creating user for: ${email}`);

    // Generate temporary password
    const tempPassword = generateTempPassword();

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password: tempPassword,
      displayName: name,
      emailVerified: true, // They verified via payment
    });

    console.log(`Firebase user created: ${userRecord.uid}`);

    // Create user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      customerId: customer.id,
      createdAt: new Date().toISOString(),
      plan: subscription.items.data[0]?.price?.id || 'unknown',
      currentDay: 1,
      protocolStartDate: new Date().toISOString(),
      hasCompletedTutorial: false,
    });

    console.log(`User profile created in Firestore: ${userRecord.uid}`);

    // Send welcome email with credentials
    const emailResult = await sendWelcomeEmail(email, name, tempPassword);

    if (!emailResult.success) {
      // Log the user creation even if email fails
      await db.collection('failed_emails').add({
        email,
        name,
        tempPassword,
        userId: userRecord.uid,
        error: emailResult.error,
        timestamp: new Date().toISOString(),
      });

      console.error(`Email failed for ${email}, stored in failed_emails collection`);
    }

    return { success: true, userId: userRecord.uid, email };
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Log to failed_users collection
    await db.collection('failed_users').add({
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      error: error.message,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

/**
 * Handle subscription.created event
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  // Only create user for active subscriptions
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await createUserFromSubscription(subscription);
  } else {
    console.log(`Skipping user creation for subscription with status: ${subscription.status}`);
  }
}

/**
 * Handle subscription updates (renewal, cancellation, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  // Find user by subscriptionId
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('subscriptionId', '==', subscription.id).limit(1).get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: subscription.status,
      updatedAt: new Date().toISOString(),
    });

    console.log(`Updated subscription status for user: ${userDoc.id}`);
  } else {
    console.log(`No user found for subscription: ${subscription.id}`);
  }
}

/**
 * Handle subscription.deleted event (cancellation)
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('subscriptionId', '==', subscription.id).limit(1).get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });

    console.log(`Marked subscription as cancelled for user: ${userDoc.id}`);
  }
}

/**
 * Main webhook handler
 */
export async function handleStripeWebhook(req: any, res: any) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: StripeWebhookEvent;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    ) as StripeWebhookEvent;
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
}

// For Google Cloud Functions
export const stripeWebhook = handleStripeWebhook;
