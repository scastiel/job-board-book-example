import { Job } from '@prisma/client'
import { readFile } from 'fs/promises'
import { GetJobsOptions, JobSummary } from './jobs'
import prisma from './prisma_server'

export async function getJobs({
  page = 1,
  jobTitle,
  company,
}: GetJobsOptions = {}): Promise<JobSummary[]> {
  return prisma.job.findMany({
    // Keep only the fields present in JobSummary
    select: { id: true, jobTitle: true, company: true, date: true },

    // Filters on jobTitle and companyName
    where: {
      jobTitle: { contains: jobTitle, mode: 'insensitive' },
      company: { contains: company, mode: 'insensitive' },
    },

    // Sort by date, the latest one first
    orderBy: { date: 'desc' },

    // Pagination parameters
    skip: (page - 1) * 10,
    take: 10,
  })
}

export const getJob = async (id: string): Promise<Job | undefined> => {
  const job = await prisma.job.findUnique({ where: { id } })
  return job ?? undefined
}
