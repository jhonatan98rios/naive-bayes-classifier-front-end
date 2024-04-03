import { Provider } from '@/components/SessionProvider'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from './layout'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {

  //@ts-ignore
  const getLayout = Component.getLayout || ((page) => ( <Layout> { page } </Layout>))

  return (
    <Provider>
      <Head> 
        <title> Auto Naive Bayes Classifier </title>
      </Head>
      { getLayout(<Component {...pageProps} />) }
    </Provider>
  )
}
