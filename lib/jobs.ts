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

export const toJob = (obj: any): Job => ({ ...obj, date: new Date(obj.date) })

export const toJobSummary = (job: Job): JobSummary => {
  const { description, applyUrl, ...jobSummary } = job
  return jobSummary
}
