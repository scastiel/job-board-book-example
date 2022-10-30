import { NextApiHandler } from 'next'
import { JobFormValues, validateJobFormValues } from '../../lib/jobForm'
import { getJob } from '../../lib/jobs_server'
import prisma from '../../lib/prisma_server'
import { getCurrentUser } from '../../lib/user_server'

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const user = await getCurrentUser({ req })
  if (!user) {
    res.status(401).send({ ok: false })
    return
  }

  const jobId = String(req.query.id)
  const job = await getJob(jobId)
  if (!job) {
    res.status(404).send({ ok: false })
    return
  }
  if (job.userId !== user.id) {
    res.status(403).send({ ok: false })
    return
  }

  const values: JobFormValues = JSON.parse(req.body)

  const errors = validateJobFormValues(values)
  if (Object.keys(errors).length > 0) {
    res.status(422).send(errors)
    return
  }

  await prisma.job.update({
    where: { id: jobId },
    data: {
      jobTitle: values.jobTitle,
      company: values.company,
      description: values.description,
      applyUrl: values.applyUrl,
    },
  })

  await res.revalidate(`/jobs/${job.id}`)

  res.send({ ok: true })
}

export default handle
