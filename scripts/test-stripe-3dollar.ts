/**
 * Test to check $3.00 subscriptions only
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '/Users/thebi/The-Alpha-Biblical-Man-App/.env.migration' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

async function testThreeDollarSubscriptions() {
  console.log('🔍 Testing Stripe Connection ($ 3.00 subscriptions only)...\n');

  try {
    console.log('📥 Fetching active subscriptions...');
    let totalCount = 0;
    let threeDollarCount = 0;
    const subscriptions: Array<{ email: string; amount: number; interval: string; created: string }> = [];

    for await (const subscription of stripe.subscriptions.list({
      status: 'active',
      limit: 100,
    })) {
      totalCount++;

      try {
        const customer = await stripe.customers.retrieve(subscription.customer as string);

        if (!customer.deleted && customer.email) {
          // Get the price amount
          const priceId = subscription.items.data[0]?.price?.id;
          const amount = subscription.items.data[0]?.price?.unit_amount || 0;
          const interval = subscription.items.data[0]?.price?.recurring?.interval || 'unknown';

          // Convert cents to dollars
          const dollars = amount / 100;

          // Only include $3.00 subscriptions
          if (dollars === 3.00) {
            threeDollarCount++;
            subscriptions.push({
              email: customer.email,
              amount: dollars,
              interval,
              created: new Date(subscription.created * 1000).toLocaleDateString(),
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching customer ${subscription.customer}:`, error);
      }
    }

    console.log('\n✅ Stripe Connection Successful!\n');
    console.log('='.repeat(60));
    console.log(`📊 Total active subscriptions: ${totalCount}`);
    console.log(`💵 $3.00 subscriptions: ${threeDollarCount}`);
    console.log('='.repeat(60));

    if (subscriptions.length > 0) {
      console.log('\n📋 $3.00 Subscribers to be migrated:');
      subscriptions.forEach((sub, idx) => {
        console.log(`${idx + 1}. ${sub.email} ($${sub.amount}/${sub.interval}, joined: ${sub.created})`);
      });
    } else {
      console.log('\n⚠️  No $3.00 subscriptions found.');
    }

    console.log('\n✅ Ready to migrate $3.00 subscribers!');
    console.log(`\n💡 ${threeDollarCount} users will receive Firebase accounts and welcome emails\n`);
    console.log('Next step: Run `npm run migrate-users` to proceed\n');

  } catch (error: any) {
    console.error('❌ Stripe Connection Failed:', error.message);
    console.error('\nPlease check your STRIPE_SECRET_KEY in .env.migration file\n');
    process.exit(1);
  }
}

testThreeDollarSubscriptions();
