'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getLogbookEntries() {
  try {
    return await prisma.logbookEntry.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createLogbookEntry(formData: FormData) {
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const activity = formData.get('activity') as string
  const hours = parseInt(formData.get('hours') as string) || 0
  const supervisor = formData.get('supervisor') as string
  const tasks = parseInt(formData.get('tasks') as string) || 0
  const status = formData.get('status') as string || 'Pending'
  const userId = formData.get('userId') as string

  if (!activity || !userId) return { error: 'Activity and User are required' }

  try {
    await prisma.logbookEntry.create({
      data: { date, time, activity, hours, supervisor, tasks, status, userId }
    })
    revalidatePath('/logbook')
    return { success: true }
  } catch (error) {
    console.error('Failed to create logbook entry:', error)
    return { error: 'Failed to create entry' }
  }
}

export async function deleteLogbookEntry(id: string) {
  try {
    await prisma.logbookEntry.delete({ where: { id } })
    revalidatePath('/logbook')
    return { success: true }
  } catch { return { error: 'Failed to delete entry' } }
}
