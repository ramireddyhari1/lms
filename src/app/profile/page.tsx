'use client'

import { useRole } from '@/components/RoleContext'

export default function ProfilePage() {
  const { user } = useRole()

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      
      {/* Banner & Header Section */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border mb-6" style={{ borderColor: '#e2e8f0' }}>
        <div className="h-48 w-full relative" style={{ background: 'linear-gradient(to right, #2563eb, #6366f1, #9333ea)' }}>
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-light" style={{ background: 'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)', color: '#94a3b8' }}>
                <i className="fas fa-user"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold m-0 leading-tight" style={{ color: '#1e293b' }}>{user?.username || 'User'}</h1>
              <p className="text-lg font-bold mt-1" style={{ color: '#475569' }}>
                {user?.role === 'admin' ? 'Platform Administrator' : 'Student'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <i className="fas fa-user-circle" style={{ color: '#3b82f6' }}></i> About
            </h2>
            <div className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              <p>Welcome to your profile. Update your details and track your learning journey from here.</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <i className="fas fa-id-card" style={{ color: '#3b82f6' }}></i> Account Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}><i className="fas fa-user"></i></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Username</div>
                  <div className="font-bold" style={{ color: '#1e293b' }}>@{user?.username}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}><i className="fas fa-shield-alt"></i></div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Role</div>
                  <div className="font-bold capitalize" style={{ color: '#1e293b' }}>{user?.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl p-8 text-white relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(to bottom right, #2563eb, #4338ca)' }}>
            <div className="absolute -right-4 -top-4 text-7xl opacity-10"><i className="fas fa-user-graduate"></i></div>
            <h3 className="text-lg font-bold mb-2 relative z-10">Your Learning Journey</h3>
            <p className="text-sm mb-4 relative z-10 opacity-90">Track your progress, earn certificates, and build your portfolio.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
