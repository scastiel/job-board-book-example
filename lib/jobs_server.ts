import { readFile } from 'fs/promises'
import { join } from 'path'
import { GetJobsOptions, Job, JobSummary, toJob, toJobSummary } from './jobs'

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

export const getJob = async (id: string): Promise<Job | undefined> => {
  const jobs = await readJobsFromJson()
  return jobs.find((job) => job.id === id)
}
