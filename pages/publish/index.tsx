import { GetServerSideProps } from 'next';
import { useEffect } from 'react'
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]';
import { validateToken } from '@/hooks/hooks';
import { usePublishModel } from './model';
import PublishView from './view';


export default function Publish({ session }: any) {
  
  const props = usePublishModel({ session })

  const { setOwners } = props

  useEffect(() => {
    if (session?.user?.email) setOwners([ session?.user?.email ])
  }, [session])

  return (
    <PublishView {...props} />
  )
}

export const getServerSideProps: GetServerSideProps = (async (context) => {

  const session = await getServerSession(
    context.req, context.res, authOptions
  )

  const isValidToken = await validateToken(session?.accessToken)

  if (!session || !session.user || !isValidToken) {
    return { props: {}, redirect: { destination: '/' } }
  }

  return {
    props: { session }
  }
})