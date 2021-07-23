import { v4 as uuidv4 } from 'uuid'
import type { NextApiRequest, NextApiResponse } from 'next'

import redis from '../../../lib/redis'

type RequestBody = {
  title: String
  isDone: Boolean
}

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    body: { title, isDone },
  }: { body: RequestBody } = req

  if (!title) {
    res.status(400).json({
      error: 'Title can not be empty',
    })
  } else if (title.length < 150) {
    const id = uuidv4()
    const newEntry = {
      id,
      title,
      expiresAt: new Date().setDate(new Date().getDate() + 1),
      createdAt: Date.now(),
      isDone,
    }

    await redis.hset('todos', id, JSON.stringify(newEntry))
    res.status(200).json({
      body: 'success',
    })
  } else {
    res.status(400).json({
      error: 'Max 150 characters please.',
    })
  }
}
