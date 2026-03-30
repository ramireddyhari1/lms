'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getCourses, createCourse, deleteCourse } from './actions'
import { getUsers } from '@/app/admin/users/actions'
import EmptyState from '@/components/EmptyState'

export default function LearnerPage() {
  const { isAdmin, user } = useRole()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usersList, setUsersList] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const loadCourses = async () => {
    const data = await getCourses()
    setCourses(data)
    setLoading(false)
  }

  useEffect(() => { 
    loadCourses()
    if (isAdmin) {
      getUsers().then(setUsersList)
    }
  }, [isAdmin])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    if (!formData.get('userId')) {
      formData.set('userId', user?.id || '')
    }
    const result = await createCourse(formData)
    if (result?.error) setError(result.error)
    else { setShowAddModal(false); loadCourses() }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this course?')) {
      await deleteCourse(id)
      loadCourses()
    }
  }

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm gap-4" style={{ background: 'linear-gradient(to right, rgba(239,246,255,0.8), rgba(238,242,255,0.8))' }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold m-0" style={{ color: '#1e293b' }}>My Learning</h1>
          <p className="font-semibold mt-1" style={{ color: '#475569' }}>Track and continue your enrolled courses.</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setError(null); setSelectedUsers([]); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Add Course
          </button>
        )}
      </div>

      {/* Courses */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer group flex flex-col">
              <div className="relative overflow-hidden h-44 w-full">
                {course.image && !course.image.toLowerCase().endsWith('.pdf') ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : course.image && course.image.toLowerCase().endsWith('.pdf') ? (
                  <a href={course.image} target="_blank" rel="noopener noreferrer" className="relative z-10 w-full h-full flex flex-col items-center justify-center bg-red-50 group-hover:bg-red-100 transition-colors">
                    <i className="fas fa-file-pdf text-5xl text-red-500 group-hover:scale-110 transition-transform duration-700"></i>
                    <span className="text-sm font-bold text-red-600 mt-2">View Syllabus / PDF</span>
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4361ee, #3a0ca3)' }}>
                    <i className="fas fa-book text-4xl text-white/60 group-hover:scale-110 transition-transform duration-700"></i>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-3 left-3 rounded-lg text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider shadow-sm pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#1e293b' }}>
                  {course.category}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-3 leading-tight" style={{ color: '#1e293b' }}>{course.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold mb-4" style={{ color: '#64748b' }}>
                  <span className="flex items-center gap-1.5"><i className="far fa-clock" style={{ color: '#3b82f6' }}></i> {course.duration}</span>
                  <span className="flex items-center gap-1.5"><i className="far fa-file-video" style={{ color: '#8b5cf6' }}></i> {course.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold" style={{ color: '#4d5c6b' }}>{course.instructor}</span>
                </div>
                <div className="mt-auto pt-4 border-t" style={{ borderColor: '#f1f5f9' }}>
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider" style={{ backgroundColor: course.status === 'completed' ? '#ecfdf5' : course.status === 'ongoing' ? '#eff6ff' : '#f8fafc', color: course.status === 'completed' ? '#059669' : course.status === 'ongoing' ? '#2563eb' : '#64748b' }}>
                      {course.status}
                    </span>
                    <span className="font-bold" style={{ color: '#1e293b' }}>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${course.progress}%`, backgroundColor: course.status === 'completed' ? '#10b981' : '#2563eb' }}></div>
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(course.id)} className="mt-3 text-xs font-bold flex items-center gap-1" style={{ color: '#ef4444' }}>
                    <i className="fas fa-trash-alt"></i> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="fa-book-open" title="No Courses Yet" description="No learning materials have been added. Admins can add courses to get started." actionLabel={isAdmin ? 'Add First Course' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1e293b' }}>
                <i className="fas fa-plus-circle" style={{ color: '#2563eb' }}></i> Add Course
              </h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ color: '#64748b' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}><i className="fas fa-exclamation-circle mr-2"></i>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Title *</label>
                <input required name="title" type="text" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Advanced React" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Category</label>
                  <input name="category" type="text" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Frontend" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Level</label>
                  <select name="level" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }}>
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Duration</label>
                  <input name="duration" type="text" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. 8h 45m" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Lessons</label>
                  <input name="lessons" type="number" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. 42" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Instructor</label>
                  <input name="instructor" type="text" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Sarah Drasner" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Assign To Users</label>
                  <div className="border rounded-lg bg-white p-2 max-h-32 overflow-y-auto flex flex-col gap-1 shadow-inner" style={{ borderColor: '#e2e8f0' }}>
                    <label className="flex items-center gap-3 p-1.5 hover:bg-slate-50 cursor-pointer rounded-md transition-colors">
                      <input type="checkbox" checked={selectedUsers.includes('ALL')} onChange={(e) => setSelectedUsers(e.target.checked ? ['ALL'] : [])} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#3b82f6' }} />
                      <span className="text-sm font-bold" style={{ color: '#1e293b' }}>Assign to ALL Users</span>
                    </label>
                    <div className="my-1 border-t" style={{ borderColor: '#f1f5f9' }}></div>
                    {usersList.map((u: any) => (
                      <label key={u.id} className="flex items-center gap-3 p-1.5 hover:bg-slate-50 cursor-pointer rounded-md transition-colors">
                        <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={(e) => {
                          if (e.target.checked) setSelectedUsers(prev => prev.filter(v => v !== 'ALL').concat(u.id))
                          else setSelectedUsers(prev => prev.filter(v => v !== u.id))
                        }} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#3b82f6' }} />
                        <span className="text-sm font-medium" style={{ color: '#475569' }}>{u.fullName || u.username} ({u.role})</span>
                      </label>
                    ))}
                    {usersList.length === 0 && <span className="text-xs italic px-2" style={{ color: '#94a3b8' }}>Loading users...</span>}
                  </div>
                  <input type="hidden" name="userIds" value={JSON.stringify(selectedUsers)} />
                  <p className="text-[10px] italic mt-1" style={{ color: '#64748b' }}>Leave unchecked to assign only to yourself.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Upload Image or PDF</label>
                <input name="image" type="file" accept="image/*,application/pdf" className="w-full px-4 py-2 border rounded-lg text-sm bg-white" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold border" style={{ color: '#475569', borderColor: '#e2e8f0' }}>Cancel</button>
                <button type="submit" className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold shadow-md">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
