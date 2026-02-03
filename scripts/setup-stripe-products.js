/**
 * Script to create Stripe Products and Prices for Fivezone subscriptions
 * 
 * Run this script once to create the subscription products in your Stripe account:
 * node scripts/setup-stripe-products.js
 * 
 * Then add the price IDs to your .env.local file
 */

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = [
  {
    name: 'Fivezone Standard',
    description: 'Access to all AI talents - 1 active at a time',
    price: 9900, // $99.00 in cents
    interval: 'month',
    metadata: { plan: 'STANDARD', talents: '1' }
  },
  {
    name: 'Fivezone Team 3',
    description: '3 AI talents active simultaneously',
    price: 24900, // $249.00 in cents
    interval: 'month',
    metadata: { plan: 'TEAM3', talents: '3' }
  },
  {
    name: 'Fivezone Team 6',
    description: '6 AI talents active in parallel - Full coverage',
    price: 44900, // $449.00 in cents
    interval: 'month',
    metadata: { plan: 'TEAM6', talents: '6' }
  }
];

async function createProducts() {
  console.log('🚀 Creating Stripe products and prices...\n');
  
  const envLines = [];
  
  for (const product of PRODUCTS) {
    try {
      // Create the product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.description,
        metadata: product.metadata
      });
      
      console.log(`✅ Created product: ${product.name} (${stripeProduct.id})`);
      
      // Create the price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
        recurring: {
          interval: product.interval
        },
        metadata: product.metadata
      });
      
      console.log(`   💰 Price: $${product.price / 100}/${product.interval} (${stripePrice.id})`);
      
      // Add to env lines
      envLines.push(`STRIPE_PRICE_${product.metadata.plan}=${stripePrice.id}`);
      
    } catch (error) {
      console.error(`❌ Error creating ${product.name}:`, error.message);
    }
  }
  
  console.log('\n📋 Add these lines to your .env.local file:\n');
  console.log('# Stripe Subscription Prices');
  envLines.forEach(line => console.log(line));
  console.log('\n✅ Done!');
}

// Check if STRIPE_SECRET_KEY is set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set');
  console.log('\nRun the script like this:');
  console.log('STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js');
  process.exit(1);
}

createProducts().catch(console.error);
