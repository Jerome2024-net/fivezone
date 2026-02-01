import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { ownerId: session.user.id },
    include: { client: true, project: true, items: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const invoice = await prisma.invoice.create({
      data: {
        number: body.number,
        status: 'DRAFT',
        issueDate: new Date(),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        subtotal: body.subtotal,
        taxRate: body.taxRate || 20,
        taxAmount: body.taxAmount,
        total: body.total,
        notes: body.notes || null,
        projectId: body.projectId || null,
        clientId: body.clientId || null,
        ownerId: session.user.id,
        items: {
          create: body.items?.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })) || [],
        },
      },
      include: { client: true, project: true, items: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
