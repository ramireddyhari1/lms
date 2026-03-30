'use client'

import { useState, useEffect } from 'react'
import { getUsers, createUser, deleteUser, updateUser } from './actions'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [viewingUser, setViewingUser] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    const result = await createUser(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setShowModal(false)
      fetchUsers()
    }
  }

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return
    
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    const result = await updateUser(editingUser.id, formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setEditingUser(null)
      fetchUsers()
    }
  }

  const handleOpenDetails = (user: any) => {
    setViewingUser(user)
  }

  const handleDeleteUser = async (id: string, username: string) => {
    if (username === 'admin') {
      alert('Cannot delete the primary administrator account.')
      return
    }
    
    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      const result = await deleteUser(id)
      if (result?.error) {
        alert(result.error)
      } else {
        fetchUsers()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1e293b' }}>User Management</h2>
          <p className="text-sm mt-1" style={{ color: '#64748b' }}>Create and manage access for students and administrators.</p>
        </div>
        <button 
          onClick={() => { setError(null); setShowModal(true); }}
          className="btn-primary-gradient shadow-lg"
        >
          <i className="fas fa-plus mr-2"></i>
          Create User
        </button>
      </div>

      <div className="glass-card shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="py-4 px-6 font-semibold" style={{ color: '#1e293b' }}>User</th>
                <th className="py-4 px-6 font-semibold" style={{ color: '#1e293b' }}>Role</th>
                <th className="py-4 px-6 font-semibold" style={{ color: '#1e293b' }}>Status</th>
                <th className="py-4 px-6 font-semibold text-right" style={{ color: '#1e293b' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 uppercase">
                        {(user.fullName || user.username).charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800" style={{ color: '#1e293b' }}>{user.fullName || 'No Name'}</div>
                        <div className="text-xs text-slate-500 font-medium">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider ${user.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span> {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right flex justify-end gap-3 items-center">
                    <button 
                      onClick={() => handleOpenDetails(user)}
                      className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <i className="fas fa-eye mr-1"></i> Details
                    </button>
                    <div className="w-px h-4 bg-slate-200"></div>
                    <button 
                      onClick={() => setEditingUser(user)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <i className="fas fa-edit mr-1"></i> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e293b' }}>Create New User</h3>
            
            {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-2">
                 <i className="fas fa-exclamation-circle"></i> {error}
               </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Full Name</label>
                  <input name="fullName" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="e.g. John Smith"/>
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Username</label>
                  <input required name="username" type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="johndoe"/>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Role</label>
                  <select name="role" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 bg-white font-medium" style={{ color: '#1e293b' }}>
                    <option value="user">Student User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Email</label>
                  <input name="email" type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="john@example.com"/>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Phone</label>
                  <input name="phone" type="tel" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="+1 234 567 890"/>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Password</label>
                  <input required name="password" type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="••••••••"/>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3.5 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => { setEditingUser(null); setError(null); }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e293b' }}>Update User</h3>
            
            {error && (
               <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-center gap-2">
                 <i className="fas fa-exclamation-circle"></i> {error}
               </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Full Name</label>
                  <input name="fullName" type="text" defaultValue={editingUser.fullName} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Username</label>
                  <input required name="username" type="text" defaultValue={editingUser.username} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Role</label>
                  <select name="role" defaultValue={editingUser.role} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 bg-white font-medium" style={{ color: '#1e293b' }}>
                    <option value="user">Student User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Email</label>
                  <input name="email" type="email" defaultValue={editingUser.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Phone</label>
                  <input name="phone" type="tel" defaultValue={editingUser.phone} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>Status</label>
                  <select name="status" defaultValue={editingUser.status} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 bg-white font-medium" style={{ color: '#1e293b' }}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 ml-1" style={{ color: '#64748b' }}>New Password (Optional)</label>
                  <input name="password" type="password" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium" style={{ color: '#1e293b' }} placeholder="Leave blank to keep current"/>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => { setEditingUser(null); setError(null); }} className="flex-1 py-3.5 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-0 shadow-2xl relative animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-500 text-white relative">
              <button 
                onClick={() => setViewingUser(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold border border-white/30 shadow-xl uppercase">
                  {(viewingUser.fullName || viewingUser.username).charAt(0)}
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold m-0 leading-tight">{viewingUser.fullName || 'No Full Name Set'}</h3>
                  <div className="flex items-center gap-3 mt-2 opacity-90 font-medium">
                    <span>@{viewingUser.username}</span>
                    <span className="opacity-40">•</span>
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider">{viewingUser.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-100">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Email Address</div>
                        <div className="text-sm font-bold text-slate-800">{viewingUser.email || 'Not Provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-100">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Phone Number</div>
                        <div className="text-sm font-bold text-slate-800">{viewingUser.phone || 'Not Provided'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account Metadata</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-100">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Member Since</div>
                        <div className="text-sm font-bold text-slate-800">{new Date(viewingUser.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 border border-slate-100">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Account Status</div>
                        <div className="text-sm font-bold text-emerald-600 uppercase">{viewingUser.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex justify-between items-center">
                   <span>Performance & Activity</span>
                   <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded italic">Simulated Data</span>
                 </h4>
                 <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                     <div className="text-2xl font-extrabold text-blue-600">82%</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Avg Score</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                     <div className="text-2xl font-extrabold text-blue-600">12</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Courses</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                     <div className="text-2xl font-extrabold text-blue-600">450h</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">Learning</div>
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
               <button 
                 onClick={() => { setViewingUser(null); setEditingUser(viewingUser); }}
                 className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-blue-600 hover:bg-slate-50 transition-colors shadow-sm"
               >
                 Edit Profile
               </button>
               <button 
                 onClick={() => setViewingUser(null)}
                 className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
