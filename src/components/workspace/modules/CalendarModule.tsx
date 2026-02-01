'use client';

import { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  CheckSquare
} from 'lucide-react';

interface CalendarModuleProps {
  events: any[];
  tasks: any[];
  userId: string;
}

export default function CalendarModule({ events, tasks, userId }: CalendarModuleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localEvents, setLocalEvents] = useState(events);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (date: Date) => {
    return localEvents.filter(e => {
      const eventDate = new Date(e.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === date.toDateString() && t.status !== 'DONE';
    });
  };

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const startDate = new Date(`${formData.get('date')}T${formData.get('startTime') || '09:00'}`);
    const endTime = formData.get('endTime');
    const endDate = endTime ? new Date(`${formData.get('date')}T${endTime}`) : null;

    const data = {
      title: formData.get('title'),
      description: formData.get('description') || null,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString() || null,
      allDay: formData.get('allDay') === 'on',
      color: formData.get('color') || '#6366f1',
    };

    try {
      const res = await fetch('/api/workspace/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setLocalEvents([...localEvents, newEvent]);
        setShowForm(false);
        setSelectedDate(null);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openFormForDate = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  // Generate calendar days
  const calendarDays: Array<{ date: Date; isCurrentMonth: boolean }> = [];
  
  // Previous month days
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      isCurrentMonth: true
    });
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
      isCurrentMonth: false
    });
  }

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendrier</h2>
          <p className="text-gray-500">Gérez vos événements et deadlines</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nouvel événement
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 border-b">
          {dayNames.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = getEventsForDate(date);
            const dayTasks = getTasksForDate(date);
            const hasItems = dayEvents.length > 0 || dayTasks.length > 0;

            return (
              <div
                key={index}
                onClick={() => openFormForDate(date)}
                className={`min-h-[100px] p-2 border-b border-r cursor-pointer hover:bg-gray-50 transition ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday 
                    ? 'bg-indigo-600 text-white' 
                    : isCurrentMonth 
                      ? 'text-gray-900' 
                      : 'text-gray-400'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs px-1.5 py-0.5 rounded truncate"
                      style={{ backgroundColor: event.color + '20', color: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayTasks.slice(0, 2 - dayEvents.length).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs px-1.5 py-0.5 rounded truncate bg-orange-100 text-orange-700 flex items-center gap-1"
                    >
                      <CheckSquare className="w-3 h-3" />
                      {task.title}
                    </div>
                  ))}
                  {(dayEvents.length + dayTasks.length) > 2 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayEvents.length + dayTasks.length - 2} autres
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Prochains événements</h3>
        {localEvents.filter(e => new Date(e.startDate) >= today).length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun événement à venir</p>
        ) : (
          <div className="space-y-3">
            {localEvents
              .filter(e => new Date(e.startDate) >= today)
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-1 h-12 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.startDate).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Nouvel événement</h3>
              <button onClick={() => { setShowForm(false); setSelectedDate(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Réunion client"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Détails de l'événement..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Couleur
                  </label>
                  <input
                    type="color"
                    name="color"
                    defaultValue="#6366f1"
                    className="w-full h-10 px-1 py-1 border rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure début
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    defaultValue="09:00"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    defaultValue="10:00"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="allDay" className="w-4 h-4 text-indigo-600 rounded" />
                <span className="text-sm text-gray-700">Journée entière</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSelectedDate(null); }}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
