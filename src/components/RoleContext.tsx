'use client'

import React, { createContext, useContext } from 'react'

interface User {
  id: string
  username: string
  role: string
}

interface RoleContextType {
  user: User | null
  isAdmin: boolean
}

const RoleContext = createContext<RoleContextType>({
  user: null,
  isAdmin: false,
})

export const RoleProvider = ({ children, user }: { children: React.ReactNode, user: User | null }) => {
  const isAdmin = user?.role === 'admin'

  return (
    <RoleContext.Provider value={{ user, isAdmin }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)
