import redis from '../../../lib/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function getItems(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const items = (await redis.hvals('todos'))
    .map(entry => JSON.parse(entry))
    .sort((a, b) => a.createdAt - b.createdAt)
    .sort((a, b) => (a.isDone && !b.isDone ? 1 : -1))

  res.status(200).json({ items })
}
