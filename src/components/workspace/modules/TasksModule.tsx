'use client';

import { useState } from 'react';
import { 
  Plus, 
  CheckSquare, 
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  X,
  Calendar,
  Flag
} from 'lucide-react';

interface TasksModuleProps {
  tasks: any[];
  projects: any[];
  userId: string;
}

export default function TasksModule({ tasks, projects, userId }: TasksModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localTasks, setLocalTasks] = useState(tasks);

  const filteredTasks = localTasks.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description') || null,
      projectId: formData.get('projectId') || null,
      priority: formData.get('priority') || 'MEDIUM',
      dueDate: formData.get('dueDate') || null,
    };

    try {
      const res = await fetch('/api/workspace/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newTask = await res.json();
        setLocalTasks([newTask, ...localTasks]);
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    
    try {
      const res = await fetch(`/api/workspace/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLocalTasks(localTasks.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    TODO: { icon: Circle, color: 'text-gray-400', label: 'À faire' },
    IN_PROGRESS: { icon: Clock, color: 'text-blue-500', label: 'En cours' },
    IN_REVIEW: { icon: AlertCircle, color: 'text-yellow-500', label: 'En revue' },
    DONE: { icon: CheckCircle2, color: 'text-green-500', label: 'Terminé' },
  };

  const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
    LOW: { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Basse' },
    MEDIUM: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Moyenne' },
    HIGH: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Haute' },
    URGENT: { color: 'text-red-600', bg: 'bg-red-100', label: 'Urgente' },
  };

  // Group tasks by status
  const groupedTasks = {
    TODO: filteredTasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: filteredTasks.filter(t => t.status === 'IN_PROGRESS'),
    IN_REVIEW: filteredTasks.filter(t => t.status === 'IN_REVIEW'),
    DONE: filteredTasks.filter(t => t.status === 'DONE'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tâches</h2>
          <p className="text-gray-500">Organisez et suivez vos tâches</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle tâche
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Toutes' : statusConfig[status]?.label || status}
            </button>
          ))}
        </div>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Nouvelle tâche</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Finaliser la maquette"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Décrivez la tâche..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projet
                  </label>
                  <select
                    name="projectId"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Aucun projet</option>
                    {projects.filter(p => p.status === 'ACTIVE').map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    name="priority"
                    defaultValue="MEDIUM"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Création...' : 'Créer la tâche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16">
          <CheckSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune tâche</h3>
          <p className="text-gray-500 mb-4">Créez votre première tâche pour commencer</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Créer une tâche
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const StatusIcon = statusConfig[task.status]?.icon || Circle;
            const isCompleted = task.status === 'DONE';
            
            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl border p-4 hover:shadow-md transition-shadow ${
                  isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className={`mt-0.5 ${statusConfig[task.status]?.color} hover:scale-110 transition-transform`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {task.title}
                      </h3>
                      <span className={`shrink-0 text-xs px-2 py-1 rounded-full ${priorityConfig[task.priority]?.bg} ${priorityConfig[task.priority]?.color}`}>
                        <Flag className="w-3 h-3 inline mr-1" />
                        {priorityConfig[task.priority]?.label}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      {task.project && (
                        <span className="flex items-center gap-1">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: task.project.color }}
                          />
                          {task.project.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
