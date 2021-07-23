import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }

    const username = target.username.value
    const password = target.password.value

    login(username, password)
  }
  return (
    <section className="min-h-screen flex flex-col">
      <div className="flex flex-1 items-center justify-center">
        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">
          <form className="text-center" onSubmit={handleSubmit}>
            <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
              Log In
            </h1>
            <div className="py-2 text-left">
              <label
                htmlFor="username"
                className="text-gray-700 px-1 block mb-1"
              >
                Username
              </label>
              <input
                type="text"
                className="bg-gray-200 border-2 border-gray-200 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                id="username"
                placeholder="Username"
              />
            </div>
            <div className="py-2 text-left">
              <label
                htmlFor="password"
                className="text-gray-700 px-1 block mb-1"
              >
                Password
              </label>
              <input
                type="password"
                className="bg-gray-200 border-2 border-gray-200 focus:outline-none block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                placeholder="Enter Password"
                id="password"
              />
            </div>
            <div className="py-2">
              <button
                type="submit"
                className="border-2 border-gray-100 focus:outline-none bg-blue-500 text-white font-bold tracking-wider block w-full p-2 rounded-lg focus:border-gray-700 hover:bg-blue-700"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="text-center mt-12">
            <span className="mr-2">{"Don't have an account?"}</span>
            <a
              href="/register"
              className="text-md text-indigo-600 underline font-semibold hover:text-indigo-800"
            >
              Create One
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
