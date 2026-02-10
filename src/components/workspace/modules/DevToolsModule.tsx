'use client';

import { useState } from 'react';
import { 
  GitBranch, Plus, ExternalLink, Trash2, Globe, Github, 
  Terminal, Bug, CheckCircle2, Clock, AlertTriangle, Tag,
  Cpu, Database, Server, Smartphone, Layout, Code2
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  url: string;
  platform: 'github' | 'gitlab' | 'bitbucket';
  language?: string;
}

interface SprintTask {
  id: string;
  title: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'feature' | 'bug' | 'refactor' | 'docs';
}

const TECH_STACKS = [
  { name: 'React', icon: '⚛️', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Next.js', icon: '▲', color: 'bg-slate-100 text-slate-700' },
  { name: 'Node.js', icon: '⬢', color: 'bg-green-100 text-green-700' },
  { name: 'TypeScript', icon: 'TS', color: 'bg-blue-100 text-blue-700' },
  { name: 'Python', icon: '🐍', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'PostgreSQL', icon: '🐘', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'MongoDB', icon: '🍃', color: 'bg-green-100 text-green-700' },
  { name: 'Docker', icon: '🐳', color: 'bg-sky-100 text-sky-700' },
  { name: 'AWS', icon: '☁️', color: 'bg-orange-100 text-orange-700' },
  { name: 'Flutter', icon: '💙', color: 'bg-blue-100 text-blue-700' },
  { name: 'Vue.js', icon: '💚', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Laravel', icon: '🔴', color: 'bg-red-100 text-red-700' },
];

const SPRINT_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-100' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-100' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-amber-100' },
  { id: 'review', label: 'Review', color: 'bg-purple-100' },
  { id: 'done', label: 'Done', color: 'bg-green-100' },
];

export default function DevToolsModule() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: '', url: '', platform: 'github' as const, language: '' });
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as const, type: 'feature' as const });
  const [activeTab, setActiveTab] = useState<'repos' | 'sprint' | 'stack'>('repos');

  const addRepo = () => {
    if (!newRepo.name || !newRepo.url) return;
    setRepos([...repos, { ...newRepo, id: Date.now().toString() }]);
    setNewRepo({ name: '', url: '', platform: 'github', language: '' });
    setShowAddRepo(false);
  };

  const removeRepo = (id: string) => setRepos(repos.filter(r => r.id !== id));

  const toggleTech = (name: string) => {
    setSelectedTechs(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const addSprintTask = () => {
    if (!newTask.title) return;
    setSprintTasks([...sprintTasks, { ...newTask, id: Date.now().toString(), status: 'backlog' }]);
    setNewTask({ title: '', priority: 'medium', type: 'feature' });
    setShowAddTask(false);
  };

  const moveTask = (taskId: string, newStatus: SprintTask['status']) => {
    setSprintTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const priorityColor = (p: string) => {
    switch(p) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-slate-300 bg-slate-50';
    }
  };

  const typeIcon = (t: string) => {
    switch(t) {
      case 'bug': return <Bug className="w-3.5 h-3.5 text-red-500" />;
      case 'refactor': return <Terminal className="w-3.5 h-3.5 text-purple-500" />;
      case 'docs': return <Code2 className="w-3.5 h-3.5 text-slate-500" />;
      default: return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5 text-blue-600" />
          </div>
          Dev Tools
        </h2>
        <p className="text-gray-500 text-sm mt-1">Repositories, tech stack & sprint board</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'repos', label: 'Repositories', icon: GitBranch },
          { id: 'sprint', label: 'Sprint Board', icon: Layout },
          { id: 'stack', label: 'Tech Stack', icon: Cpu },
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

      {/* Repos Tab */}
      {activeTab === 'repos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">My Repositories</h3>
            <button
              onClick={() => setShowAddRepo(!showAddRepo)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Repository
            </button>
          </div>

          {showAddRepo && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="my-project"
                    value={newRepo.name}
                    onChange={e => setNewRepo({ ...newRepo, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                  <select
                    value={newRepo.platform}
                    onChange={e => setNewRepo({ ...newRepo, platform: e.target.value as any })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="github">GitHub</option>
                    <option value="gitlab">GitLab</option>
                    <option value="bitbucket">Bitbucket</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={newRepo.url}
                  onChange={e => setNewRepo({ ...newRepo, url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Language</label>
                <input
                  type="text"
                  placeholder="TypeScript"
                  value={newRepo.language}
                  onChange={e => setNewRepo({ ...newRepo, language: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddRepo(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addRepo} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
              </div>
            </div>
          )}

          {repos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
              <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No repositories linked yet</p>
              <p className="text-gray-400 text-sm">Link your GitHub, GitLab or Bitbucket repos</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {repos.map(repo => (
                <div key={repo.id} className="bg-white rounded-xl border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Github className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{repo.name}</p>
                      <p className="text-xs text-gray-400">{repo.url}</p>
                    </div>
                    {repo.language && (
                      <span className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">{repo.language}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={repo.url} target="_blank" rel="noopener" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                    <button onClick={() => removeRepo(repo.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sprint Board Tab */}
      {activeTab === 'sprint' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Sprint Board</h3>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>

          {showAddTask && (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task title</label>
                <input
                  type="text"
                  placeholder="Implement user authentication"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value as any })} className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="feature">Feature</option>
                    <option value="bug">Bug Fix</option>
                    <option value="refactor">Refactor</option>
                    <option value="docs">Documentation</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowAddTask(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button onClick={addSprintTask} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Backlog</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-5 gap-3">
            {SPRINT_COLUMNS.map(col => (
              <div key={col.id} className={`${col.color} rounded-xl p-3 min-h-[300px]`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs bg-white/60 rounded-full px-2 py-0.5 font-medium">
                    {sprintTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                <div className="space-y-2">
                  {sprintTasks.filter(t => t.status === col.id).map(task => (
                    <div key={task.id} className={`bg-white rounded-lg p-3 border-l-[3px] ${priorityColor(task.priority)} shadow-sm`}>
                      <div className="flex items-start gap-2 mb-2">
                        {typeIcon(task.type)}
                        <span className="text-sm font-medium text-gray-800 leading-tight">{task.title}</span>
                      </div>
                      <div className="flex gap-1">
                        {SPRINT_COLUMNS.filter(c => c.id !== col.id).map(target => (
                          <button
                            key={target.id}
                            onClick={() => moveTask(task.id, target.id as SprintTask['status'])}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                          >
                            → {target.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack Tab */}
      {activeTab === 'stack' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">My Tech Stack</h3>
          <p className="text-sm text-gray-500">Select the technologies you work with. This helps clients understand your expertise.</p>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {TECH_STACKS.map(tech => (
              <button
                key={tech.name}
                onClick={() => toggleTech(tech.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedTechs.includes(tech.name)
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-transparent bg-white hover:border-gray-200'
                }`}
              >
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${tech.color}`}>
                  {tech.icon}
                </span>
                <span className="text-xs font-medium text-gray-700">{tech.name}</span>
                {selectedTechs.includes(tech.name) && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
