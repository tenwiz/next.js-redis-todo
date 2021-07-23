import { v4 as uuidv4 } from 'uuid'
import redis from '../../../lib/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { username, password } = req.body

  if (!username || !password) {
    res.status(400).json({
      error: 'Username and Password can not be empty',
    })
  } else {
    const id = uuidv4()
    const newEntry = {
      id,
      username,
      password,
      created_at: Date.now(),
    }

    try {
      await redis.hset('users', username, JSON.stringify(newEntry))
      res.status(200).json({
        body: {
          success: true,
        },
      })
    } catch (error) {
      res.status(200).json({
        body: {
          success: false,
        },
      })
    }
  }
}
