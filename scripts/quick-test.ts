/**
 * Fast test - just count subscriptions by price
 */

import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config({ path: '/Users/thebi/The-Alpha-Biblical-Man-App/.env.migration' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

async function quickTest() {
  console.log('🚀 Quick Test - Finding $3.00 subscriptions...\n');

  try {
    const priceGroups: { [key: string]: number } = {};
    let totalCount = 0;
    const threeDollarSubs: string[] = [];

    // Fetch all subscriptions (just IDs and prices - fast!)
    for await (const sub of stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      expand: ['data.customer'], // Get customer data in same call
    })) {
      totalCount++;
      const amount = sub.items.data[0]?.price?.unit_amount || 0;
      const dollars = amount / 100;
      const key = `$${dollars}`;

      priceGroups[key] = (priceGroups[key] || 0) + 1;

      if (dollars === 3.00) {
        const customer = sub.customer as Stripe.Customer;
        if (!customer.deleted && customer.email) {
          threeDollarSubs.push(customer.email);
        }
      }
    }

    console.log('✅ Results:\n');
    console.log('='.repeat(60));
    console.log(`📊 Total active subscriptions: ${totalCount}`);
    console.log('\n💰 Breakdown by price:');
    Object.entries(priceGroups)
      .sort(([a], [b]) => parseFloat(a.slice(1)) - parseFloat(b.slice(1)))
      .forEach(([price, count]) => {
        console.log(`   ${price}: ${count} subscription${count > 1 ? 's' : ''}`);
      });

    console.log('\n' + '='.repeat(60));
    console.log(`\n💵 $3.00 SUBSCRIPTIONS: ${threeDollarSubs.length}\n`);

    if (threeDollarSubs.length > 0) {
      console.log('📋 Subscribers to migrate:');
      threeDollarSubs.forEach((email, idx) => {
        console.log(`   ${idx + 1}. ${email}`);
      });

      console.log(`\n✅ Ready! Run this to migrate ${threeDollarSubs.length} users:`);
      console.log('   npm run migrate-users\n');
    } else {
      console.log('⚠️  No $3.00 subscriptions found\n');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

quickTest();
