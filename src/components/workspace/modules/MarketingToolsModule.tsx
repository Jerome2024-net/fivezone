'use client';

import { useState } from 'react';
import { 
  BarChart3, Plus, Trash2, TrendingUp, TrendingDown, 
  Target, Eye, MousePointer, DollarSign, Calendar,
  FileText, Megaphone, Globe, Share2, Mail, Hash
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate?: string;
}

interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'video' | 'ad';
  platform: string;
  scheduledDate: string;
  status: 'idea' | 'draft' | 'review' | 'scheduled' | 'published';
}

const PLATFORMS = ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads', 'Twitter/X Ads', 'SEO', 'Email', 'Other'];
const CONTENT_TYPES = [
  { value: 'blog', label: 'Blog Post', icon: FileText },
  { value: 'social', label: 'Social Media', icon: Share2 },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'video', label: 'Video', icon: Globe },
  { value: 'ad', label: 'Ad Creative', icon: Megaphone },
];

export default function MarketingToolsModule() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'content' | 'kpi'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [showAddCampaign, setShowAddCampaign] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: '', platform: 'Google Ads', budget: 0, startDate: '' });
  const [newContent, setNewContent] = useState({ title: '', type: 'social' as const, platform: 'Instagram', scheduledDate: '' });

  const addCampaign = () => {
    if (!newCampaign.name) return;
    setCampaigns([...campaigns, {
      ...newCampaign, id: Date.now().toString(), status: 'draft',
      spent: 0, impressions: 0, clicks: 0, conversions: 0
    }]);
    setNewCampaign({ name: '', platform: 'Google Ads', budget: 0, startDate: '' });
    setShowAddCampaign(false);
  };

  const addContent = () => {
    if (!newContent.title) return;
    setContentItems([...contentItems, { ...newContent, id: Date.now().toString(), status: 'idea' }]);
    setNewContent({ title: '', type: 'social', platform: 'Instagram', scheduledDate: '' });
    setShowAddContent(false);
  };

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
  const totalImpressions = campaigns.reduce((s, c) => s + c.impressions, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const statusColor = (s: string) => {
    switch (s) { case 'active': return 'bg-green-100 text-green-700'; case 'paused': return 'bg-amber-100 text-amber-700'; case 'completed': return 'bg-gray-100 text-gray-500'; default: return 'bg-blue-100 text-blue-700'; }
  };

  const contentStatusColor = (s: string) => {
    switch (s) { case 'idea': return 'bg-slate-100 text-slate-600'; case 'draft': return 'bg-blue-100 text-blue-700'; case 'review': return 'bg-amber-100 text-amber-700'; case 'scheduled': return 'bg-purple-100 text-purple-700'; case 'published': return 'bg-green-100 text-green-700'; default: return 'bg-gray-100 text-gray-600'; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          Marketing Hub
        </h2>
        <p className="text-gray-500 text-sm mt-1">Campaigns, content calendar & KPI tracking</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
          { id: 'content', label: 'Content Plan', icon: Calendar },
          { id: 'kpi', label: 'KPIs', icon: Target },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Ad Campaigns</h3>
            <button onClick={() => setShowAddCampaign(!showAddCampaign)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          </div>

          {showAddCampaign && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input type="text" placeholder="Summer Sale 2026" value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select value={newCampaign.platform} onChange={e => setNewCampaign({ ...newCampaign, platform: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                  <input type="number" placeholder="500" value={newCampaign.budget || ''} onChange={e => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={newCampaign.startDate} onChange={e => setNewCampaign({ ...newCampaign, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddCampaign(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addCampaign} className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">Create</button>
              </div>
            </div>
          )}

          {campaigns.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No campaigns yet</p>
              <p className="text-gray-400 text-sm">Track your ad campaigns and their performance</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map(c => (
                <div key={c.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900">{c.name}</h4>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColor(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={c.status} onChange={e => setCampaigns(campaigns.map(x => x.id === c.id ? { ...x, status: e.target.value as any } : x))} className="text-xs border rounded-lg px-2 py-1">
                        <option value="draft">Draft</option><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option>
                      </select>
                      <button onClick={() => setCampaigns(campaigns.filter(x => x.id !== c.id))} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {c.platform}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${c.spent} / ${c.budget}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {c.impressions.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" /> {c.clicks}</span>
                    <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {c.conversions}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Plan Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Content Calendar</h3>
            <button onClick={() => setShowAddContent(!showAddContent)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
              <Plus className="w-4 h-4" /> New Content
            </button>
          </div>

          {showAddContent && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" placeholder="How to boost SEO in 2026" value={newContent.title} onChange={e => setNewContent({ ...newContent, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newContent.type} onChange={e => setNewContent({ ...newContent, type: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {CONTENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <input type="text" placeholder="Instagram" value={newContent.platform} onChange={e => setNewContent({ ...newContent, platform: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input type="date" value={newContent.scheduledDate} onChange={e => setNewContent({ ...newContent, scheduledDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddContent(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addContent} className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">Add</button>
              </div>
            </div>
          )}

          {/* Content Kanban */}
          <div className="grid grid-cols-5 gap-3">
            {['idea', 'draft', 'review', 'scheduled', 'published'].map(status => (
              <div key={status} className="bg-slate-50 rounded-xl p-3 min-h-[250px]">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${contentStatusColor(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  <span className="text-xs text-gray-400">{contentItems.filter(c => c.status === status).length}</span>
                </div>
                <div className="space-y-2">
                  {contentItems.filter(c => c.status === status).map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border text-sm">
                      <p className="font-medium text-gray-800 mb-1">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">{item.platform}</span>
                        <select
                          value={item.status}
                          onChange={e => setContentItems(contentItems.map(x => x.id === item.id ? { ...x, status: e.target.value as any } : x))}
                          className="text-[10px] border rounded px-1 py-0.5"
                        >
                          <option value="idea">Idea</option><option value="draft">Draft</option><option value="review">Review</option><option value="scheduled">Scheduled</option><option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Tab */}
      {activeTab === 'kpi' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Key Performance Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Budget', value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-600' },
              { label: 'Spent', value: `$${totalSpent.toLocaleString()}`, icon: TrendingDown, color: 'bg-red-50 text-red-600' },
              { label: 'Impressions', value: totalImpressions.toLocaleString(), icon: Eye, color: 'bg-blue-50 text-blue-600' },
              { label: 'Clicks', value: totalClicks.toLocaleString(), icon: MousePointer, color: 'bg-purple-50 text-purple-600' },
              { label: 'CTR', value: `${ctr}%`, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
              { label: 'Conversions', value: totalConversions.toString(), icon: Target, color: 'bg-emerald-50 text-emerald-600' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white rounded-xl border p-4 text-center">
                <div className={`w-10 h-10 ${kpi.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No data yet</p>
              <p className="text-gray-400 text-sm">Add campaigns to see your KPIs here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
