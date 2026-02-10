'use client';

import { useState } from 'react';
import { 
  Building2, Plus, Trash2, TrendingUp, TrendingDown, DollarSign,
  Users, BarChart3, FileText, Target, PieChart, ArrowUpRight,
  ArrowDownRight, Calendar, Clock, Briefcase
} from 'lucide-react';

interface Deal {
  id: string;
  company: string;
  contact: string;
  value: number;
  stage: 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  nextAction: string;
  nextDate: string;
  notes?: string;
}

interface Metric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  period: string;
}

const STAGES = [
  { id: 'prospect', label: 'Prospects', color: 'bg-gray-100 text-gray-700' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-100 text-blue-700' },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-100 text-purple-700' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-100 text-amber-700' },
  { id: 'closed-won', label: 'Won', color: 'bg-green-100 text-green-700' },
  { id: 'closed-lost', label: 'Lost', color: 'bg-red-100 text-red-500' },
];

export default function BusinessToolsModule() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'kpis' | 'reports'>('pipeline');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDeal, setNewDeal] = useState({
    company: '', contact: '', value: 0, stage: 'prospect' as Deal['stage'],
    probability: 20, nextAction: '', nextDate: ''
  });

  const [metrics] = useState<Metric[]>([
    { id: '1', label: 'Revenue', value: 0, previousValue: 0, unit: '$', period: 'This Month' },
    { id: '2', label: 'Deals Won', value: 0, previousValue: 0, unit: '', period: 'This Month' },
    { id: '3', label: 'Conversion Rate', value: 0, previousValue: 0, unit: '%', period: 'This Quarter' },
    { id: '4', label: 'Avg Deal Size', value: 0, previousValue: 0, unit: '$', period: 'This Quarter' },
    { id: '5', label: 'Pipeline Value', value: 0, previousValue: 0, unit: '$', period: 'Total' },
    { id: '6', label: 'Active Clients', value: 0, previousValue: 0, unit: '', period: 'Current' },
  ]);

  const addDeal = () => {
    if (!newDeal.company) return;
    setDeals([...deals, { ...newDeal, id: Date.now().toString(), notes: '' }]);
    setNewDeal({ company: '', contact: '', value: 0, stage: 'prospect', probability: 20, nextAction: '', nextDate: '' });
    setShowAdd(false);
  };

  const moveStage = (id: string, stage: Deal['stage']) => {
    const prob: Record<string, number> = { prospect: 20, qualified: 40, proposal: 60, negotiation: 80, 'closed-won': 100, 'closed-lost': 0 };
    setDeals(deals.map(d => d.id === id ? { ...d, stage, probability: prob[stage] } : d));
  };

  const pipelineValue = deals.filter(d => !d.stage.startsWith('closed')).reduce((sum, d) => sum + d.value, 0);
  const weightedValue = deals.filter(d => !d.stage.startsWith('closed')).reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
  const wonValue = deals.filter(d => d.stage === 'closed-won').reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          Business Manager
        </h2>
        <p className="text-gray-500 text-sm mt-1">Sales pipeline, KPIs & client reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-gray-900">{deals.filter(d => !d.stage.startsWith('closed')).length}</p>
          <p className="text-xs text-gray-500">Active Deals</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-gray-900">${pipelineValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Pipeline</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-indigo-600">${weightedValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Weighted</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-black text-green-600">${wonValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Won</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'pipeline', label: 'Pipeline', icon: Target },
          { id: 'kpis', label: 'KPIs', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Deal Pipeline</h3>
            <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> New Deal
            </button>
          </div>

          {showAdd && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input type="text" placeholder="Acme Corp" value={newDeal.company} onChange={e => setNewDeal({ ...newDeal, company: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input type="text" placeholder="John Doe" value={newDeal.contact} onChange={e => setNewDeal({ ...newDeal, contact: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value ($)</label>
                  <input type="number" value={newDeal.value} onChange={e => setNewDeal({ ...newDeal, value: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select value={newDeal.stage} onChange={e => setNewDeal({ ...newDeal, stage: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Action Date</label>
                  <input type="date" value={newDeal.nextDate} onChange={e => setNewDeal({ ...newDeal, nextDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                <input type="text" placeholder="Follow up call, Send proposal..." value={newDeal.nextAction} onChange={e => setNewDeal({ ...newDeal, nextAction: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addDeal} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Deal</button>
              </div>
            </div>
          )}

          {/* Pipeline Columns */}
          {deals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No deals in pipeline</p>
              <p className="text-gray-400 text-sm">Add your first deal to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {STAGES.filter(s => s.id !== 'closed-won' && s.id !== 'closed-lost').map(stage => {
                const stageDeals = deals.filter(d => d.stage === stage.id);
                const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
                return (
                  <div key={stage.id} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${stage.color}`}>{stage.label}</span>
                      <span className="text-xs text-gray-400">${stageValue.toLocaleString()}</span>
                    </div>
                    <div className="space-y-2">
                      {stageDeals.map(deal => (
                        <div key={deal.id} className="bg-white rounded-lg border p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-sm text-gray-900">{deal.company}</p>
                              <p className="text-xs text-gray-400">{deal.contact}</p>
                            </div>
                            <button onClick={() => setDeals(deals.filter(d => d.id !== deal.id))} className="p-1 hover:bg-red-50 rounded">
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                          <p className="text-sm font-bold text-gray-900 mb-2">${deal.value.toLocaleString()}</p>
                          {deal.nextAction && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                              <Clock className="w-3 h-3" /> {deal.nextAction}
                            </p>
                          )}
                          <div className="flex items-center gap-1">
                            <select
                              value={deal.stage}
                              onChange={e => moveStage(deal.id, e.target.value as any)}
                              className="text-[10px] border rounded px-1.5 py-0.5 flex-1"
                            >
                              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Won / Lost summary */}
          {deals.some(d => d.stage.startsWith('closed')) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl border border-green-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-700 text-sm">Won ({deals.filter(d => d.stage === 'closed-won').length})</span>
                </div>
                <p className="text-xl font-black text-green-700">${wonValue.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-red-600 text-sm">Lost ({deals.filter(d => d.stage === 'closed-lost').length})</span>
                </div>
                <p className="text-xl font-black text-red-600">${deals.filter(d => d.stage === 'closed-lost').reduce((s, d) => s + d.value, 0).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPIs Tab */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Key Performance Indicators</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Revenue', value: `$${wonValue.toLocaleString()}`, change: null, icon: DollarSign, color: 'text-green-600 bg-green-100' },
              { label: 'Active Deals', value: deals.filter(d => !d.stage.startsWith('closed')).length, change: null, icon: Briefcase, color: 'text-indigo-600 bg-indigo-100' },
              { label: 'Win Rate', value: deals.length > 0 ? `${Math.round(deals.filter(d => d.stage === 'closed-won').length / Math.max(1, deals.filter(d => d.stage.startsWith('closed')).length) * 100)}%` : '0%', change: null, icon: Target, color: 'text-amber-600 bg-amber-100' },
              { label: 'Pipeline Value', value: `$${pipelineValue.toLocaleString()}`, change: null, icon: BarChart3, color: 'text-blue-600 bg-blue-100' },
              { label: 'Weighted Pipeline', value: `$${weightedValue.toLocaleString()}`, change: null, icon: PieChart, color: 'text-purple-600 bg-purple-100' },
              { label: 'Avg Deal Size', value: deals.length > 0 ? `$${Math.round(deals.reduce((s, d) => s + d.value, 0) / deals.length).toLocaleString()}` : '$0', change: null, icon: TrendingUp, color: 'text-cyan-600 bg-cyan-100' },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Stage Distribution */}
          <div className="bg-white rounded-xl border p-5">
            <h4 className="font-semibold text-gray-900 mb-4">Pipeline by Stage</h4>
            <div className="space-y-3">
              {STAGES.map(stage => {
                const count = deals.filter(d => d.stage === stage.id).length;
                const pct = deals.length > 0 ? Math.round((count / deals.length) * 100) : 0;
                return (
                  <div key={stage.id} className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-24 text-center ${stage.color}`}>{stage.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3">
                      <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 font-mono w-12 text-right">{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Business Reports</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Monthly Revenue Report', desc: 'Revenue breakdown by client, service type, and month', icon: DollarSign, color: 'bg-green-100 text-green-600' },
              { title: 'Pipeline Forecast', desc: 'Projected revenue based on deal probability and stage', icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
              { title: 'Client Analysis', desc: 'Client acquisition, retention rates, and lifetime value', icon: Users, color: 'bg-purple-100 text-purple-600' },
              { title: 'Activity Report', desc: 'Meetings, proposals sent, follow-ups, and close activities', icon: Calendar, color: 'bg-amber-100 text-amber-600' },
            ].map((report, idx) => (
              <div key={idx} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow cursor-pointer group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.color} mb-3`}>
                  <report.icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{report.title}</h4>
                <p className="text-xs text-gray-400">{report.desc}</p>
                <button className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                  Generate <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
            <div className="flex items-center gap-3">
              <PieChart className="w-8 h-8 text-indigo-500" />
              <div>
                <h4 className="font-semibold text-indigo-900">Custom Reports Coming Soon</h4>
                <p className="text-xs text-indigo-600">Build custom dashboards with the metrics that matter most to your business</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
