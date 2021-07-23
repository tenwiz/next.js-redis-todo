import redis from '../../../lib/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({
      error: 'Username and Password can not be empty',
    })
  } else {
    const entry = JSON.parse((await redis.hget('users', username)) || 'null')

    if (!entry) {
      res.status(400).json({
        body: {
          success: false,
        },
      })
    }

    if (entry.password === password) {
      res.status(200).json({
        body: {
          success: true,
        },
      })
    } else {
      res.status(400).json({
        body: {
          success: false,
        },
      })
    }
  }
}
