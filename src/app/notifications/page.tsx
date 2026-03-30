'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getNotifications, createNotification, deleteNotification } from './actions'
import EmptyState from '@/components/EmptyState'

export default function NotificationsPage() {
  const { isAdmin, user } = useRole()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => { setNotifications(await getNotifications()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget)
    const r = await createNotification(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  if (loading) return <div className="w-full max-w-4xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Notifications
          </h2>
          <p className="mt-2 ml-5" style={{ color: '#64748b' }}>Stay updated with the latest platform activities.</p>
        </div>
        {isAdmin && <button onClick={() => { setError(null); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2"><i className="fas fa-plus-circle"></i> Send Notification</button>}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon="fa-bell-slash" title="No Notifications" description="You're all caught up! Notifications will appear here." actionLabel={isAdmin ? 'Send Notification' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif.id} className="bg-white rounded-2xl p-6 border transition-all hover:shadow-md flex gap-4 items-start" style={{ borderColor: notif.unread ? '#bfdbfe' : '#f1f5f9' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl" style={{
                backgroundColor: notif.type === 'system' ? '#eff6ff' : notif.type === 'placement' ? '#ecfdf5' : '#faf5ff',
                color: notif.type === 'system' ? '#2563eb' : notif.type === 'placement' ? '#059669' : '#9333ea'
              }}>
                <i className={`fas ${notif.type === 'system' ? 'fa-bell' : notif.type === 'placement' ? 'fa-briefcase' : 'fa-user'}`}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold m-0" style={{ color: '#1e293b' }}>{notif.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm leading-relaxed mb-0" style={{ color: '#475569' }}>{notif.message}</p>
              </div>
              {notif.unread && <div className="w-2.5 h-2.5 rounded-full mt-2" style={{ backgroundColor: '#2563eb', boxShadow: '0 0 10px rgba(37,99,235,0.4)' }}></div>}
              {isAdmin && <button onClick={() => deleteNotification(notif.id).then(load)} className="text-xs font-bold shrink-0 mt-1" style={{ color: '#ef4444' }}><i className="fas fa-trash-alt"></i></button>}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1e293b' }}><i className="fas fa-paper-plane" style={{ color: '#2563eb' }}></i> Send Notification</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label><input required name="title" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Schedule Update" /></div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Type</label><select name="type" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}><option value="system">System Update</option><option value="placement">Placement Drive</option><option value="user">User Action</option></select></div>
              <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Message *</label><textarea required name="message" rows={4} className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="Enter the notification content..."></textarea></div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold border" style={{ color: '#475569', borderColor: '#e2e8f0' }}>Cancel</button>
                <button type="submit" className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold shadow-md">Send Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
