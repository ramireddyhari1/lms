'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentUser: { username: string, role: string } | null
}

export default function DashboardLayout({ children, currentUser }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev)
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar isCollapsed={isCollapsed} />
      <Navbar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} currentUser={currentUser} />
      
      {/* Main Content Area */}
      <main className={`transition-all duration-300 pt-[84px] px-6 pb-6 ${
        isCollapsed ? 'ml-[70px]' : 'ml-[280px]'
      }`}>
        {children}
      </main>
    </div>
  )
}
