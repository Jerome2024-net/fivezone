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
        payment: true,
        business: true
      }
    });

    if (!mission) {
      return new NextResponse('Mission not found', { status: 404 });
    }

    // Only Client can release funds
    if (mission.clientId !== session.user.id) {
       return new NextResponse('Forbidden', { status: 403 });
    }

    if (mission.status !== 'DELIVERED' && mission.status !== 'IN_PROGRESS') {
        return new NextResponse('Mission not ready for completion', { status: 400 });
    }

    const payment = mission.payment;
    if (!payment || payment.status !== 'HELD') {
        return new NextResponse('No funds to release or already released', { status: 400 });
    }

    if (!mission.business.stripeAccountId) {
        return new NextResponse('Freelancer has no connected account', { status: 400 });
    }

    // Transfer funds to Freelancer
    // Note: We use the full amount collected. 
    // If you want to take a fee, you would deduct it here or use `source_transaction` with application_fee_amount.
    // For 0% commission, we transfer everything.
    
    // Check balance logic? 
    // Usually separate charges and transfers means the Platform *must* have available balance.
    // Since we charged it recently, it might be "pending" balance?
    // Stripe Express "Separate Charges and Transfers" usually allows using source_transaction for Transfer to link them?
    // Or just simplistic transfer if platform balance is sufficient.
    // Let's try source_transaction if we have chargeId, otherwise straight transfer.
    
    // But we captured PaymentIntent. We can retrieve the Latest Charge.
    // The payment.stripePaymentIntentId is stored.
    
    // For simplicity in MVP, we attempt a direct transfer.
    
    const transfer = await stripe.transfers.create({
        amount: payment.amount,
        currency: payment.currency,
        destination: mission.business.stripeAccountId,
        metadata: {
            missionId: id,
            paymentId: payment.id
        }
        // source_transaction: payment.stripeChargeId // If we stored charge ID, beneficial for fees.
        // If not provided, it uses platform available balance. 
        // Warning: Funds from the charge might take days to be "available" depending on country.
        // For test mode it's fine.
    });

    await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: 'RELEASED',
            stripeTransferId: transfer.id,
            releasedAt: new Date()
        }
    });

    await prisma.missionRequest.update({
        where: { id: id },
        data: { status: 'COMPLETED' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[STRIPE_RELEASE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
