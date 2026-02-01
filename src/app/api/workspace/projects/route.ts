import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    include: { 
      client: true,
      _count: { select: { tasks: true, timeEntries: true } }
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || null,
        color: body.color || '#6366f1',
        budget: body.budget || null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        clientId: body.clientId || null,
        ownerId: session.user.id,
      },
      include: { 
        client: true,
        _count: { select: { tasks: true, timeEntries: true } }
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
