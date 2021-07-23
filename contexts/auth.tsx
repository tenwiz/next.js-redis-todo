import React, { useState, useEffect, FC } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

interface IAuthContext {
  isAuthenticated: boolean
  login: (username: string, password: string) => void
  register: (username: string, password: string) => void
  logout: () => void
}

interface AuthProviderProps {
  children?: React.ReactNode
}

const authContextDefaults: IAuthContext = {
  isAuthenticated: false,
  login: () => null,
  register: () => null,
  logout: () => null,
}

export const AuthContext =
  React.createContext<IAuthContext>(authContextDefaults)

export const AuthProvider: FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const router = useRouter()

  const [isAuthenticated, setAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    setAccessToken(accessToken)
  })

  useEffect(() => {
    if (!!accessToken) {
      setAuthenticated(true)
    }
  }, [accessToken])

  const login = async (username: string, password: string) => {
    localStorage.setItem('accessToken', 'token_123')
    const res = await fetch('/api/auth/login', {
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (res.ok && res.status === 200) {
      setTimeout(() => {
        setAuthenticated(true)
        router.push('/')
      }, 1000)
    } else {
      toast.error('Error while login!')
    }
  }

  const register = async (username: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (res.ok && res.status === 200) {
      setTimeout(() => {
        setAuthenticated(false)
        router.push('/login')
      }, 1000)
    }
  }

  const logout = () => {
    setTimeout(() => {
      localStorage.removeItem('accessToken')
      setAuthenticated(false)
      router.push('/login')
    }, 1000)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
