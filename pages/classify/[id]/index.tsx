import { GetServerSideProps } from 'next'
import { ClassifierDTO } from '@/domain/entities/Classifier'
import { useState } from 'react'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { validateToken } from '@/hooks/hooks'
import { executeClassification } from '@/usecases/ExecuteClassification'
import { readClassifier } from '@/usecases/ReadInProgressClassifierStatus'

interface ClassifyProps {
  classifier: ClassifierDTO
  session: Session
}

export default function Classify({ classifier, session }: ClassifyProps) {

  const [sample, setSample] = useState('')
  const [classification, setClassification] = useState('')

  async function handleClassification() {

    if (!session) return

    const data = {
      sample,
      id: classifier.id
    }

    const response = await executeClassification(data, session)
    setClassification(response.classification)
  }

  return (
    <main className="flex min-h-screen flex-col p-4">
      <h1 className='text-2xl mb-4 font-semibold text-blue-700'> Classify </h1>

      <div>
        <p> id: { classifier.id } </p>
        <p> name: { classifier.name } </p>
        <p> src: { classifier.path } </p>
        <p> status: { classifier.status } </p>

        <div className='flex flex-col mt-4'>
          <label htmlFor="text-input"> Insert bellow the text that you want classify: </label>
          <textarea 
            id='text-input' 
            value={sample} 
            onChange={(e) => setSample(e.target.value)} 
            className='w-100 mb-4 border rounded border-blue-500 py-2 px-4 mt-2'
          />
          
          {
            sample.length > 0 &&
            <button 
              onClick={handleClassification} 
              className="flex bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-56 justify-center"
            >
              Run
            </button>
          }
        </div>

        <p className='text-xl mb-4 font-semibold text-blue-700 text-center'> { classification } </p>
      </div>
    </main>
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

  const id = context.params?.id as string
  const classifier: ClassifierDTO = await readClassifier(id, session)
  return { props: { classifier, session } }
})