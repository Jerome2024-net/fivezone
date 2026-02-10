'use client';

import { useState } from 'react';
import { 
  Scale, Plus, Trash2, AlertTriangle, CheckCircle2, Clock, 
  FileText, Users, Calendar, Briefcase, Search, Filter,
  Landmark, Gavel, FolderOpen, AlertCircle, Timer
} from 'lucide-react';

interface LegalCase {
  id: string;
  reference: string;
  title: string;
  clientName: string;
  type: string;
  status: 'open' | 'pending' | 'hearing' | 'closed';
  court?: string;
  nextDeadline?: string;
  notes?: string;
  createdAt: string;
}

interface Deadline {
  id: string;
  title: string;
  caseRef: string;
  date: string;
  type: 'court' | 'filing' | 'response' | 'meeting' | 'other';
  urgent: boolean;
}

const CASE_TYPES = [
  'Civil', 'Criminal', 'Commercial', 'Labor', 'Family', 
  'Real Estate', 'Administrative', 'Intellectual Property', 'Tax', 'Other'
];

const DOCUMENT_TEMPLATES = [
  { name: 'Mise en demeure', icon: FileText, desc: 'Formal notice template' },
  { name: 'Contrat de prestation', icon: FileText, desc: 'Service contract template' },
  { name: 'Assignation', icon: Gavel, desc: 'Court summons template' },
  { name: 'Conclusions', icon: FileText, desc: 'Legal conclusions template' },
  { name: 'Accord transactionnel', icon: Users, desc: 'Settlement agreement' },
  { name: 'Procuration', icon: FileText, desc: 'Power of attorney' },
  { name: 'Statuts de société', icon: Briefcase, desc: 'Company bylaws' },
  { name: 'Bail commercial', icon: Landmark, desc: 'Commercial lease' },
];

