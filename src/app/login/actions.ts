'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  try {
    // Find the user in the SQLite database
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return { error: 'Invalid username or password' }
    }

    // Verify the hashed password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return { error: 'Invalid username or password' }
    }

    // Authentication successful, set the session cookie
    const cookieStore = await cookies()
    cookieStore.set('currentUser', JSON.stringify({ id: user.id, username: user.username, role: user.role }), {
      httpOnly: false, // Accessible to client components if needed
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'An error occurred during login. Please try again.' }
  }

  // Redirect to dashboard
  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('currentUser')
  redirect('/login')
}
