import { NextApiHandler } from 'next'
import { getToken } from 'next-auth/jwt'

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ ok: false })
    return
  }

  const token = await getToken({ req })
  if (!token) {
    res.status(401).send({ ok: false })
    return
  }

  res.send({ ok: true })
}

export default handle