export default function LegalToolsModule() {
  const [activeTab, setActiveTab] = useState<'cases' | 'deadlines' | 'templates'>('cases');
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [showAddCase, setShowAddCase] = useState(false);
  const [showAddDeadline, setShowAddDeadline] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newCase, setNewCase] = useState({ reference: '', title: '', clientName: '', type: 'Civil', court: '', notes: '' });
  const [newDeadline, setNewDeadline] = useState({ title: '', caseRef: '', date: '', type: 'filing' as const, urgent: false });

  const addCase = () => {
    if (!newCase.reference || !newCase.title) return;
    setCases([...cases, { ...newCase, id: Date.now().toString(), status: 'open', createdAt: new Date().toISOString() }]);
    setNewCase({ reference: '', title: '', clientName: '', type: 'Civil', court: '', notes: '' });
    setShowAddCase(false);
  };

  const updateCaseStatus = (id: string, status: LegalCase['status']) => {
    setCases(cases.map(c => c.id === id ? { ...c, status } : c));
  };

  const addDeadline = () => {
    if (!newDeadline.title || !newDeadline.date) return;
    setDeadlines([...deadlines, { ...newDeadline, id: Date.now().toString() }]);
    setNewDeadline({ title: '', caseRef: '', date: '', type: 'filing', urgent: false });
    setShowAddDeadline(false);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'hearing': return 'bg-purple-100 text-purple-700';
      case 'closed': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const deadlineTypeIcon = (type: string) => {
    switch (type) {
      case 'court': return <Gavel className="w-4 h-4 text-purple-500" />;
      case 'filing': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'response': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'meeting': return <Users className="w-4 h-4 text-green-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredCases = filterStatus === 'all' ? cases : cases.filter(c => c.status === filterStatus);
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const urgentDeadlines = deadlines.filter(d => {
    const diff = (new Date(d.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-violet-600" />
          </div>
          Legal Office
        </h2>
        <p className="text-gray-500 text-sm mt-1">Case management, deadlines & document templates</p>
      </div>

      {/* Urgent Alert */}
      {urgentDeadlines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">{urgentDeadlines.length} deadline(s) within 7 days</p>
            <div className="mt-1 space-y-1">
              {urgentDeadlines.map(d => (
                <p key={d.id} className="text-xs text-red-600">
                  {d.title} — {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {d.caseRef && ` (${d.caseRef})`}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'cases', label: 'Cases', icon: FolderOpen },
          { id: 'deadlines', label: 'Deadlines', icon: Timer },
          { id: 'templates', label: 'Templates', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">Cases</h3>
              <div className="flex gap-1">
                {['all', 'open', 'pending', 'hearing', 'closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterStatus === s ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowAddCase(!showAddCase)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Case
            </button>
          </div>

          {showAddCase && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                  <input type="text" placeholder="DM-2026-001" value={newCase.reference} onChange={e => setNewCase({ ...newCase, reference: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newCase.type} onChange={e => setNewCase({ ...newCase, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="Dupont vs Martin - Contract dispute" value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input type="text" placeholder="M. Dupont" value={newCase.clientName} onChange={e => setNewCase({ ...newCase, clientName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Court / Jurisdiction</label>
                  <input type="text" placeholder="Tribunal de Commerce de Paris" value={newCase.court} onChange={e => setNewCase({ ...newCase, court: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea placeholder="Additional details..." value={newCase.notes} onChange={e => setNewCase({ ...newCase, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddCase(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addCase} className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">Create Case</button>
              </div>
            </div>
          )}

          {filteredCases.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No cases yet</p>
              <p className="text-gray-400 text-sm">Create your first legal case to start tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map(c => (
                <div key={c.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.reference}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusBadge(c.status)}`}>{c.status}</span>
                        <span className="text-xs text-gray-400">{c.type}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{c.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.clientName}</span>
                        {c.court && <span className="flex items-center gap-1"><Landmark className="w-3.5 h-3.5" /> {c.court}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <select
                        value={c.status}
                        onChange={e => updateCaseStatus(c.id, e.target.value as LegalCase['status'])}
                        className="text-xs border rounded-lg px-2 py-1"
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="hearing">Hearing</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button onClick={() => setCases(cases.filter(x => x.id !== c.id))} className="p-1.5 hover:bg-red-50 rounded-lg">
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

      {/* Deadlines Tab */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Legal Deadlines</h3>
            <button onClick={() => setShowAddDeadline(!showAddDeadline)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Deadline
            </button>
          </div>

          {showAddDeadline && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" placeholder="File response brief" value={newDeadline.title} onChange={e => setNewDeadline({ ...newDeadline, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Reference</label>
                  <input type="text" placeholder="DM-2026-001" value={newDeadline.caseRef} onChange={e => setNewDeadline({ ...newDeadline, caseRef: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={newDeadline.date} onChange={e => setNewDeadline({ ...newDeadline, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newDeadline.type} onChange={e => setNewDeadline({ ...newDeadline, type: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="court">Court Hearing</option>
                    <option value="filing">Filing</option>
                    <option value="response">Response Due</option>
                    <option value="meeting">Client Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newDeadline.urgent} onChange={e => setNewDeadline({ ...newDeadline, urgent: e.target.checked })} className="rounded" />
                    <span className="text-sm text-gray-700 font-medium">Urgent</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddDeadline(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addDeadline} className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">Add</button>
              </div>
            </div>
          )}

          {sortedDeadlines.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No deadlines set</p>
              <p className="text-gray-400 text-sm">Track court dates, filing deadlines and more</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedDeadlines.map(d => {
                const daysLeft = Math.ceil((new Date(d.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isPast = daysLeft < 0;
                return (
                  <div key={d.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${isPast ? 'border-red-200 bg-red-50/50' : d.urgent ? 'border-orange-200' : ''}`}>
                    <div className="flex items-center gap-4">
                      {deadlineTypeIcon(d.type)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{d.title}</p>
                        <p className="text-xs text-gray-400">{d.caseRef && `${d.caseRef} · `}{d.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {d.urgent && <AlertCircle className="w-4 h-4 text-orange-500" />}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        <p className={`text-xs font-medium ${isPast ? 'text-red-500' : daysLeft <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                          {isPast ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                        </p>
                      </div>
                      <button onClick={() => setDeadlines(deadlines.filter(x => x.id !== d.id))} className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Document Templates</h3>
          <p className="text-sm text-gray-500">Quick-start templates for common legal documents.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DOCUMENT_TEMPLATES.map((tpl, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm hover:border-violet-200 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                  <tpl.icon className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{tpl.name}</p>
                  <p className="text-xs text-gray-400">{tpl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
