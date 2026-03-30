'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAssignments() {
  try {
    return await prisma.assignment.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createAssignment(formData: FormData) {
  const title = formData.get('title') as string
  const type = formData.get('type') as string || 'Individual'
  const course = formData.get('course') as string
  const dueDate = formData.get('dueDate') as string
  const points = parseInt(formData.get('points') as string) || 100
  const progress = parseInt(formData.get('progress') as string) || 0
  const status = formData.get('status') as string || 'Pending'
  const userId = formData.get('userId') as string

  if (!title || !userId) return { error: 'Title and User are required' }

  try {
    await prisma.assignment.create({
      data: { title, type, course, dueDate, points, progress, status, userId }
    })
    revalidatePath('/assignment')
    return { success: true }
  } catch (error) {
    console.error('Failed to create assignment:', error)
    return { error: 'Failed to create assignment' }
  }
}

export async function deleteAssignment(id: string) {
  try {
    await prisma.assignment.delete({ where: { id } })
    revalidatePath('/assignment')
    return { success: true }
  } catch { return { error: 'Failed to delete assignment' } }
}
