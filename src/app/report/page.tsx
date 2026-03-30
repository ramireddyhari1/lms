'use client'

import { useState, useEffect } from 'react'
import { getDashboardStats } from '../actions'

export default function ReportPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() { setStats(await getDashboardStats()); setLoading(false) }
    load()
  }, [])

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Performance Reports
        </h2>
        <p className="mt-2 ml-5 font-semibold" style={{ color: '#64748b' }}>Comprehensive analysis of your learning journey and key metrics.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#3b82f6' }}></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className="fas fa-book"></i></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>{stats?.totalCourses || 0}</div>
          <div className="text-sm font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Total Courses</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#10b981' }}></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}><i className="fas fa-check-circle"></i></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>{stats?.completedCourses || 0}</div>
          <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>Completed</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#8b5cf6' }}></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}><i className="fas fa-tasks"></i></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>{stats?.overallProgress || 0}%</div>
          <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>Overall Progress</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:-translate-y-1 transition-transform relative overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#f59e0b' }}></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}><i className="fas fa-award"></i></div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1e293b' }}>{stats?.totalCertificates || 0}</div>
          <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>Certificates</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border h-full flex flex-col" style={{ borderColor: '#e2e8f0' }}>
            <h3 className="text-lg font-bold mb-6 m-0" style={{ color: '#1e293b' }}>Progress Summary</h3>
            <div className="flex-1 rounded-xl flex flex-col items-center justify-center p-12 min-h-[300px]" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <i className="fas fa-chart-bar text-6xl mb-4" style={{ color: '#bfdbfe' }}></i>
              <div className="font-medium text-center max-w-sm" style={{ color: '#94a3b8' }}>
                {stats?.totalCourses > 0 ? `You have ${stats.totalCourses} courses with ${stats.overallProgress}% overall completion.` : 'Enroll in courses to start tracking your progress here.'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <i className="fas fa-bolt" style={{ color: '#f59e0b' }}></i> Quick Milestones
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span style={{ color: '#334155' }}>Courses Completed</span>
                  <span style={{ color: '#2563eb' }}>{stats?.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#f1f5f9' }}>
                  <div className="h-full rounded-full" style={{ width: `${stats?.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0}%`, backgroundColor: '#3b82f6' }}></div>
                </div>
                <div className="text-xs font-medium text-right" style={{ color: '#64748b' }}>{stats?.completedCourses || 0} of {stats?.totalCourses || 0} courses</div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span style={{ color: '#334155' }}>Assignments Done</span>
                  <span style={{ color: '#10b981' }}>{stats?.totalAssignments > 0 ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100) : 0}%</span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden mb-2" style={{ backgroundColor: '#f1f5f9' }}>
                  <div className="h-full rounded-full" style={{ width: `${stats?.totalAssignments > 0 ? Math.round((stats.completedAssignments / stats.totalAssignments) * 100) : 0}%`, backgroundColor: '#10b981' }}></div>
                </div>
                <div className="text-xs font-medium text-right" style={{ color: '#64748b' }}>{stats?.completedAssignments || 0} of {stats?.totalAssignments || 0} assignments</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-8 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(to bottom right, #2563eb, #4338ca)' }}>
            <div className="absolute -right-4 -top-4 text-7xl opacity-10"><i className="fas fa-medal"></i></div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Keep going!</h3>
            <p className="text-sm mb-6 relative z-10 opacity-90">Complete more courses and assignments to unlock certificates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
