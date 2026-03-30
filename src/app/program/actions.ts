'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPrograms() {
  try {
    return await prisma.program.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createProgram(formData: FormData) {
  const title = formData.get('title') as string
  const type = formData.get('type') as string || 'Industrial Training'
  const status = formData.get('status') as string || 'active'
  const batch = formData.get('batch') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string
  const duration = formData.get('duration') as string
  const progress = parseInt(formData.get('progress') as string) || 0
  const mentor = formData.get('mentor') as string
  const skills = formData.get('skills') as string
  const employer = formData.get('employer') as string
  const userId = formData.get('userId') as string

  if (!title || !userId) return { error: 'Title and User are required' }

  try {
    await prisma.program.create({
      data: { title, type, status, batch, startDate, endDate, duration, progress, mentor, skills, employer, userId }
    })
    revalidatePath('/program')
    return { success: true }
  } catch (error) {
    console.error('Failed to create program:', error)
    return { error: 'Failed to create program' }
  }
}

export async function deleteProgram(id: string) {
  try {
    await prisma.program.delete({ where: { id } })
    revalidatePath('/program')
    return { success: true }
  } catch { return { error: 'Failed to delete program' } }
}
