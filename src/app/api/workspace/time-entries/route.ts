import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const timeEntries = await prisma.timeEntry.findMany({
    where: { ownerId: session.user.id },
    include: { project: true, task: true },
    orderBy: { startTime: 'desc' },
    take: 100,
  });

  return NextResponse.json(timeEntries);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: body.description || null,
        startTime: new Date(body.startTime),
        endTime: body.endTime ? new Date(body.endTime) : null,
        duration: body.duration || null,
        billable: body.billable ?? true,
        hourlyRate: body.hourlyRate || null,
        projectId: body.projectId || null,
        taskId: body.taskId || null,
        ownerId: session.user.id,
      },
      include: { project: true, task: true },
    });

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
