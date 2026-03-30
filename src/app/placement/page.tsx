'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getJobListings, createJobListing, deleteJobListing } from './actions'
import EmptyState from '@/components/EmptyState'

export default function PlacementPage() {
  const { isAdmin } = useRole()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => { setJobs(await getJobListings()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget)
    const r = await createJobListing(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Placement Portal
          </h2>
          <p className="mt-2 ml-5 font-semibold" style={{ color: '#64748b' }}>Explore placement opportunities and track your applications.</p>
        </div>
        {isAdmin && <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"><i className="fas fa-plus-circle"></i> Add Job Listing</button>}
      </div>

      {/* Jobs */}
      {jobs.length === 0 ? (
        <EmptyState icon="fa-briefcase" title="No Job Listings Yet" description="Placement opportunities will appear here when they are posted." actionLabel={isAdmin ? 'Add Job Listing' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr style={{ borderBottom: '2px solid #f1f5f9', backgroundColor: '#fafbfc' }}>
                <th className="py-4 px-6 font-semibold" style={{ color: '#475569' }}>Company</th>
                <th className="py-4 px-6 font-semibold" style={{ color: '#475569' }}>Role</th>
                <th className="py-4 px-6 font-semibold" style={{ color: '#475569' }}>Location</th>
                <th className="py-4 px-6 font-semibold" style={{ color: '#475569' }}>Salary</th>
                <th className="py-4 px-6 font-semibold text-center" style={{ color: '#475569' }}>Status</th>
                {isAdmin && <th className="py-4 px-6 font-semibold text-center" style={{ color: '#475569' }}>Actions</th>}
              </tr></thead>
              <tbody>{jobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors" style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className="fas fa-building"></i></div>
                      <span className="font-bold" style={{ color: '#1e293b' }}>{job.company}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-medium" style={{ color: '#334155' }}>{job.role}</td>
                  <td className="py-4 px-6" style={{ color: '#64748b' }}><i className="fas fa-map-marker-alt mr-1" style={{ color: '#94a3b8' }}></i>{job.location}</td>
                  <td className="py-4 px-6 font-bold" style={{ color: '#059669' }}>{job.salary}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: job.status === 'Applied' ? '#eff6ff' : job.status === 'Selected' ? '#ecfdf5' : '#f8fafc', color: job.status === 'Applied' ? '#2563eb' : job.status === 'Selected' ? '#059669' : '#64748b' }}>{job.status}</span>
                  </td>
                  {isAdmin && <td className="py-4 px-6 text-center"><button onClick={() => deleteJobListing(job.id).then(load)} className="text-xs font-bold" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt mr-1"></i>Delete</button></td>}
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
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Job Listing</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Company *</label><input required name="company" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Role *</label><input required name="role" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Location</label><input name="location" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Hyderabad" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Salary</label><input name="salary" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. ₹6 LPA" /></div>
              </div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option>Not Applied</option><option>Applied</option><option>Selected</option></select></div>
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
