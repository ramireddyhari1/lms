'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getDashboardStats, getRecentCourses, getRecentNotifications } from './actions'

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [s, c, n] = await Promise.all([getDashboardStats(), getRecentCourses(), getRecentNotifications()])
      setStats(s)
      setCourses(c)
      setNotifications(n)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20">
        <i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white/75 rounded-2xl border border-white/40 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>Dashboard</h1>
          <p className="text-sm m-0" style={{ color: '#64748b' }}>Welcome back! Here's your learning overview</p>
        </div>
      </div>

      {/* Row 1: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card flex flex-col items-center justify-center p-5 text-center min-h-[140px] hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
            <i className="fas fa-chart-line text-xl"></i>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#2563eb' }}>{stats?.overallProgress || 0}%</div>
          <div className="text-sm font-medium" style={{ color: '#64748b' }}>Overall Progress</div>
        </div>

        <div className="clay-card flex flex-col items-center justify-center p-5 text-center min-h-[140px] hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            <i className="fas fa-book text-xl"></i>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#10b981' }}>{stats?.totalCourses || 0}</div>
          <div className="text-sm font-medium" style={{ color: '#64748b' }}>Courses</div>
        </div>

        <div className="frost-card flex flex-col items-center justify-center p-5 text-center min-h-[140px] hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            <i className="fas fa-tasks text-xl"></i>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>{stats?.pendingAssignments || 0}</div>
          <div className="text-sm font-medium" style={{ color: '#64748b' }}>Tasks Due</div>
        </div>

        <div className="glass-card flex flex-col items-center justify-center p-5 text-center min-h-[140px] hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(8,145,178,0.1)', color: '#0891b2' }}>
            <i className="fas fa-certificate text-xl"></i>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#0891b2' }}>{stats?.totalCertificates || 0}</div>
          <div className="text-sm font-medium" style={{ color: '#64748b' }}>Certificates</div>
        </div>

      </div>

      {/* Row 2: Active Courses */}
      <div className="frost-card p-6">
        <h4 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#1e293b' }}>
          <i className="fas fa-list-check mr-3" style={{ color: '#94a3b8' }}></i> Active Courses
        </h4>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course: any) => (
              <Link href="/learner" key={course.id} className="block w-full h-full">
                <div className="clay-card p-5 h-full flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <h6 className="text-lg font-semibold mb-3 flex items-center" style={{ color: '#1e293b' }}>
                      <i className="fas fa-code mr-2" style={{ color: '#2563eb' }}></i> {course.title}
                    </h6>
                    <div className="progress-bar-shared h-2 mb-3">
                      <div className="progress-fill-shared" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm" style={{ color: '#64748b' }}>{course.lessons} lessons · {course.category}</span>
                    <span className="btn-primary-gradient py-1.5 px-4 text-sm rounded-full">
                      <i className="fas fa-play mr-1"></i> Continue
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10" style={{ color: '#94a3b8' }}>
            <i className="fas fa-book-open text-3xl mb-3 block"></i>
            <p className="font-medium" style={{ color: '#64748b' }}>No active courses yet. Enroll in a course to get started!</p>
          </div>
        )}
      </div>

      {/* Row 3: Recent Notifications */}
      <div className="glass-card p-6">
        <h4 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#1e293b' }}>
          <i className="fas fa-bell mr-3" style={{ color: '#94a3b8' }}></i> Recent Notifications
        </h4>
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                  <i className="fas fa-bell"></i>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm" style={{ color: '#1e293b' }}>{n.title}</div>
                  <p className="text-xs" style={{ color: '#64748b' }}>{n.message}</p>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#2563eb' }}></div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8" style={{ color: '#94a3b8' }}>
            <p className="font-medium" style={{ color: '#64748b' }}>No notifications yet.</p>
          </div>
        )}
      </div>

      {/* Row 4: Quick Links */}
      <div className="frost-card p-6">
        <h4 className="text-xl font-bold mb-4 flex items-center" style={{ color: '#1e293b' }}>
          <i className="fas fa-link mr-3" style={{ color: '#94a3b8' }}></i> Quick Links
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <Link href="/placement" className="block group">
            <div className="glass-card flex flex-col items-center justify-center p-5 h-full group-hover:-translate-y-1 transition-transform">
              <i className="fas fa-file-alt text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: '#2563eb' }}></i>
              <h6 className="font-bold" style={{ color: '#1e293b' }}>Resume Builder</h6>
            </div>
          </Link>

          <Link href="/support" className="block group">
            <div className="clay-card flex flex-col items-center justify-center p-5 h-full group-hover:-translate-y-1 transition-transform">
              <i className="fas fa-ticket-alt text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: '#22c55e' }}></i>
              <h6 className="font-bold" style={{ color: '#1e293b' }}>Raise Ticket</h6>
            </div>
          </Link>

          <Link href="/learner" className="block group">
            <div className="frost-card flex flex-col items-center justify-center p-5 h-full group-hover:-translate-y-1 transition-transform">
              <i className="fas fa-book-open text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: '#06b6d4' }}></i>
              <h6 className="font-bold" style={{ color: '#1e293b' }}>My Courses</h6>
            </div>
          </Link>

          <Link href="/project" className="block group">
            <div className="glass-card flex flex-col items-center justify-center p-5 h-full group-hover:-translate-y-1 transition-transform">
              <i className="fas fa-project-diagram text-3xl mb-3 group-hover:scale-110 transition-transform" style={{ color: '#f59e0b' }}></i>
              <h6 className="font-bold" style={{ color: '#1e293b' }}>My Projects</h6>
            </div>
          </Link>

        </div>
      </div>

    </div>
  )
}
