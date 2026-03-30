'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function getCourses() {
  try {
    return await prisma.course.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createCourse(formData: FormData) {
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const level = formData.get('level') as string
  const duration = formData.get('duration') as string
  const lessons = parseInt(formData.get('lessons') as string) || 0
  const instructor = formData.get('instructor') as string
  const progress = parseInt(formData.get('progress') as string) || 0
  const status = formData.get('status') as string || 'upcoming'
  const file = formData.get('image') as File | null
  const userId = formData.get('userId') as string
  const userIdsRaw = formData.get('userIds') as string

  if (!title || (!userId && !userIdsRaw)) return { error: 'Title and User are required' }

  let imagePath = null

  if (file && file.size > 0 && file.name) {
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadDir = join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      imagePath = `/uploads/${filename}`
    } catch (e) {
      console.error('Failed to upload file:', e)
    }
  }

  try {
    let idsToAssign: string[] = userIdsRaw ? JSON.parse(userIdsRaw) : []
    if (userId && !idsToAssign.includes(userId)) idsToAssign.push(userId)

    if (idsToAssign.includes('ALL')) {
      const allUsers = await prisma.user.findMany({ select: { id: true } })
      idsToAssign = allUsers.map(u => u.id)
    }

    const dataToInsert = idsToAssign.map(uid => ({
      title, category, level, duration, lessons, instructor, progress, status, image: imagePath, userId: uid
    }))

    if (dataToInsert.length > 0) {
      await prisma.course.createMany({ data: dataToInsert })
    }

    revalidatePath('/learner')
    return { success: true }
  } catch (error) {
    console.error('Failed to create course:', error)
    return { error: 'Failed to create course' }
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/learner')
    return { success: true }
  } catch { return { error: 'Failed to delete course' } }
}
