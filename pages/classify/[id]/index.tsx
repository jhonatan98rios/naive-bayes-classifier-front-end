import { GetServerSideProps } from 'next'
import { ClassifierDTO } from '@/domain/entities/Classifier'
import { useState } from 'react'

interface ClassifyProps {
  classifier: ClassifierDTO
}

export default function Classify({ classifier }: ClassifyProps) {

  const [sample, setSample] = useState('')
  const [classification, setClassification] = useState('')

  async function handleClassification() {

    const data = {
      sample,
      id: classifier.id
    }

    const response = await fetch('http://localhost:3002/classify', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const value = await response.json();
    setClassification(value.classification)
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


export const getServerSideProps: GetServerSideProps<{classifier: ClassifierDTO}> = (async (context) => {

  const id = context.params?.id as string
  const res = await fetch("http://localhost:3002/read-classifier/" + id)
  const classifier: ClassifierDTO = await res.json()
  return { props: { classifier } }
})