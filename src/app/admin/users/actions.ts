'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
  }
}

export async function createUser(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const status = (formData.get('status') as string) || 'active'

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        fullName,
        email,
        phone,
        status,
      }
    })
    
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Username already exists' }
    }
    console.error('Failed to create user:', error)
    return { error: 'Failed to create user' }
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete user:', error)
    return { error: 'Failed to delete user' }
  }
}

export async function updateUser(id: string, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const status = formData.get('status') as string

  if (!username) {
    return { error: 'Username is required' }
  }

  try {
    const data: any = {
      username,
      role,
      fullName,
      email,
      phone,
      status,
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id },
      data
    })
    
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Username already exists' }
    }
    console.error('Failed to update user:', error)
    return { error: 'Failed to update user' }
  }
}

export async function getUserDetails(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    return null
  }
}
