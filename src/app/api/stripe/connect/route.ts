import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 1. Get the Business profile for the current user
    const business = await prisma.business.findUnique({
      where: { userId: session.user.id },
    });

    if (!business) {
      return new NextResponse('Business profile not found', { status: 404 });
    }

    let accountId = business.stripeAccountId;

    // 2. If no Stripe account exists, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: session.user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: session.user.id,
          businessId: business.id,
        },
      });

      accountId = account.id;

      await prisma.business.update({
        where: { id: business.id },
        data: { stripeAccountId: accountId },
      });
    }

    // 3. Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?stripe=return`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('[STRIPE_CONNECT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
