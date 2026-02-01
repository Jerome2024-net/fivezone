'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Clock, 
  Plus,
  Calendar,
  FolderKanban,
  X,
  Trash2
} from 'lucide-react';

interface TimeTrackingModuleProps {
  timeEntries: any[];
  projects: any[];
  tasks: any[];
  userId: string;
}

export default function TimeTrackingModule({ timeEntries, projects, tasks, userId }: TimeTrackingModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localEntries, setLocalEntries] = useState(timeEntries);
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerDescription, setTimerDescription] = useState('');
  const [timerProjectId, setTimerProjectId] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerStart) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - timerStart.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerStart]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const startTimer = () => {
    setIsRunning(true);
    setTimerStart(new Date());
    setElapsedSeconds(0);
  };

  const stopTimer = async () => {
    if (!timerStart) return;
    
    setIsRunning(false);
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timerStart.getTime()) / 60000); // in minutes
    
    if (duration < 1) {
      setTimerStart(null);
      setElapsedSeconds(0);
      return;
    }

    try {
      const res = await fetch('/api/workspace/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: timerDescription || 'Temps tracké',
          startTime: timerStart.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          projectId: timerProjectId || null,
          billable: true,
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setLocalEntries([newEntry, ...localEntries]);
      }
    } catch (error) {
      console.error('Error saving time entry:', error);
    }

    setTimerStart(null);
    setElapsedSeconds(0);
    setTimerDescription('');
    setTimerProjectId('');
  };

  const handleCreateEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const hours = parseInt(formData.get('hours') as string) || 0;
    const minutes = parseInt(formData.get('minutes') as string) || 0;
    const duration = hours * 60 + minutes;
    
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const data = {
      description: formData.get('description') || null,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      projectId: formData.get('projectId') || null,
      billable: formData.get('billable') === 'on',
    };

    try {
      const res = await fetch('/api/workspace/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setLocalEntries([newEntry, ...localEntries]);
        setShowForm(false);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error creating time entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group entries by date
  const groupedEntries = localEntries.reduce((acc, entry) => {
    const date = new Date(entry.startTime).toLocaleDateString('fr-FR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, any[]>);

  // Calculate totals
  const todayTotal = localEntries
    .filter(e => new Date(e.startTime).toDateString() === new Date().toDateString())
    .reduce((sum, e) => sum + (e.duration || 0), 0);
  
  const weekTotal = localEntries
    .filter(e => {
      const entryDate = new Date(e.startTime);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDate >= weekAgo;
    })
    .reduce((sum, e) => sum + (e.duration || 0), 0);

  const monthTotal = localEntries
    .filter(e => {
      const entryDate = new Date(e.startTime);
      const now = new Date();
      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + (e.duration || 0), 0);

  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">Chronomètre</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Que faites-vous ?"
                value={timerDescription}
                onChange={(e) => setTimerDescription(e.target.value)}
                disabled={isRunning}
                className="flex-1 px-4 py-2 bg-white/20 backdrop-blur rounded-lg placeholder-white/70 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <select
                value={timerProjectId}
                onChange={(e) => setTimerProjectId(e.target.value)}
                disabled={isRunning}
                className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="" className="text-gray-900">Aucun projet</option>
                {projects.filter(p => p.status === 'ACTIVE').map((project) => (
                  <option key={project.id} value={project.id} className="text-gray-900">
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl font-mono font-bold">
              {formatDuration(elapsedSeconds)}
            </div>
            <button
              onClick={isRunning ? stopTimer : startTimer}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-white text-indigo-600 hover:bg-gray-100'
              }`}
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Aujourd'hui</p>
          <p className="text-2xl font-bold text-gray-900">{formatMinutes(todayTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Cette semaine</p>
          <p className="text-2xl font-bold text-gray-900">{formatMinutes(weekTotal)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Ce mois</p>
          <p className="text-2xl font-bold text-gray-900">{formatMinutes(monthTotal)}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Entrées de temps</h2>
          <p className="text-gray-500">Historique de votre temps tracké</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Entrée manuelle
        </button>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Ajouter une entrée</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEntry} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Qu'avez-vous fait ?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures
                  </label>
                  <input
                    type="number"
                    name="hours"
                    min="0"
                    max="24"
                    defaultValue="1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    name="minutes"
                    min="0"
                    max="59"
                    defaultValue="0"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="billable" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-sm text-gray-700">Facturable</span>
              </label>
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
                  {isSubmitting ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Time Entries List */}
      {localEntries.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entrée</h3>
          <p className="text-gray-500 mb-4">Démarrez le chronomètre ou ajoutez une entrée manuelle</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([date, entries]) => {
            const dayTotal = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
            return (
              <div key={date} className="bg-white rounded-xl border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <span className="font-medium text-gray-700">{date}</span>
                  <span className="text-sm text-gray-500">Total: {formatMinutes(dayTotal)}</span>
                </div>
                <div className="divide-y">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">
                          {entry.description || 'Sans description'}
                        </p>
                        {entry.project && (
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: entry.project.color }}
                            />
                            {entry.project.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatMinutes(entry.duration || 0)}</p>
                        {entry.billable && (
                          <span className="text-xs text-green-600">Facturable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
