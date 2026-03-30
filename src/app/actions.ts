'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  try {
    const [courses, assignments, assessments, certificates, notifications] = await Promise.all([
      prisma.course.count(),
      prisma.assignment.count(),
      prisma.assessment.count(),
      prisma.certificate.count(),
      prisma.notification.count({ where: { unread: true } }),
    ])
    
    const completedCourses = await prisma.course.count({ where: { status: 'completed' } })
    const completedAssignments = await prisma.assignment.count({ where: { status: 'Graded' } })
    const pendingAssignments = await prisma.assignment.count({ where: { status: 'Pending' } })

    return {
      totalCourses: courses,
      completedCourses,
      totalAssignments: assignments,
      completedAssignments,
      pendingAssignments,
      totalAssessments: assessments,
      totalCertificates: certificates,
      unreadNotifications: notifications,
      overallProgress: courses > 0 ? Math.round((completedCourses / courses) * 100) : 0,
    }
  } catch {
    return {
      totalCourses: 0, completedCourses: 0, totalAssignments: 0,
      completedAssignments: 0, pendingAssignments: 0, totalAssessments: 0,
      totalCertificates: 0, unreadNotifications: 0, overallProgress: 0,
    }
  }
}

export async function getRecentCourses() {
  try {
    return await prisma.course.findMany({
      where: { status: 'ongoing' },
      orderBy: { updatedAt: 'desc' },
      take: 2
    })
  } catch { return [] }
}

export async function getRecentNotifications() {
  try {
    return await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    })
  } catch { return [] }
}
