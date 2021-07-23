import { useRouter } from 'next/router'

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    if (typeof window !== 'undefined') {
      const router = useRouter()
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        router.replace('/login')
        return null
      }
      return <WrappedComponent {...props} />
    }
    return null
  }
}

export default withAuth
