'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCertificates() {
  try {
    return await prisma.certificate.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createCertificate(formData: FormData) {
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const catLabel = formData.get('catLabel') as string
  const date = formData.get('date') as string
  const issuer = formData.get('issuer') as string
  const icon = formData.get('icon') as string
  const credId = formData.get('credId') as string
  const duration = formData.get('duration') as string
  const score = formData.get('score') as string
  const progress = parseInt(formData.get('progress') as string) || 0
  const status = formData.get('status') as string || 'progress'
  const userId = formData.get('userId') as string

  if (!title || !userId) return { error: 'Title and User are required' }

  try {
    await prisma.certificate.create({
      data: { title, category, catLabel, date, issuer, icon, credId, duration, score, progress, status, userId }
    })
    revalidatePath('/certificates')
    return { success: true }
  } catch (error) {
    console.error('Failed to create certificate:', error)
    return { error: 'Failed to create certificate' }
  }
}

export async function deleteCertificate(id: string) {
  try {
    await prisma.certificate.delete({ where: { id } })
    revalidatePath('/certificates')
    return { success: true }
  } catch { return { error: 'Failed to delete certificate' } }
}
