import { NextApiHandler } from 'next'
import { getCurrentUser } from '../../lib/user_server'

const handle: NextApiHandler = async (req, res) => {
  // Note: we use `json` and not `send`. Calling `send` with
  // an object as parameter is the same as calling `json`, but
  // it is not the case when calling it with `null`.
  // `res.send(null)` would send an empty response.
  res.json(await getCurrentUser({ req }))
}

export default handle
