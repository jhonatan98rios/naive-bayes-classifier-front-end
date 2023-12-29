import { ClassifierDTO, STATUS } from '@/domain/entities/Classifier'
import useDidMount, { validateToken } from '@/hooks/hooks'
import { GetServerSideProps } from 'next'
import { Session, getServerSession } from 'next-auth'
import Link from 'next/link'
import { useState } from 'react'
import { authOptions } from "../api/auth/[...nextauth]"
import { ClassifierCard } from '@/components/ClassifierCard'
import { readInProgressClassifiers } from '@/usecases/ReadInProgressClassifierStatus'


interface ClassifiersProps {
  _classifiers: ClassifierDTO[],
  session: Session
}

export default function Classifiers({ _classifiers, session }: ClassifiersProps) {

  const [classifiers, setClassifiers] = useState<ClassifierDTO[]>(_classifiers)

  async function updateInProgressClassifiers() {

    if (!classifiers || classifiers.length <= 0) return []
    
    const { updatedClassifiers, areThereChanges, areThereInProgressClassifiers } = await readInProgressClassifiers(classifiers, session)

    if (areThereChanges) {
      console.log('ThereAreChanges')
      setClassifiers(updatedClassifiers)
    }

    if (areThereInProgressClassifiers) {
      console.log('ThereAreInProgressClassifiers')
      setTimeout(updateInProgressClassifiers, 5000)
    }
  }

  useDidMount(() => {
    // Start HTTP Pooling
    setTimeout(updateInProgressClassifiers, 5000)
  })

  return (
    <main className="flex min-h-screen flex-col p-4">
      {
        !(classifiers && classifiers.length > 0) &&
        <p className='mx-auto mt-64 text-2xl text-gray-500 text-center'> 
          Actually, there is no classifiers. <br/> 
          Please, <Link href="/publish" className='text-purple-500' > click here </Link> to create a new one 
        </p>
      }

      <Link href="/publish">
        <div className='w-12 h-12 rounded-full p-3 bg-white shadow-sm drop-shadow-md fixed right-16 bottom-8'>
          <img src="/plus.svg" alt="" />
        </div>
      </Link>

      <div className='flex flex-col items-center'>
        {
          (classifiers && classifiers.length > 0) &&
          classifiers.map((classifier, index) => (
            <ClassifierCard classifier={classifier} key={index} />
          ))
        }
      </div>
    </main>
  )
}


export const getServerSideProps: GetServerSideProps<{ _classifiers: ClassifierDTO[] }> = (async (context) => {

  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  )

  const isValidToken = await validateToken(session?.accessToken)

  if (!session || !session.user || !isValidToken) {
    return { props: { _classifiers: [] }, redirect: { destination: '/' } }
  }

  try {
    const response = await fetch("http://localhost:3002/list-classifiers", {
      headers: {
        "Authorization": session?.accessToken,
      }
    });

    console.log("fetching with access token: ", session?.accessToken)

    const _classifiers: ClassifierDTO[] = await response.json()

    return {
      props: { _classifiers, session }
    }

  } catch (err) {
    return { props: { _classifiers: [] }, redirect: '/' }
  }
})