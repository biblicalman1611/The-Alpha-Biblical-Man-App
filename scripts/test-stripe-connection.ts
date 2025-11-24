/**
 * Quick test to check Stripe connection and count active subscriptions
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables from .env.migration
dotenv.config({ path: '/Users/thebi/The-Alpha-Biblical-Man-App/.env.migration' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

async function testStripeConnection() {
  console.log('🔍 Testing Stripe Connection...\n');

  try {
    // Fetch active subscriptions
    console.log('📥 Fetching active subscriptions...');
    let count = 0;
    const subscriptions: Array<{ email: string; status: string; created: string }> = [];

    for await (const subscription of stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    })) {
      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);

        if (!customer.deleted && customer.email) {
          count++;
          subscriptions.push({
            email: customer.email,
            status: subscription.status,
            created: new Date(subscription.created * 1000).toLocaleDateString(),
          });
        }
      } catch (error) {
        console.error(`Error fetching customer ${subscription.customer}:`, error);
      }
    }

    console.log('\n✅ Stripe Connection Successful!\n');
    console.log('='.repeat(60));
    console.log(`📊 Found ${count} active subscriptions`);
    console.log('='.repeat(60));

    if (subscriptions.length > 0) {
      console.log('\n📋 Active Subscribers:');
      subscriptions.forEach((sub, idx) => {
        console.log(`${idx + 1}. ${sub.email} (${sub.status}, joined: ${sub.created})`);
      });
    }

    console.log('\n✅ Ready to migrate users!');
    console.log('\nNext step: Run `npm run migrate-users` to create Firebase accounts\n');

  } catch (error: any) {
    console.error('❌ Stripe Connection Failed:', error.message);
    console.error('\nPlease check your STRIPE_SECRET_KEY in .env.migration file\n');
    process.exit(1);
  }
}

testStripeConnection();
