import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'You must be logged in to subscribe' },
        { status: 401 }
      );
    }

    // Get the user and their business
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businesses: { take: 1 } },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const business = user.businesses[0];
    if (!business) {
      return NextResponse.json(
        { message: 'You need a freelancer profile first. Create one at /register.' },
        { status: 400 }
      );
    }

    // Check if already Pro
    if (business.subscriptionTier === 'PRO' && business.subscriptionEnd && new Date(business.subscriptionEnd) > new Date()) {
      return NextResponse.json(
        { message: 'You already have an active Pro subscription.' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
          businessId: business.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create Checkout Session for the Pro subscription
    const priceId = process.env.STRIPE_PRICE_STANDARD;
    if (!priceId) {
      console.error('STRIPE_PRICE_STANDARD is not set');
      return NextResponse.json(
        { message: 'Subscription configuration error' },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: {
        userId: user.id,
        businessId: business.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          businessId: business.id,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT]', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
