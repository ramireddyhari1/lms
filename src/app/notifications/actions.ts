'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  try {
    return await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createNotification(formData: FormData) {
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const type = formData.get('type') as string || 'system'
  const userId = formData.get('userId') as string || null

  if (!title || !message) return { error: 'Title and Message are required' }

  try {
    await prisma.notification.create({
      data: { title, message, type, userId }
    })
    revalidatePath('/notifications')
    return { success: true }
  } catch (error) {
    console.error('Failed to create notification:', error)
    return { error: 'Failed to create notification' }
  }
}

export async function deleteNotification(id: string) {
  try {
    await prisma.notification.delete({ where: { id } })
    revalidatePath('/notifications')
    return { success: true }
  } catch { return { error: 'Failed to delete notification' } }
}

export async function markNotificationRead(id: string) {
  try {
    await prisma.notification.update({ where: { id }, data: { unread: false } })
    revalidatePath('/notifications')
    return { success: true }
  } catch { return { error: 'Failed to update notification' } }
}
