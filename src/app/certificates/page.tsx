'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getCertificates, createCertificate, deleteCertificate } from './actions'
import EmptyState from '@/components/EmptyState'

export default function CertificatesPage() {
  const { isAdmin, user } = useRole()
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  const load = async () => { setCertificates(await getCertificates()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createCertificate(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  const filtered = certificates.filter(c => filter === 'all' || c.category === filter)

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  const earned = certificates.filter(c => c.status === 'earned').length
  const inProgress = certificates.filter(c => c.status === 'progress').length

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Certificates & Credentials
          </h2>
          <p className="mt-2 ml-5 font-semibold" style={{ color: '#64748b' }}>Track your certifications and learning progress.</p>
        </div>
        {isAdmin && <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"><i className="fas fa-plus-circle"></i> Add Certificate</button>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className="fas fa-certificate"></i></div>
          <div><div className="text-2xl font-bold" style={{ color: '#1e293b' }}>{certificates.length}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Total</div></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}><i className="fas fa-award"></i></div>
          <div><div className="text-2xl font-bold" style={{ color: '#1e293b' }}>{earned}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>Earned</div></div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border flex items-center gap-4" style={{ borderColor: '#e2e8f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><i className="fas fa-spinner"></i></div>
          <div><div className="text-2xl font-bold" style={{ color: '#1e293b' }}>{inProgress}</div><div className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>In Progress</div></div>
        </div>
      </div>

      {/* Filters */}
      {certificates.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {['all', 'programs', 'courses', 'skills'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-full text-sm font-medium border capitalize transition-all" style={{ backgroundColor: filter === f ? '#2563eb' : '#fff', color: filter === f ? '#fff' : '#475569', borderColor: filter === f ? '#2563eb' : '#e2e8f0' }}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
      )}

      {/* Certificates */}
      {certificates.length === 0 ? (
        <EmptyState icon="fa-award" title="No Certificates Yet" description="Certificates will appear here as you complete courses and programs." actionLabel={isAdmin ? 'Add Certificate' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(cert => (
            <div key={cert.id} className="bg-white rounded-2xl p-6 shadow-sm border hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col" style={{ borderColor: '#e2e8f0' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className={cert.icon || 'fas fa-certificate'}></i></div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: cert.status === 'earned' ? '#ecfdf5' : '#fffbeb', color: cert.status === 'earned' ? '#059669' : '#d97706' }}>{cert.status === 'earned' ? 'Earned' : 'In Progress'}</span>
              </div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#1e293b' }}>{cert.title}</h3>
              <p className="text-sm mb-3" style={{ color: '#64748b' }}>{cert.issuer}</p>
              <div className="text-xs mb-4" style={{ color: '#94a3b8' }}>{cert.date}</div>
              {cert.status === 'progress' && (
                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-1"><span style={{ color: '#64748b' }}>Progress</span><span className="font-bold" style={{ color: '#2563eb' }}>{cert.progress}%</span></div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}><div className="h-full rounded-full" style={{ width: `${cert.progress}%`, backgroundColor: '#2563eb' }}></div></div>
                </div>
              )}
              {cert.credId && <div className="text-xs mt-2" style={{ color: '#94a3b8' }}>Credential: {cert.credId}</div>}
              {isAdmin && <button onClick={() => deleteCertificate(cert.id).then(load)} className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i> Remove</button>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="fa-filter" title="No Matching Certificates" description="No certificates match the current filter." />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10" style={{ borderColor: '#f1f5f9' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Certificate</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label><input required name="title" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Category</label><select name="category" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option value="programs">Programs</option><option value="courses">Courses</option><option value="skills">Skills</option></select></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Status</label><select name="status" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option value="progress">In Progress</option><option value="earned">Earned</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Issuer</label><input name="issuer" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. FlippedLearn" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Date</label><input name="date" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="Jan 2025" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Progress %</label><input name="progress" type="number" min="0" max="100" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="0" /></div>
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Credential ID</label><input name="credId" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} /></div>
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
