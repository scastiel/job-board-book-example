import { NextApiHandler } from 'next'
import { getCurrentUser } from '../../lib/user_server'
import { JobFormValues, validateJobFormValues } from '../../lib/jobForm'
import prisma from '../../lib/prisma_server'

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ ok: false })
    return
  }

  const user = await getCurrentUser({ req })
  if (!user) {
    res.status(401).send({ ok: false })
    return
  }

  const values: JobFormValues = JSON.parse(req.body)

  const errors = validateJobFormValues(values)
  if (Object.keys(errors).length > 0) {
    res.status(422).send(errors)
    return
  }

  const job = await prisma.job.create({
    data: {
      // id and date are filled automatically, as specified
      // in the model
      jobTitle: values.jobTitle,
      company: values.company,
      description: values.description,
      applyUrl: values.applyUrl,
      userId: user.id,
    },
  })

  res.send({ jobId: job.id })
}

export default handle
