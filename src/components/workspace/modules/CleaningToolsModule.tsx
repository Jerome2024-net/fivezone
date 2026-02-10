'use client';

import { useState } from 'react';
import { 
  Droplets, Plus, Trash2, CheckCircle2, Clock, MapPin,
  Calendar, ClipboardList, User, Phone, Home, Star,
  AlertCircle, CheckSquare, Square, RotateCcw
} from 'lucide-react';

interface Intervention {
  id: string;
  clientName: string;
  address: string;
  phone?: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  checklist: { item: string; done: boolean }[];
  recurring: boolean;
  frequency?: string;
}

const INTERVENTION_TYPES = [
  'Office Cleaning', 'Residential Cleaning', 'Deep Clean', 'Move-in/Move-out',
  'Window Cleaning', 'Carpet Cleaning', 'Post-Construction', 'Regular Maintenance'
];

const DEFAULT_CHECKLISTS: Record<string, string[]> = {
  'Office Cleaning': ['Vacuum all floors', 'Clean desks & surfaces', 'Empty trash bins', 'Clean restrooms', 'Wipe glass & mirrors', 'Mop floors', 'Restock supplies'],
  'Residential Cleaning': ['Vacuum & mop floors', 'Clean kitchen surfaces', 'Clean bathrooms', 'Dust furniture', 'Change bed linens', 'Empty trash', 'Clean windows'],
  'Deep Clean': ['Move furniture & clean behind', 'Scrub tile grout', 'Clean inside appliances', 'Wash walls & baseboards', 'Deep clean carpets', 'Clean light fixtures', 'Disinfect all surfaces'],
  'Window Cleaning': ['Clean exterior glass', 'Clean interior glass', 'Clean frames & sills', 'Remove screen dirt', 'Dry & polish'],
};

