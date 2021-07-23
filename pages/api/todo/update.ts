import redis from '../../../lib/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function update(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, isDone } = req.body
  const entry = JSON.parse((await redis.hget('todos', id)) || 'null')
  const updated = {
    ...entry,
    isDone,
  }

  await redis.hset('todos', id, JSON.stringify(updated))
  return res.status(200).json(updated)
}
