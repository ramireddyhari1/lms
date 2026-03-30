'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getLogbookEntries, createLogbookEntry, deleteLogbookEntry } from './actions'
import EmptyState from '@/components/EmptyState'

export default function LogbookPage() {
  const { isAdmin, user } = useRole()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => { setLogs(await getLogbookEntries()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createLogbookEntry(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  const totalHours = logs.reduce((s, l) => s + l.hours, 0)
  const completed = logs.filter(l => l.status === 'Completed').length

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl border shadow-sm backdrop-blur-md gap-4" style={{ background: 'linear-gradient(to right, rgba(239,246,255,0.5), rgba(238,242,255,0.5))', borderColor: 'rgba(255,255,255,0.6)' }}>
        <div>
          <h1 className="text-2xl font-bold m-0 flex items-center gap-3" style={{ color: '#1e293b' }}><i className="fas fa-book-open" style={{ color: '#2563eb' }}></i> My Training Logbook</h1>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Track your daily activities, hours, and supervisor reviews.</p>
        </div>
        {isAdmin && <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md"><i className="fas fa-plus"></i> New Entry</button>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="text-3xl font-bold" style={{ color: '#1e293b' }}>{totalHours}</div>
          <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#64748b' }}>Total Hours</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="text-3xl font-bold" style={{ color: '#1e293b' }}>{completed}</div>
          <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#64748b' }}>Completed</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="text-3xl font-bold" style={{ color: '#1e293b' }}>{logs.filter(l => l.status === 'Pending').length}</div>
          <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: '#64748b' }}>Pending</div>
        </div>
      </div>

      {/* Table */}
      {logs.length === 0 ? (
        <EmptyState icon="fa-book" title="No Logbook Entries" description="Start tracking your training activities by adding your first entry." actionLabel={isAdmin ? 'Add Entry' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr style={{ borderBottom: '2px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
                <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Date</th>
                <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Time</th>
                <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Activity</th>
                <th className="py-3 px-6 font-semibold text-center" style={{ color: '#475569' }}>Hours</th>
                <th className="py-3 px-6 font-semibold" style={{ color: '#475569' }}>Supervisor</th>
                <th className="py-3 px-6 font-semibold text-center" style={{ color: '#475569' }}>Status</th>
                {isAdmin && <th className="py-3 px-6 font-semibold text-center" style={{ color: '#475569' }}>Actions</th>}
              </tr></thead>
              <tbody>{logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="py-3 px-6 font-medium" style={{ color: '#1e293b' }}>{log.date}</td>
                  <td className="py-3 px-6 font-mono" style={{ color: '#64748b' }}>{log.time}</td>
                  <td className="py-3 px-6 font-medium" style={{ color: '#1e293b' }}>{log.activity}</td>
                  <td className="py-3 px-6 text-center font-bold" style={{ color: '#2563eb' }}>{log.hours}</td>
                  <td className="py-3 px-6" style={{ color: '#64748b' }}>{log.supervisor}</td>
                  <td className="py-3 px-6 text-center"><span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase" style={{ backgroundColor: log.status === 'Completed' ? '#ecfdf5' : '#fffbeb', color: log.status === 'Completed' ? '#059669' : '#d97706' }}>{log.status}</span></td>
                  {isAdmin && <td className="py-3 px-6 text-center"><button onClick={() => deleteLogbookEntry(log.id).then(load)} className="text-xs font-bold" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i></button></td>}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus mr-2" style={{ color: '#2563eb' }}></i>New Logbook Entry</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Date</label><input name="date" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="15 Mar 2025" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Time</label><input name="time" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="09:00 - 17:00" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Activity *</label><input required name="activity" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Frontend Development" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Hours</label><input name="hours" type="number" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="8" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Tasks</label><input name="tasks" type="number" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="4" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Supervisor</label><input name="supervisor" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Pending</option><option>Completed</option></select></div>
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
