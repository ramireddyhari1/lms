'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getJobListings() {
  try {
    return await prisma.jobListing.findMany({ orderBy: { createdAt: 'desc' } })
  } catch { return [] }
}

export async function createJobListing(formData: FormData) {
  const company = formData.get('company') as string
  const role = formData.get('role') as string
  const location = formData.get('location') as string
  const salary = formData.get('salary') as string
  const status = formData.get('status') as string || 'Not Applied'

  if (!company || !role) return { error: 'Company and Role are required' }

  try {
    await prisma.jobListing.create({
      data: { company, role, location, salary, status }
    })
    revalidatePath('/placement')
    return { success: true }
  } catch (error) {
    console.error('Failed to create job listing:', error)
    return { error: 'Failed to create job listing' }
  }
}

export async function deleteJobListing(id: string) {
  try {
    await prisma.jobListing.delete({ where: { id } })
    revalidatePath('/placement')
    return { success: true }
  } catch { return { error: 'Failed to delete job listing' } }
}
