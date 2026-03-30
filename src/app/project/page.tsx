'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getProjects, createProject, deleteProject } from './actions'
import EmptyState from '@/components/EmptyState'

export default function ProjectPage() {
  const { isAdmin, user } = useRole()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const load = async () => { setProjects(await getProjects()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createProject(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  const filtered = projects.filter(p => {
    if (filter === 'All') return true
    if (filter === 'Active') return p.status === 'active'
    if (filter === 'Completed') return p.status === 'completed'
    return p.type === filter
  })

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  const filters = ['All', 'Active', 'Completed', 'Personal', 'Team', 'Industry']

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* KPI Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col lg:flex-row lg:items-center justify-between gap-6" style={{ borderColor: '#e2e8f0' }}>
        <div className="flex flex-wrap gap-8 items-center flex-1">
          <div className="text-center"><div className="text-3xl font-bold flex items-center gap-2 justify-center" style={{ color: '#1e293b' }}><i className="fas fa-layer-group" style={{ color: '#2563eb' }}></i> {projects.length}</div><div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#64748b' }}>Total Projects</div></div>
          <div className="text-center"><div className="text-3xl font-bold flex items-center gap-2 justify-center" style={{ color: '#1e293b' }}><i className="fas fa-spinner" style={{ color: '#f59e0b' }}></i> {projects.filter(p => p.status === 'active').length}</div><div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#64748b' }}>In Progress</div></div>
          <div className="text-center"><div className="text-3xl font-bold flex items-center gap-2 justify-center" style={{ color: '#1e293b' }}><i className="fas fa-check-circle" style={{ color: '#22c55e' }}></i> {projects.filter(p => p.status === 'completed').length}</div><div className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: '#64748b' }}>Completed</div></div>
        </div>
        {isAdmin && (
          <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Add Project
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all" style={{ backgroundColor: filter === f ? '#2563eb' : '#fff', color: filter === f ? '#fff' : '#475569', borderColor: filter === f ? '#2563eb' : '#e2e8f0' }}>{f}</button>
        ))}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState icon="fa-folder-open" title="No Projects Yet" description="Start building your portfolio by adding your first project." actionLabel={isAdmin ? 'Create Project' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(project => (
            <div key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col" style={{ borderColor: '#e2e8f0' }}>
              <div className="relative overflow-hidden h-40 w-full">
                {project.previewImage ? <img src={project.previewImage} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4361ee, #3a0ca3)' }}><i className="fas fa-project-diagram text-4xl text-white/60"></i></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#1e293b' }}>{project.type}</div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-1 line-clamp-1" style={{ color: '#1e293b' }}>{project.title}</h3>
                <p className="text-xs font-semibold mb-4 line-clamp-2" style={{ color: '#64748b' }}>{project.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.techStack || '').split(',').filter(Boolean).map((tech: string) => (
                    <span key={tech} className="px-2 py-1 rounded text-[10px] font-medium border" style={{ backgroundColor: '#f8fafc', color: '#475569', borderColor: '#f1f5f9' }}>{tech.trim()}</span>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="px-2 py-0.5 rounded-full uppercase font-bold tracking-wide" style={{ backgroundColor: project.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: project.status === 'completed' ? '#059669' : '#d97706' }}>{project.status}</span>
                    <span className="font-bold" style={{ color: '#1e293b' }}>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                    <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: project.status === 'completed' ? '#10b981' : 'linear-gradient(to right, #4361ee, #3a0ca3)' }}></div>
                  </div>
                </div>
                {isAdmin && <button onClick={() => deleteProject(project.id).then(load)} className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i> Remove</button>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="fa-filter" title="No Matching Projects" description="No projects match the current filter." />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10" style={{ borderColor: '#f1f5f9' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Project</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label><input required name="title" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Subtitle</label><input name="subtitle" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Type</label><select name="type" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Personal</option><option>Team</option><option>Industry</option><option>Internship</option></select></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Year</label><input name="year" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="2025" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Company</label><input name="company" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Role</label><input name="role" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Tech Stack (comma-separated)</label><input name="techStack" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="React, Node.js, MongoDB" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option value="active">Active</option><option value="completed">Completed</option></select></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Progress %</label><input name="progress" type="number" min="0" max="100" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="0" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Preview Image URL</label><input name="previewImage" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold border" style={{ color: '#475569', borderColor: '#e2e8f0' }}>Cancel</button>
                <button type="submit" className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold shadow-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
