import clsx from 'clsx'
import { FC } from 'react'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import { Todo } from '../models/todo'

interface ItemProps {
  isFirst: Boolean
  isLast: Boolean
  hasDone: Boolean
  item: Todo
}

const Item: FC<ItemProps> = ({ isFirst, isLast, hasDone, item }) => {
  const update = async (event: any) => {
    event.preventDefault()

    const res = await fetch('/api/todo/update', {
      body: JSON.stringify({
        id: item.id,
        isDone: !item.isDone,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      return toast.error(error)
    }

    mutate('/api/todo/items')
  }

  const deleteItem = async (event: any) => {
    event.preventDefault()

    const res = await fetch('/api/todo/delete', {
      body: JSON.stringify({
        id: item.id,
        expiresAt: item.expiresAt,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { success } = await res.json()
    if (!success) {
      return toast.error('You cannot delete expired task!')
    }

    mutate('/api/todo/items')
  }

  const hasExpired = new Date(item.expiresAt) < new Date()
  return (
    <div
      className={clsx(
        'p-6 mx-8 flex items-center border-t border-l border-r',
        isFirst && 'rounded-t-md',
        isLast && 'border-b rounded-b-md',
      )}
    >
      <button
        className={clsx(
          'ring-1 ring-gray-200 rounded-full w-8 min-w-[2rem] h-8 mr-4 focus:outline-none focus:ring focus:ring-blue-300',
          hasDone && 'bg-green-100 ring-green-300',
          hasExpired && 'cursor-not-allowed ring-black bg-gray-400',
        )}
        onClick={update}
        disabled={hasExpired}
      >
        {hasDone ? '✅' : '👍'}
      </button>
      <h3 className="text font-semibold w-full text-left">{item.title}</h3>
      <div className="bg-gray-200 text-gray-700 text-sm rounded-xl px-2 ml-2">
        {hasExpired ? 'Expired At:' : 'Expires At:'}{' '}
        {new Date(item.expiresAt).toLocaleDateString()}
      </div>
      <button
        className={clsx(
          'flex items-center justify-center ml-3 h-10 text-lg border bg-red-400 text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800',
          hasExpired && 'cursor-not-allowed bg-gray-500',
        )}
        onClick={deleteItem}
        disabled={hasExpired}
      >
        Delete
      </button>
    </div>
  )
}

export default Item
