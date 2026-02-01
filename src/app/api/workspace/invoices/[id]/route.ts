import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = params;

    // Verify ownership
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    }

    const updateData: any = {};
    
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === 'PAID') {
        updateData.paidAt = new Date();
      }
    }
    
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { client: true, project: true, items: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { id } = params;

    // Verify ownership
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id, ownerId: session.user.id },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Facture non trouvée' }, { status: 404 });
    }

    // Delete items first due to cascade
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await prisma.invoice.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
