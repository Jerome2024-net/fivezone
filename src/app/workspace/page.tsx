import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import WorkspaceClient from '@/components/workspace/WorkspaceClient';

export const metadata = {
  title: 'Espace de travail | Fivezone',
  description: 'Gérez votre activité freelance en un seul endroit',
};

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/workspace');
  }

  // Fetch all workspace data
  const [projects, clients, tasks, timeEntries, invoices, events, recentActivity, userBusiness] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: session.user.id },
      include: { client: true, _count: { select: { tasks: true, timeEntries: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.client.findMany({
      where: { ownerId: session.user.id },
      include: { _count: { select: { projects: true, invoices: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.task.findMany({
      where: { ownerId: session.user.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timeEntry.findMany({
      where: { ownerId: session.user.id },
      include: { project: true, task: true },
      orderBy: { startTime: 'desc' },
      take: 50,
    }),
    prisma.invoice.findMany({
      where: { ownerId: session.user.id },
      include: { client: true, project: true, items: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.calendarEvent.findMany({
      where: { ownerId: session.user.id },
      orderBy: { startDate: 'asc' },
    }),
    // Recent missions
    prisma.missionRequest.findMany({
      where: { freelanceId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { business: true },
    }),
    // User's business category
    prisma.business.findFirst({
      where: { ownerId: session.user.id },
      include: { category: true },
    }),
  ]);

  // Calculate stats
  const stats = {
    totalRevenue: invoices
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + i.total, 0),
    pendingInvoices: invoices
      .filter(i => i.status === 'SENT' || i.status === 'OVERDUE')
      .reduce((sum, i) => sum + i.total, 0),
    activeProjects: projects.filter(p => p.status === 'ACTIVE').length,
    completedTasks: tasks.filter(t => t.status === 'DONE').length,
    totalTasks: tasks.length,
    totalHours: timeEntries.reduce((sum, t) => sum + (t.duration || 0), 0) / 60,
    totalClients: clients.length,
  };

  return (
    <WorkspaceClient
      projects={projects}
      clients={clients}
      tasks={tasks}
      timeEntries={timeEntries}
      invoices={invoices}
      events={events}
      recentMissions={recentActivity}
      stats={stats}
      userId={session.user.id}
      userCategory={userBusiness?.category?.name || null}
    />
  );
}
