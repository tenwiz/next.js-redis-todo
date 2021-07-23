import React, { useState, useRef, FormEvent, FC } from 'react'
import Head from 'next/head'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'
import redis from '../lib/redis'
import withAuth from '../hoc/withAuth'
import { GetServerSideProps } from 'next'
import { useAuth } from '../hooks/useAuth'
import { Todo } from '../models/todo'
import LoadingSpinner from '../components/loading'
import Item from '../components/item'

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface HomeProps {
  items: Todo[]
}

const Home: FC<HomeProps> = ({ items }) => {
  const { logout } = useAuth()
  const [isCreateLoading, setCreateLoading] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, error } = useSWR('/api/todo/items', fetcher, {
    initialData: { items },
  })

  if (error) {
    toast.error(error)
  }

  const createTodo = async (event: FormEvent<HTMLFormElement>) => {
    if (inputRef.current) {
      event.preventDefault()
      setCreateLoading(true)

      const res = await fetch('/api/todo/create', {
        body: JSON.stringify({
          title: inputRef.current.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const { error } = await res.json()
      setCreateLoading(false)

      if (error) {
        toast.error(error)
        return
      }

      mutate('/api/todo/items')
      inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full">
      <Head>
        <title>Todo – Next.js and Redis</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <button
            className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 text-lg border bg-black text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center w-full">
        <div className="flex justify-center items-center bg-black rounded-full w-16 sm:w-24 h-16 sm:h-24 my-8">
          <img src="/upstash.svg" alt="Upstash Logo" className="h-8 sm:h-16" />
        </div>

        <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
          <div className="mx-8 w-full">
            <form className="relative my-8" onSubmit={createTodo}>
              <input
                ref={inputRef}
                aria-label="Enter Todo"
                placeholder="Enter Todo"
                type="text"
                maxLength={150}
                required
                className="pl-3 pr-28 py-3 mt-1 text-lg block w-full border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                className="flex items-center justify-center absolute right-2 top-2 px-4 h-10 text-lg border bg-blue-500 text-white rounded-md w-24 focus:outline-none focus:ring focus:ring-blue-300 focus:bg-gray-800"
                type="submit"
              >
                {isCreateLoading ? <LoadingSpinner /> : 'Create'}
              </button>
            </form>
          </div>
          <div className="w-full mb-8">
            {data.items.map((item: Todo, index: number) => (
              <Item
                key={index}
                isFirst={index === 0}
                isLast={index === data.items.length - 1}
                hasDone={item.isDone}
                item={item}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const items = await redis.hvals('todos')

  const todos =  items ? items.map(entry => JSON.parse(entry))
    .sort((a, b) => a.createdAt - b.createdAt)
    .sort((a, b) => (a.isDone && !b.isDone ? 1 : -1)) : []

  return { props: { items: todos } }
}

export default withAuth(Home)
