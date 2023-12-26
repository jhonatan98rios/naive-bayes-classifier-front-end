import { Provider } from '@/components/SessionProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
