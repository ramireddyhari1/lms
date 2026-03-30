'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getAssignments, createAssignment, deleteAssignment } from './actions'
import EmptyState from '@/components/EmptyState'

export default function AssignmentPage() {
  const { isAdmin, user } = useRole()
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const load = async () => { setAssignments(await getAssignments()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createAssignment(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  const filtered = assignments.filter(a => filter === 'All' || a.status === filter)

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Assignments
          </h2>
          <p className="mt-2 ml-5 font-semibold" style={{ color: '#64748b' }}>Manage and track your assignment submissions.</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Add Assignment
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {assignments.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'In Progress', 'Graded'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm font-medium border transition-all" style={{ backgroundColor: filter === f ? '#2563eb' : '#fff', color: filter === f ? '#fff' : '#475569', borderColor: filter === f ? '#2563eb' : '#e2e8f0' }}>{f}</button>
          ))}
        </div>
      )}

      {assignments.length === 0 ? (
        <EmptyState icon="fa-file-alt" title="No Assignments Yet" description="No assignments have been created. Admins can add assignments for students." actionLabel={isAdmin ? 'Add Assignment' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="fa-filter" title="No Matching Assignments" description={`No assignments found with status "${filter}".`} />
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Title</th>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Course</th>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Type</th>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Due Date</th>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Points</th>
                  <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Status</th>
                  {isAdmin && <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td className="py-3 px-6 font-bold" style={{ color: '#1e293b' }}>{a.title}</td>
                    <td className="py-3 px-6" style={{ color: '#64748b' }}>{a.course}</td>
                    <td className="py-3 px-6" style={{ color: '#64748b' }}>{a.type}</td>
                    <td className="py-3 px-6" style={{ color: '#64748b' }}>{a.dueDate}</td>
                    <td className="py-3 px-6 font-bold" style={{ color: '#2563eb' }}>{a.points}</td>
                    <td className="py-3 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase" style={{ backgroundColor: a.status === 'Graded' ? '#ecfdf5' : a.status === 'In Progress' ? '#eff6ff' : '#fffbeb', color: a.status === 'Graded' ? '#059669' : a.status === 'In Progress' ? '#2563eb' : '#d97706' }}>{a.status}</span>
                    </td>
                    {isAdmin && <td className="py-3 px-6"><button onClick={() => deleteAssignment(a.id).then(load)} className="text-xs font-bold" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt mr-1"></i>Delete</button></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Assignment</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label><input required name="title" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. React Components Lab" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Course</label><input name="course" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Web Development" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Type</label><select name="type" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Individual</option><option>Group</option><option>Lab</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Due Date</label><input name="dueDate" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. 20 Apr 2025" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Points</label><input name="points" type="number" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="100" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Pending</option><option>In Progress</option><option>Graded</option></select></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Progress %</label><input name="progress" type="number" min="0" max="100" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="0" /></div>
              </div>
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
