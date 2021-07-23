import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from '../contexts/auth'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              margin: '40px',
              background: '#363636',
              color: '#fff',
              zIndex: 1,
            },
            duration: 5000,
          }}
        />
      </AuthProvider>
    </>
  )
}
export default MyApp
