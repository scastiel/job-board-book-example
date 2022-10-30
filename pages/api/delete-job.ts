import { NextApiHandler } from 'next'
import { getJob } from '../../lib/jobs_server'
import prisma from '../../lib/prisma_server'
import { getCurrentUser } from '../../lib/user_server'

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

  await prisma.job.delete({ where: { id: jobId } })

  await res.revalidate(`/jobs/${jobId}`)

  res.send({ ok: true })
}

export default handle
