import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    const mission = await prisma.missionRequest.findUnique({
      where: { id },
      include: {
        business: true,
      }
    });

    if (!mission) {
      return new NextResponse('Mission not found', { status: 404 });
    }

    // Security: Only the Client can pay
    if (mission.clientId !== session.user.id) {
       // Allow Guests if we had logic for it, but for now enforce auth
       return new NextResponse('Forbidden', { status: 403 });
    }

    if (!mission.business.stripeAccountId) {
      return new NextResponse('Freelancer has not connected a bank account', { status: 400 });
    }

    // Determine Amount
    const amount = mission.proposedPrice || mission.budget;
    if (!amount) {
        return new NextResponse('No price defined for this mission', { status: 400 });
    }

    // Create Checkout Session
    // 0% Platform Fee -> We just transfer the full amount later.
    // Stripe Fees are deducted from the charge. 
    // To ensure Freelancer gets exactly X, we might need to bump the charge?
    // Usually Freelancer absorbs the fee.
    
    // Convert to cents
    const amountInCents = Math.round(amount * 100);

    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Paiement pour mission : ${mission.title}`, 
              description: `Paiement sécurisé via plateforme`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&missionId=${id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancel&missionId=${id}`,
      metadata: {
        missionId: id,
        clientId: session.user.id,
        businessId: mission.businessId,
      },
    });

    return NextResponse.json({ url: sessionStripe.url });
  } catch (error) {
    console.error('[STRIPE_PAYOUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
