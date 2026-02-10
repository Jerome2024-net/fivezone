'use client';

import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Clock, 
  FileText, 
  Calendar, 
  CheckSquare,
  FileArchive,
  TrendingUp,
  Plus,
  Euro,
  Target,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Pen,
  Landmark,
  BarChart3,
  Droplets,
  Building2,
  Wrench
} from 'lucide-react';
import ProjectsModule from './modules/ProjectsModule';
import ClientsModule from './modules/ClientsModule';
import TasksModule from './modules/TasksModule';
import TimeTrackingModule from './modules/TimeTrackingModule';
import InvoicesModule from './modules/InvoicesModule';
import CalendarModule from './modules/CalendarModule';
import DashboardModule from './modules/DashboardModule';
import DevToolsModule from './modules/DevToolsModule';
import DesignToolsModule from './modules/DesignToolsModule';
import LegalToolsModule from './modules/LegalToolsModule';
import MarketingToolsModule from './modules/MarketingToolsModule';
import CleaningToolsModule from './modules/CleaningToolsModule';
import BusinessToolsModule from './modules/BusinessToolsModule';

type ModuleType = 'dashboard' | 'projects' | 'clients' | 'tasks' | 'time' | 'invoices' | 'calendar' | 'documents' | 'pro-tools';

interface WorkspaceClientProps {
  projects: any[];
  clients: any[];
  tasks: any[];
  timeEntries: any[];
  invoices: any[];
  events: any[];
  recentMissions: any[];
  stats: {
    totalRevenue: number;
    pendingInvoices: number;
    activeProjects: number;
    completedTasks: number;
    totalTasks: number;
    totalHours: number;
    totalClients: number;
  };
  userId: string;
  userCategory: string | null;
}

const CATEGORY_TOOLS: Record<string, { label: string; icon: any }> = {
  'Tech': { label: 'Outils Dev', icon: Monitor },
  'Développement': { label: 'Outils Dev', icon: Monitor },
  'Development': { label: 'Dev Tools', icon: Monitor },
  'Design': { label: 'Outils Design', icon: Pen },
  'Juridique': { label: 'Outils Juridiques', icon: Landmark },
  'Legal': { label: 'Legal Tools', icon: Landmark },
  'Marketing': { label: 'Outils Marketing', icon: BarChart3 },
  'Nettoyage': { label: 'Outils Nettoyage', icon: Droplets },
  'Cleaning': { label: 'Cleaning Tools', icon: Droplets },
  'Business': { label: 'Outils Business', icon: Building2 },
  'Consulting': { label: 'Business Tools', icon: Building2 },
};

const baseModules = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'projects', label: 'Projets', icon: FolderKanban },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'tasks', label: 'Tâches', icon: CheckSquare },
  { id: 'time', label: 'Temps', icon: Clock },
  { id: 'invoices', label: 'Facturation', icon: FileText },
  { id: 'calendar', label: 'Calendrier', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileArchive },
];

export default function WorkspaceClient({
  projects,
  clients,
  tasks,
  timeEntries,
  invoices,
  events,
  recentMissions,
  stats,
  userId,
  userCategory,
}: WorkspaceClientProps) {
  const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const modules = useMemo(() => {
    const list = [...baseModules];
    if (userCategory && CATEGORY_TOOLS[userCategory]) {
      const tool = CATEGORY_TOOLS[userCategory];
      // Insert pro-tools right after dashboard
      list.splice(1, 0, { id: 'pro-tools', label: tool.label, icon: tool.icon });
    } else if (userCategory) {
      // Unknown category → show generic "Pro Tools" entry
      list.splice(1, 0, { id: 'pro-tools', label: 'Outils Pro', icon: Wrench });
    }
    return list;
  }, [userCategory]);

  const renderProTools = () => {
    const cat = userCategory?.toLowerCase() || '';
    if (cat.includes('tech') || cat.includes('dev') || cat.includes('développement')) return <DevToolsModule />;
    if (cat.includes('design')) return <DesignToolsModule />;
    if (cat.includes('juridique') || cat.includes('legal') || cat.includes('droit')) return <LegalToolsModule />;
    if (cat.includes('marketing') || cat.includes('communication')) return <MarketingToolsModule />;
    if (cat.includes('nettoyage') || cat.includes('cleaning') || cat.includes('entretien')) return <CleaningToolsModule />;
    if (cat.includes('business') || cat.includes('consulting') || cat.includes('conseil')) return <BusinessToolsModule />;
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Wrench className="w-16 h-16 mb-4 opacity-50" />
        <p className="text-lg font-medium">Outils Professionnels</p>
        <p className="text-sm">Outils spécialisés pour votre métier</p>
      </div>
    );
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <DashboardModule 
            stats={stats} 
            projects={projects} 
            tasks={tasks} 
            invoices={invoices}
            timeEntries={timeEntries}
            recentMissions={recentMissions}
            onNavigate={setActiveModule}
          />
        );
      case 'projects':
        return <ProjectsModule projects={projects} clients={clients} userId={userId} />;
      case 'clients':
        return <ClientsModule clients={clients} userId={userId} />;
      case 'tasks':
        return <TasksModule tasks={tasks} projects={projects} userId={userId} />;
      case 'time':
        return <TimeTrackingModule timeEntries={timeEntries} projects={projects} tasks={tasks} userId={userId} />;
      case 'invoices':
        return <InvoicesModule invoices={invoices} clients={clients} projects={projects} userId={userId} />;
      case 'calendar':
        return <CalendarModule events={events} tasks={tasks} userId={userId} />;
      case 'documents':
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <FileArchive className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Documents</p>
            <p className="text-sm">Bientôt disponible</p>
          </div>
        );
      case 'pro-tools':
        return renderProTools();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mon Espace de Travail</h1>
                <p className="text-xs text-gray-500">Gérez votre activité en un seul endroit</p>
              </div>
            </div>
            
            {/* Quick Stats Bar */}
            <div className="hidden lg:flex items-center gap-6">
              <QuickStat 
                label="Revenus" 
                value={`${stats.totalRevenue.toLocaleString()}€`}
                trend={+12}
              />
              <QuickStat 
                label="En attente" 
                value={`${stats.pendingInvoices.toLocaleString()}€`}
                trend={-5}
                negative
              />
              <QuickStat 
                label="Heures" 
                value={`${Math.round(stats.totalHours)}h`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r min-h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300`}>
          <nav className="p-4 space-y-1">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id as ModuleType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                  {!isSidebarCollapsed && <span>{module.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Pro Tip */}
          {!isSidebarCollapsed && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold text-sm">Astuce Pro</span>
                </div>
                <p className="text-xs opacity-90">
                  Suivez votre temps sur chaque projet pour optimiser votre taux horaire moyen.
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

function QuickStat({ 
  label, 
  value, 
  trend, 
  negative 
}: { 
  label: string; 
  value: string; 
  trend?: number;
  negative?: boolean;
}) {
  return (
    <div className="text-right">
      <p className="text-xs text-gray-500">{label}</p>
      <div className="flex items-center gap-1">
        <span className="text-lg font-bold text-gray-900">{value}</span>
        {trend !== undefined && (
          <span className={`flex items-center text-xs ${negative ? 'text-orange-500' : 'text-green-500'}`}>
            {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
