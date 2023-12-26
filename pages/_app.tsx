import { Provider } from '@/components/SessionProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './layout'

export default function App({ Component, pageProps }: AppProps) {

  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => ( <Layout> { page } </Layout>))

  return (
    <Provider>
      { getLayout(<Component {...pageProps} />) }
    </Provider>
  )
}
