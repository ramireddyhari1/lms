'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const type = formData.get('type') as string || 'Personal'
  const company = formData.get('company') as string
  const year = formData.get('year') as string
  const status = formData.get('status') as string || 'active'
  const progress = parseInt(formData.get('progress') as string) || 0
  const role = formData.get('role') as string
  const techStack = formData.get('techStack') as string
  const previewImage = formData.get('previewImage') as string
  const userId = formData.get('userId') as string

  if (!title || !userId) return { error: 'Title and User are required' }

  try {
    await prisma.project.create({
      data: { title, subtitle, type, company, year, status, progress, role, techStack, previewImage, userId }
    })
    revalidatePath('/project')
    return { success: true }
  } catch (error) {
    console.error('Failed to create project:', error)
    return { error: 'Failed to create project' }
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } })
    revalidatePath('/project')
    return { success: true }
  } catch { return { error: 'Failed to delete project' } }
}
