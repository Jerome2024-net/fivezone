'use client';

import { useState } from 'react';
import { 
  Palette, Plus, Trash2, Eye, Image, Layers, 
  PenTool, Shapes, Star, Upload, Grid3X3, Link2
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  link?: string;
}

interface Moodboard {
  id: string;
  name: string;
  colors: string[];
  notes: string;
}

const DESIGN_CATEGORIES = ['UI/UX', 'Logo', 'Branding', 'Illustration', 'Print', 'Motion', 'Web', '3D'];

const PRESET_PALETTES = [
  { name: 'Modern Minimal', colors: ['#1a1a2e', '#16213e', '#0f3460', '#e94560', '#ffffff'] },
  { name: 'Nature', colors: ['#2d6a4f', '#40916c', '#52b788', '#b7e4c7', '#f0f4ef'] },
  { name: 'Sunset Warm', colors: ['#ff6b6b', '#ee5a24', '#f0932b', '#ffbe76', '#ffeaa7'] },
  { name: 'Ocean Blue', colors: ['#0c2461', '#1e3799', '#4a69bd', '#6a89cc', '#dfe6e9'] },
  { name: 'Pastel Dream', colors: ['#a29bfe', '#74b9ff', '#55efc4', '#ffeaa7', '#fd79a8'] },
  { name: 'Corporate', colors: ['#2c3e50', '#34495e', '#3498db', '#ecf0f1', '#e74c3c'] },
];

export default function DesignToolsModule() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'moodboard' | 'colors'>('portfolio');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [showAddMoodboard, setShowAddMoodboard] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category: 'UI/UX', imageUrl: '', link: '' });
  const [newMoodboard, setNewMoodboard] = useState({ name: '', colors: ['#34E0A1', '#1a1a2e', '#ffffff', '#e94560', '#3498db'], notes: '' });
  const [customColor, setCustomColor] = useState('#34E0A1');

  const addPortfolioItem = () => {
    if (!newItem.title) return;
    setPortfolio([...portfolio, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ title: '', category: 'UI/UX', imageUrl: '', link: '' });
    setShowAddPortfolio(false);
  };

  const addMoodboard = () => {
    if (!newMoodboard.name) return;
    setMoodboards([...moodboards, { ...newMoodboard, id: Date.now().toString() }]);
    setNewMoodboard({ name: '', colors: ['#34E0A1', '#1a1a2e', '#ffffff', '#e94560', '#3498db'], notes: '' });
    setShowAddMoodboard(false);
  };

  const updateMoodboardColor = (index: number, color: string) => {
    const updated = [...newMoodboard.colors];
    updated[index] = color;
    setNewMoodboard({ ...newMoodboard, colors: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
            <Palette className="w-5 h-5 text-pink-600" />
          </div>
          Design Studio
        </h2>
        <p className="text-gray-500 text-sm mt-1">Portfolio, moodboards & color palettes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'portfolio', label: 'Portfolio', icon: Grid3X3 },
          { id: 'moodboard', label: 'Moodboards', icon: Layers },
          { id: 'colors', label: 'Color Palettes', icon: Palette },
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

      {/* Portfolio Tab */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">My Projects</h3>
            <button
              onClick={() => setShowAddPortfolio(!showAddPortfolio)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          {showAddPortfolio && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" placeholder="Brand identity for XYZ" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    {DESIGN_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preview Image URL</label>
                <input type="url" placeholder="https://..." value={newItem.imageUrl} onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (optional)</label>
                <input type="url" placeholder="https://behance.net/..." value={newItem.link} onChange={e => setNewItem({ ...newItem, link: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddPortfolio(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addPortfolioItem} className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700">Save</button>
              </div>
            </div>
          )}

          {portfolio.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No portfolio items yet</p>
              <p className="text-gray-400 text-sm">Showcase your best design work here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.map(item => (
                <div key={item.id} className="group bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-[4/3] bg-slate-100 relative">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Shapes className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener" className="p-2 bg-white rounded-full shadow-lg">
                          <Eye className="w-5 h-5 text-gray-700" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                      <button onClick={() => setPortfolio(portfolio.filter(p => p.id !== item.id))} className="p-1 hover:bg-red-50 rounded">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Moodboard Tab */}
      {activeTab === 'moodboard' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Moodboards</h3>
            <button onClick={() => setShowAddMoodboard(!showAddMoodboard)} className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
              <Plus className="w-4 h-4" /> New Moodboard
            </button>
          </div>

          {showAddMoodboard && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" placeholder="Client XYZ branding" value={newMoodboard.name} onChange={e => setNewMoodboard({ ...newMoodboard, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Palette</label>
                <div className="flex gap-2">
                  {newMoodboard.colors.map((color, i) => (
                    <div key={i} className="relative">
                      <input type="color" value={color} onChange={e => updateMoodboardColor(i, e.target.value)} className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200" />
                      <span className="block text-[10px] text-center text-gray-400 mt-1">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea placeholder="Modern, clean, professional..." value={newMoodboard.notes} onChange={e => setNewMoodboard({ ...newMoodboard, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddMoodboard(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addMoodboard} className="px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700">Save</button>
              </div>
            </div>
          )}

          {moodboards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No moodboards yet</p>
              <p className="text-gray-400 text-sm">Create color palettes and visual references for your projects</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moodboards.map(mb => (
                <div key={mb.id} className="bg-white rounded-xl border p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900">{mb.name}</h4>
                    <button onClick={() => setMoodboards(moodboards.filter(m => m.id !== mb.id))} className="p-1 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                  <div className="flex gap-1 mb-3 rounded-lg overflow-hidden">
                    {mb.colors.map((c, i) => (
                      <div key={i} className="h-16 flex-1 relative group" style={{ backgroundColor: c }}>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">{c}</span>
                      </div>
                    ))}
                  </div>
                  {mb.notes && <p className="text-xs text-gray-500">{mb.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color Palettes Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Trending Palettes</h3>
          <p className="text-sm text-gray-500">Click on any color to copy its hex code.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_PALETTES.map((palette, idx) => (
              <div key={idx} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex h-20">
                  {palette.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => navigator.clipboard?.writeText(c)}
                      className="flex-1 relative group transition-all hover:flex-[2]"
                      style={{ backgroundColor: c }}
                      title={`Copy ${c}`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-bold">{c}</span>
                    </button>
                  ))}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700">{palette.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-3">Color Picker</h3>
            <div className="bg-white rounded-xl border p-5 flex items-center gap-6">
              <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className="w-20 h-20 rounded-xl cursor-pointer border-0" />
              <div>
                <p className="text-2xl font-mono font-bold text-gray-900">{customColor}</p>
                <p className="text-sm text-gray-400 mt-1">
                  RGB: {parseInt(customColor.slice(1, 3), 16)}, {parseInt(customColor.slice(3, 5), 16)}, {parseInt(customColor.slice(5, 7), 16)}
                </p>
                <button
                  onClick={() => navigator.clipboard?.writeText(customColor)}
                  className="mt-2 text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full font-medium hover:bg-pink-200 transition-colors"
                >
                  Copy hex
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
