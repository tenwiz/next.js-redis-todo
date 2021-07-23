import redis from '../../../lib/redis'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function deleteItem(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, expiresAt } = req.body

  if (new Date(expiresAt) > new Date()) {
    await redis.hdel('todos', id)
    return res.status(200).json({ success: true })
  } else {
    return res.status(400).json({ success: false })
  }
}
