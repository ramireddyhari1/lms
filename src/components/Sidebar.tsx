'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useRole } from './RoleContext'

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'fa-tachometer-alt' },
  { name: 'Learning', path: '/learner', icon: 'fa-graduation-cap' },
  { name: 'Assessment', path: '/assessment', icon: 'fa-clipboard-check' },
  { name: 'Assignment', path: '/assignment', icon: 'fa-clipboard-list' },
  { name: 'Projects', path: '/project', icon: 'fa-project-diagram' },
  { name: 'Program', path: '/program', icon: 'fa-book' },
  { name: 'Logbook', path: '/logbook', icon: 'fa-book-open' },
  { name: 'Placement', path: '/placement', icon: 'fa-briefcase' },
  { name: 'Reports', path: '/report', icon: 'fa-chart-bar' },
  { name: 'Certificates', path: '/certificates', icon: 'fa-certificate' },
  { name: 'Notifications', path: '/notifications', icon: 'fa-bell' },
  { name: 'Profile', path: '/profile', icon: 'fa-user' },
  { name: 'Help & Support', path: '/support', icon: 'fa-headset' },
]

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname()
  const { isAdmin } = useRole()

  return (
    <div className={`fixed left-0 top-0 h-screen transition-all duration-300 z-50 flex flex-col bg-white/75 backdrop-blur-md border-r border-white/40 shadow-[4px_0_12px_rgba(0,0,0,0.05)] ${
      isCollapsed ? 'w-[70px]' : 'w-[280px]'
    }`}>
      {/* Sidebar Header */}
      <div className={`p-3 border-b border-white/40 mb-2 flex-shrink-0 ${isCollapsed ? 'py-5 text-center' : ''}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 flex-shrink-0 relative">
             {/* Using an icon instead of raw image path to ensure build doesn't fail if asset is missing, replace later with Next Image */}
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <span className="text-white font-bold text-lg">F</span>
             </div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#4361ee] leading-tight">Flippedlearn</span>
              <span className="text-xs text-[#7209b7] font-medium tracking-wide">Empower.Educate.Employ</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-2">
        <ul className="flex flex-col gap-1 pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600/10 font-semibold' 
                      : 'hover:bg-slate-100/50'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  style={{ color: isActive ? '#4361ee' : '#64748b' }}
                  title={isCollapsed ? item.name : ''}
                >
                  <i className={`fas ${item.icon} ${isCollapsed ? 'text-lg m-0' : 'w-5 mr-3 text-center'}`} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            )
          })}
          {isAdmin && (
            <li className="mt-4 pt-4 border-t border-slate-100">
              <Link
                href="/admin/users"
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                  pathname === '/admin/users' 
                    ? 'bg-purple-600/10 font-semibold' 
                    : 'hover:bg-purple-50'
                } ${isCollapsed ? 'justify-center' : ''}`}
                style={{ color: pathname === '/admin/users' ? '#9333ea' : '#64748b' }}
                title={isCollapsed ? 'Admin' : ''}
              >
                <i className={`fas fa-user-shield ${isCollapsed ? 'text-lg m-0' : 'w-5 mr-3 text-center'}`} />
                {!isCollapsed && <span>Admin Panel</span>}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
