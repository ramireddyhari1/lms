'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getPrograms, createProgram, deleteProgram } from './actions'
import EmptyState from '@/components/EmptyState'

export default function ProgramPage() {
  const { isAdmin, user } = useRole()
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => { setPrograms(await getPrograms()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createProgram(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  const getTypeStyle = (type: string) => {
    switch(type) { case 'Industrial Training': return { bg: '#eff6ff', color: '#2563eb' }; case 'Internship': return { bg: '#ecfdf5', color: '#059669' }; case 'Apprenticeship': return { bg: '#faf5ff', color: '#9333ea' }; default: return { bg: '#f8fafc', color: '#475569' } }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className="fas fa-layer-group"></i></div>
          <div><div className="text-2xl font-bold leading-none" style={{ color: '#1e293b' }}>{programs.length}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Total Programs</div></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><i className="fas fa-spinner"></i></div>
          <div><div className="text-2xl font-bold leading-none" style={{ color: '#1e293b' }}>{programs.filter(p => p.status === 'active').length}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>In Progress</div></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#ecfdf5', color: '#22c55e' }}><i className="fas fa-check-circle"></i></div>
          <div><div className="text-2xl font-bold leading-none" style={{ color: '#1e293b' }}>{programs.filter(p => p.status === 'completed').length}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Completed</div></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end">
        {isAdmin && <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"><i className="fas fa-plus-circle"></i> Add Program</button>}
      </div>

      {/* Programs */}
      {programs.length === 0 ? (
        <EmptyState icon="fa-book-open" title="No Programs Yet" description="No training programs have been added. Admins can create programs." actionLabel={isAdmin ? 'Add Program' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(program => {
            const ts = getTypeStyle(program.type)
            return (
              <div key={program.id} className="bg-white rounded-2xl p-6 shadow-sm border hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex justify-between items-start mb-5">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5" style={{ backgroundColor: ts.bg, color: ts.color }}><i className="fas fa-industry"></i> {program.type}</span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: program.status === 'completed' ? '#ecfdf5' : '#fffbeb', color: program.status === 'completed' ? '#059669' : '#d97706' }}>{program.status}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 leading-tight" style={{ color: '#1e293b' }}>{program.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6 font-medium" style={{ color: '#64748b' }}>
                  <div className="flex items-center gap-1.5"><i className="fas fa-users" style={{ color: '#60a5fa' }}></i> {program.batch}</div>
                  <div className="flex items-center gap-1.5"><i className="far fa-calendar-alt" style={{ color: '#60a5fa' }}></i> {program.startDate} - {program.endDate}</div>
                  <div className="flex items-center gap-1.5"><i className="far fa-clock" style={{ color: '#60a5fa' }}></i> {program.duration}</div>
                </div>
                <div className="mb-6 mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>Progress</span>
                    <span className="font-bold" style={{ color: program.status === 'completed' ? '#059669' : '#2563eb' }}>{program.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                    <div className="h-full rounded-full" style={{ width: `${program.progress}%`, backgroundColor: program.status === 'completed' ? '#10b981' : '#2563eb' }}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t" style={{ borderColor: '#f1f5f9' }}>
                  <div>
                    <div className="text-[10px] uppercase font-bold mb-1" style={{ color: '#94a3b8' }}>Employer</div>
                    <div className="font-semibold text-sm" style={{ color: '#1e293b' }}>{program.employer}</div>
                  </div>
                  {isAdmin && <button onClick={() => deleteProgram(program.id).then(load)} className="text-xs font-bold" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt mr-1"></i>Remove</button>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10" style={{ borderColor: '#f1f5f9' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Program</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label><input required name="title" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Full Stack Development" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Type</label><select name="type" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Industrial Training</option><option>Internship</option><option>Apprenticeship</option></select></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option value="active">Active</option><option value="completed">Completed</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Employer *</label><input required name="employer" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Batch</label><input name="batch" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="Batch A" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Start Date</label><input name="startDate" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="Jan 2025" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>End Date</label><input name="endDate" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="Jun 2025" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Duration</label><input name="duration" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="6 Months" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Mentor</label><input name="mentor" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Progress %</label><input name="progress" type="number" min="0" max="100" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="0" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Skills (comma-separated)</label><input name="skills" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="React, Node.js" /></div>
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