export default function CleaningToolsModule() {
  const [activeTab, setActiveTab] = useState<'planning' | 'checklist' | 'clients'>('planning');
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newIntervention, setNewIntervention] = useState({
    clientName: '', address: '', phone: '', date: '', time: '09:00',
    duration: 120, type: 'Office Cleaning', notes: '', recurring: false, frequency: 'weekly'
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const addIntervention = () => {
    if (!newIntervention.clientName || !newIntervention.date) return;
    const checklist = (DEFAULT_CHECKLISTS[newIntervention.type] || ['Task 1', 'Task 2', 'Task 3']).map(item => ({ item, done: false }));
    setInterventions([...interventions, {
      ...newIntervention, id: Date.now().toString(), status: 'scheduled', checklist
    }]);
    setNewIntervention({ clientName: '', address: '', phone: '', date: '', time: '09:00', duration: 120, type: 'Office Cleaning', notes: '', recurring: false, frequency: 'weekly' });
    setShowAdd(false);
  };

  const updateStatus = (id: string, status: Intervention['status']) => {
    setInterventions(interventions.map(i => i.id === id ? { ...i, status } : i));
  };

  const toggleChecklist = (interventionId: string, itemIndex: number) => {
    setInterventions(interventions.map(i => {
      if (i.id !== interventionId) return i;
      const checklist = [...i.checklist];
      checklist[itemIndex] = { ...checklist[itemIndex], done: !checklist[itemIndex].done };
      return { ...i, checklist };
    }));
  };

  const todayInterventions = interventions.filter(i => i.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const completedToday = todayInterventions.filter(i => i.status === 'completed').length;
  const uniqueClients = [...new Set(interventions.map(i => i.clientName))];

  const statusBadge = (s: string) => {
    switch (s) {
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-cyan-600" />
          </div>
          Cleaning Manager
        </h2>
        <p className="text-gray-500 text-sm mt-1">Interventions, checklists & client management</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{todayInterventions.length}</p>
          <p className="text-xs text-gray-500">Today</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-green-600">{completedToday}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{uniqueClients.length}</p>
          <p className="text-xs text-gray-500">Clients</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{interventions.filter(i => i.recurring).length}</p>
          <p className="text-xs text-gray-500">Recurring</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'planning', label: 'Planning', icon: Calendar },
          { id: 'checklist', label: 'Checklists', icon: ClipboardList },
          { id: 'clients', label: 'Clients', icon: User },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Planning Tab */}
      {activeTab === 'planning' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Daily Schedule</h3>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm" />
            </div>
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
              <Plus className="w-4 h-4" /> New Intervention
            </button>
          </div>

          {showAdd && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input type="text" placeholder="Société ABC" value={newIntervention.clientName} onChange={e => setNewIntervention({ ...newIntervention, clientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newIntervention.type} onChange={e => setNewIntervention({ ...newIntervention, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {INTERVENTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" placeholder="12 Rue de la Paix, Cotonou" value={newIntervention.address} onChange={e => setNewIntervention({ ...newIntervention, address: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newIntervention.date} onChange={e => setNewIntervention({ ...newIntervention, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={newIntervention.time} onChange={e => setNewIntervention({ ...newIntervention, time: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input type="number" value={newIntervention.duration} onChange={e => setNewIntervention({ ...newIntervention, duration: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" placeholder="+229..." value={newIntervention.phone} onChange={e => setNewIntervention({ ...newIntervention, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newIntervention.recurring} onChange={e => setNewIntervention({ ...newIntervention, recurring: e.target.checked })} className="rounded" />
                  <span className="text-sm text-gray-700 font-medium flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> Recurring</span>
                </label>
                {newIntervention.recurring && (
                  <select value={newIntervention.frequency} onChange={e => setNewIntervention({ ...newIntervention, frequency: e.target.value })} className="border rounded-lg px-3 py-1.5 text-sm">
                    <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Every 2 weeks</option><option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addIntervention} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Schedule</button>
              </div>
            </div>
          )}

          {todayInterventions.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No interventions scheduled</p>
              <p className="text-gray-400 text-sm">for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayInterventions.map(int => (
                <div key={int.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-cyan-600">{int.time}</span>
                        <span className="text-xs text-gray-400">{int.duration} min</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(int.status)}`}>{int.status}</span>
                        {int.recurring && <RotateCcw className="w-3.5 h-3.5 text-gray-400" />}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{int.clientName}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {int.address}</span>
                        {int.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {int.phone}</span>}
                        <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" /> {int.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <select value={int.status} onChange={e => updateStatus(int.id, e.target.value as any)} className="text-xs border rounded-lg px-2 py-1">
                        <option value="scheduled">Scheduled</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => setInterventions(interventions.filter(x => x.id !== int.id))} className="p-1.5 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Active Intervention Checklists</h3>
          {interventions.filter(i => i.status !== 'completed' && i.status !== 'cancelled').length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active checklists</p>
              <p className="text-gray-400 text-sm">Checklists appear when you have scheduled interventions</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interventions.filter(i => i.status !== 'completed' && i.status !== 'cancelled').map(int => {
                const done = int.checklist.filter(c => c.done).length;
                const total = int.checklist.length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={int.id} className="bg-white rounded-xl border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{int.clientName}</h4>
                        <p className="text-xs text-gray-400">{int.type} · {int.date} at {int.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{pct}%</p>
                        <p className="text-[10px] text-gray-400">{done}/{total}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                      <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="space-y-2">
                      {int.checklist.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => toggleChecklist(int.id, idx)}
                          className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm text-left transition-colors ${item.done ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        >
                          {item.done ? <CheckSquare className="w-4 h-4 text-green-500 shrink-0" /> : <Square className="w-4 h-4 text-gray-300 shrink-0" />}
                          <span className={item.done ? 'line-through text-gray-400' : 'text-gray-700'}>{item.item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Client Directory</h3>
          {uniqueClients.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No clients yet</p>
              <p className="text-gray-400 text-sm">Clients are added automatically from interventions</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {uniqueClients.map(client => {
                const clientInterventions = interventions.filter(i => i.clientName === client);
                const completed = clientInterventions.filter(i => i.status === 'completed').length;
                const lastIntervention = clientInterventions[clientInterventions.length - 1];
                return (
                  <div key={client} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{client}</p>
                        <p className="text-xs text-gray-400">{lastIntervention?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-xs text-gray-500">
                      <div className="text-center">
                        <p className="font-bold text-gray-900 text-sm">{clientInterventions.length}</p>
                        <p>Total</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-green-600 text-sm">{completed}</p>
                        <p>Done</p>
                      </div>
                      {lastIntervention?.recurring && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-cyan-50 rounded-full text-cyan-600 font-medium">
                          <RotateCcw className="w-3 h-3" /> Recurring
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
