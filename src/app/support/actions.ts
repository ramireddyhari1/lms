'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTickets(userId?: string) {
  try {
    return await prisma.supportTicket.findMany({
      ...(userId ? { where: { userId } } : {}),
      orderBy: { createdAt: 'desc' }
    })
  } catch { return [] }
}

export async function createTicket(formData: FormData) {
  const subject = formData.get('subject') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const userId = formData.get('userId') as string

  if (!subject || !userId) return { error: 'Subject and User are required' }

  // Auto-generate ticket ID
  const count = await prisma.supportTicket.count()
  const ticketId = `#TKT-${String(count + 1).padStart(4, '0')}`

  try {
    await prisma.supportTicket.create({
      data: { ticketId, subject, description, category, userId }
    })
    revalidatePath('/support')
    return { success: true }
  } catch (error) {
    console.error('Failed to create ticket:', error)
    return { error: 'Failed to create ticket' }
  }
}

export async function deleteTicket(id: string) {
  try {
    await prisma.supportTicket.delete({ where: { id } })
    revalidatePath('/support')
    return { success: true }
  } catch { return { error: 'Failed to delete ticket' } }
}
