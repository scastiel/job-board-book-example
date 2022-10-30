import { NextApiHandler } from 'next'
import { GetJobsOptions } from '../../lib/jobs'
import { getJobs } from '../../lib/jobs_server'

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const getJobOptions: GetJobsOptions = {}

  if (req.query.page) {
    const page = Number(req.query.page)
    if (isNaN(page) || page < 1) {
      res.status(422).send('Invalid page number')
      return
    }
    getJobOptions.page = page
  }

  if (req.query.jobTitle) {
    if (typeof req.query.jobTitle !== 'string') {
      res.status(422).send('Invalid jobTitle filter')
      return
    }
    getJobOptions.jobTitle = req.query.jobTitle
  }

  if (req.query.company) {
    if (typeof req.query.company !== 'string') {
      res.status(422).send('Invalid company filter')
      return
    }
    getJobOptions.company = req.query.company
  }

  const jobs = await getJobs(getJobOptions)
  res.send(jobs)
}

export default handle
