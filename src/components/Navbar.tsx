'use client'

import { logout } from '@/app/login/actions'
import Link from 'next/link'

interface NavbarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
  currentUser: { username: string, role: string } | null
}

export default function Navbar({ isCollapsed, toggleSidebar, currentUser }: NavbarProps) {
  return (
    <nav className={`fixed top-0 right-0 h-[64px] transition-all duration-300 z-40 bg-white/75 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-b border-white/40 px-5 flex items-center justify-between ${
      isCollapsed ? 'left-[70px]' : 'left-[280px]'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-blue-600/10 transition-colors text-xl"
          style={{ color: '#2563eb' }}
        >
          <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-bars'}`}></i>
        </button>
        <div className="font-bold text-xl" style={{ color: '#2563eb' }}>Learner360°</div>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Link if applicable */}
        {currentUser?.role === 'admin' && (
          <Link href="/admin/users" className="px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors" style={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
            <i className="fas fa-shield-alt mr-2"></i>Admin Panel
          </Link>
        )}

        {/* Notifications */}
        <div className="relative group cursor-pointer p-2 transition-colors" style={{ color: '#475569' }}>
          <i className="fas fa-bell text-lg group-hover:text-[#2563eb]"></i>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">3</span>
        </div>

        {/* Profile */}
        <div className="group relative cursor-pointer flex items-center gap-2 font-medium transition-colors p-2" style={{ color: '#475569' }}>
          <i className="fas fa-user-circle text-xl group-hover:text-[#2563eb]"></i>
          <span className="group-hover:text-[#2563eb]">{currentUser?.username || 'User'}</span>
          
          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
            <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">
              <i className="fas fa-user mr-2 w-4"></i> Profile
            </Link>
            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600">
              <i className="fas fa-cog mr-2 w-4"></i> Settings
            </a>
            <div className="h-px bg-slate-100 my-1"></div>
            <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <i className="fas fa-sign-out-alt mr-2 w-4"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
