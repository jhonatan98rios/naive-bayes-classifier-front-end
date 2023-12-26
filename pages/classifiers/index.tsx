import { ClassifierDTO, STATUS } from '@/domain/entities/Classifier'
import useDidMount from '@/hooks/hooks'
import { GetServerSideProps } from 'next'
import { Session, getServerSession } from 'next-auth'
import Link from 'next/link'
import { useState } from 'react'
import { authOptions } from "../api/auth/[...nextauth]"
import { ClassifierCard } from '@/components/ClassifierCard'


interface ClassifiersProps {
  _classifiers: ClassifierDTO[],
  session: Session
}

export default function Classifiers({ _classifiers, session }: ClassifiersProps) {

  const [classifiers, setClassifiers] = useState<ClassifierDTO[]>(_classifiers)

  async function fetchClassifierStatus(id: string): Promise<ClassifierDTO> {
    const response = await fetch(`http://localhost:3002/read-classifier/${id}`, {
      headers: {
        //@ts-ignore
        "Authorization": session?.accessToken,
      }
    });

    const data: ClassifierDTO = await response.json()
    return data
  }

  async function updateInProgressClassifiers() {
    let areThereInProgressClassifiers = false
    let areThereChanges = false

    console.log("updating...")

    if (!classifiers || classifiers.length <= 0) {
      return []
    }

    const updatedClassifiers = await Promise.all(
      classifiers.map(async classifier => {
        if (classifier.status !== STATUS.INPROGRESS) {
          return classifier
        }

        areThereInProgressClassifiers = true
        const updatedClassifier = await fetchClassifierStatus(classifier.id)

        if (classifier.status !== updatedClassifier.status) {
          areThereChanges = true
          classifier = updatedClassifier
        }

        return classifier
      })
    )

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
    // HTTP Pooling
    setTimeout(updateInProgressClassifiers, 5000)
  })

  return (
    <main className="flex min-h-screen flex-col p-4">

      {
        (!classifiers || classifiers.length == 0) &&
        <div className='border-2 border-dashed border-gray-500 w-11/12 max-w-3xl mx-auto text-center flex flex-col justify-center items-center rounded-2xl py-16 mt-60'>

          <p className='text-xl font-medium text-gray-500'> 
            Actually, there is no classifiers.
          </p>

          <p className='text-base mb-4 text-gray-500'>
            Drag and Drop a file or click on button bellow to create a new classifier.
          </p>

          <Link href="/publish" className='w-12 h-12 rounded-full p-3 bg-white shadow-sm drop-shadow-md'>
            <img src="/plus.svg" alt="" />
          </Link>
        </div>
      }


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

  if (!session || !session.user) {
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