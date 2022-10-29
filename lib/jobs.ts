import { readFile } from 'fs/promises'
import { join } from 'path'

export interface Job {
  id: string
  jobTitle: string
  company: string
  description: string
  applyUrl: string
  date: Date
}

export type JobSummary = Omit<Job, 'applyUrl' | 'description'>

export interface GetJobsOptions {
  page?: number
  jobTitle?: string
  company?: string
}

const toJob = (obj: any): Job => ({ ...obj, date: new Date(obj.date) })

const toJobSummary = (job: Job): JobSummary => {
  const { description, applyUrl, ...jobSummary } = job
  return jobSummary
}

const readJobsFromJson = async (): Promise<Job[]> => {
  const json = await readFile(join(process.cwd(), 'jobs.json'), 'utf-8')
  return (JSON.parse(json) as any[]).map(toJob)
}

export const getJobs = async ({
  page = 1,
  jobTitle,
  company,
}: GetJobsOptions = {}): Promise<JobSummary[]> => {
  const jobs = await readJobsFromJson()
  const stringMatches = (str: string, searched: string | undefined) =>
    !searched || str.toLowerCase().includes(searched.toLowerCase())
  return jobs
    .map(toJobSummary)
    .filter(
      (job) =>
        stringMatches(job.jobTitle, jobTitle) &&
        stringMatches(job.company, company)
    )
    .sort((first, second) => second.date.valueOf() - first.date.valueOf())
    .slice((page - 1) * 10, page * 10)
}
