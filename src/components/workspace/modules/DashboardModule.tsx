'use client';

import { 
  Euro, 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  Users,
  TrendingUp,
  ArrowRight,
  Calendar,
  FileText,
  AlertCircle,
  Zap
} from 'lucide-react';

interface DashboardModuleProps {
  stats: {
    totalRevenue: number;
    pendingInvoices: number;
    activeProjects: number;
    completedTasks: number;
    totalTasks: number;
    totalHours: number;
    totalClients: number;
  };
  projects: any[];
  tasks: any[];
  invoices: any[];
  timeEntries: any[];
  recentMissions: any[];
  onNavigate: (module: string) => void;
}

export default function DashboardModule({
  stats,
  projects,
  tasks,
  invoices,
  timeEntries,
  recentMissions,
  onNavigate,
}: DashboardModuleProps) {
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  
  const today = new Date();
  const todayEntries = timeEntries.filter(t => {
    const entryDate = new Date(t.startTime);
    return entryDate.toDateString() === today.toDateString();
  });
  const todayMinutes = todayEntries.reduce((sum, t) => sum + (t.duration || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bonjour ! 👋</h2>
        <p className="opacity-90 mb-4">
          Voici un aperçu de votre activité. Vous avez {pendingTasks.length} tâche(s) en cours.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur">
            <p className="text-xs opacity-80">Temps aujourd'hui</p>
            <p className="text-xl font-bold">{Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur">
            <p className="text-xs opacity-80">Projets actifs</p>
            <p className="text-xl font-bold">{stats.activeProjects}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur">
            <p className="text-xs opacity-80">À facturer</p>
            <p className="text-xl font-bold">{stats.pendingInvoices.toLocaleString()}€</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Euro}
          label="Revenus totaux"
          value={`${stats.totalRevenue.toLocaleString()}€`}
          color="green"
          onClick={() => onNavigate('invoices')}
        />
        <StatCard 
          icon={FolderKanban}
          label="Projets actifs"
          value={stats.activeProjects.toString()}
          color="blue"
          onClick={() => onNavigate('projects')}
        />
        <StatCard 
          icon={CheckCircle2}
          label="Tâches complétées"
          value={`${stats.completedTasks}/${stats.totalTasks}`}
          color="purple"
          onClick={() => onNavigate('tasks')}
        />
        <StatCard 
          icon={Clock}
          label="Heures totales"
          value={`${Math.round(stats.totalHours)}h`}
          color="orange"
          onClick={() => onNavigate('time')}
        />
      </div>

      {/* Alerts */}
      {(overdueInvoices.length > 0 || recentMissions.filter(m => m.status === 'PENDING').length > 0) && (
        <div className="space-y-3">
          {overdueInvoices.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800">
                  {overdueInvoices.length} facture(s) en retard
                </p>
                <p className="text-sm text-red-600">
                  Total: {overdueInvoices.reduce((sum, i) => sum + i.total, 0).toLocaleString()}€
                </p>
              </div>
              <button 
                onClick={() => onNavigate('invoices')}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Voir →
              </button>
            </div>
          )}
          
          {recentMissions.filter(m => m.status === 'PENDING').length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">
                  {recentMissions.filter(m => m.status === 'PENDING').length} nouvelle(s) demande(s) de mission
                </p>
                <p className="text-sm text-blue-600">
                  Répondez rapidement pour augmenter vos chances
                </p>
              </div>
              <a 
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Voir →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              Tâches à faire
            </h3>
            <button 
              onClick={() => onNavigate('tasks')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Aucune tâche en cours</p>
              <button 
                onClick={() => onNavigate('tasks')}
                className="mt-2 text-indigo-600 text-sm font-medium"
              >
                + Créer une tâche
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTasks.slice(0, 5).map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'URGENT' ? 'bg-red-500' :
                    task.priority === 'HIGH' ? 'bg-orange-500' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{task.title}</p>
                    {task.project && (
                      <p className="text-xs text-gray-500">{task.project.name}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'IN_PROGRESS' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status === 'IN_PROGRESS' ? 'En cours' : 'À faire'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Recent */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction icon={FolderKanban} label="Nouveau projet" onClick={() => onNavigate('projects')} />
              <QuickAction icon={FileText} label="Créer facture" onClick={() => onNavigate('invoices')} />
              <QuickAction icon={Clock} label="Démarrer timer" onClick={() => onNavigate('time')} />
              <QuickAction icon={Users} label="Ajouter client" onClick={() => onNavigate('clients')} />
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Projets actifs</h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
              >
                Voir tout
              </button>
            </div>
            
            {activeProjects.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Aucun projet actif</p>
            ) : (
              <div className="space-y-3">
                {activeProjects.slice(0, 4).map((project) => (
                  <div key={project.id} className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{project.name}</p>
                      <p className="text-xs text-gray-500">
                        {project._count?.tasks || 0} tâches
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Dernières factures
          </h3>
          <button 
            onClick={() => onNavigate('invoices')}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Aucune facture</p>
            <button 
              onClick={() => onNavigate('invoices')}
              className="mt-2 text-indigo-600 text-sm font-medium"
            >
              + Créer une facture
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2 font-medium">N°</th>
                  <th className="pb-2 font-medium">Client</th>
                  <th className="pb-2 font-medium">Montant</th>
                  <th className="pb-2 font-medium">Statut</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{invoice.number}</td>
                    <td className="py-3 text-gray-600">{invoice.client?.name || '-'}</td>
                    <td className="py-3 font-medium">{invoice.total.toLocaleString()}€</td>
                    <td className="py-3">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  onClick 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: 'green' | 'blue' | 'purple' | 'orange';
  onClick: () => void;
}) {
  const colors = {
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-xl border p-4 text-left hover:shadow-md transition-shadow"
    >
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </button>
  );
}

function QuickAction({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 transition text-gray-600"
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-600',
    SENT: 'bg-blue-100 text-blue-700',
    VIEWED: 'bg-purple-100 text-purple-700',
    PAID: 'bg-green-100 text-green-700',
    OVERDUE: 'bg-red-100 text-red-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
  };
  
  const labels: Record<string, string> = {
    DRAFT: 'Brouillon',
    SENT: 'Envoyée',
    VIEWED: 'Vue',
    PAID: 'Payée',
    OVERDUE: 'En retard',
    CANCELLED: 'Annulée',
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || styles.DRAFT}`}>
      {labels[status] || status}
    </span>
  );
}
