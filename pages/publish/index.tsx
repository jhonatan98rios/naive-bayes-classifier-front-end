import { useState, ChangeEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { ClassifierDTO } from '@/domain/entities/Classifier';
import { useSession } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { DragAndDropFileUploader } from '@/components/DragAndDropFileUploader';
import { uploadFile } from '@/usecases/FileUpload';

enum STATUS {
  NOFILE = 0,
  LOADING = 1,
  DONE = 2,
  ERROR = 3
}

enum VISIBILITY {
  public = 'public',
  private = 'private'
}

export default function Publish() {

  const router = useRouter();
  const [name, setName] = useState('')


  const [visibility, setVisibility] = useState<VISIBILITY>(VISIBILITY.public)
  const [file, setFile] = useState<any>()

  const [path, setPath] = useState()
  const [id, setId] = useState()

  const [status, setStatus] = useState<STATUS>(STATUS.NOFILE)

  const { data: session } = useSession()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {

      const file = e.target.files[0]
      setFile(file);
      setStatus(STATUS.LOADING)

      try {
        //@ts-ignore
        const { path: uploadedFilePath, id: uploadedFileId } = await uploadFile(file)

        setPath(uploadedFilePath)
        setId(uploadedFileId)

        setTimeout(() => {
          setStatus(STATUS.DONE)
        }, 1500);

      } catch (err) {
        setStatus(STATUS.ERROR)
        // throw Error(JSON.stringify(err))
        console.log(err)
      }
    }
  };

  const handleUploadClick = async (e: any) => {
    e.preventDefault()
    if (!file) return;

    await uploadData()
  };

  const uploadData = async () => {

    const classifierData = new ClassifierDTO({
      id: id!,
      path: path!,
      name: name!,
      size: 0,
      format: "text/csv",
      type: "nlp-classifier",
      status: "inProgress",
      isPublic: visibility == VISIBILITY.public,
      owners: [session?.user?.email!]
    })

    console.log('classifierData:')
    console.log(classifierData)

    try {
      const res = await fetch('http://localhost:3001/publish', {
        method: 'POST',
        body: JSON.stringify(classifierData),
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log(res)

    } catch (err) {

      console.log('err')
      console.log(err)
      throw Error(JSON.stringify(err))

    } finally {
      router.push("/classifiers");
    }
  }


  return (
    <main className='flex min-h-screen flex-col p-4'>

      <div className='bg-white rounded-2xl mt-48 p-8 shadow-md drop-shadow-sm w-full max-w-3xl mx-auto'>

        <h1 className='text-xl mb-4 font-semibold text-gray-500 text-center'> Informe os dados do modelo </h1>
        <form className='flex flex-col'>

          <div className='flex'>
            <div className='w-6/12'>

              <div className='flex flex-col mb-4'>
                <label htmlFor="" className='mb-2 font-semibold text-gray-500'> Nome do modelo: </label>
                <input
                  type="text"
                  name="classifier_name"
                  className='w-80 border rounded border-gray-300 py-2 px-4'
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor="" className='mb-2 font-semibold text-gray-500'> Descrição do modelo: </label>
                <textarea
                  name="classifier_name"
                  className='w-80 border h-36 rounded border-gray-300 py-2 px-4 resize-y'
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

            </div>

            <div className='w-6/12'>
              <DragAndDropFileUploader 
                status={status} 
                setStatus={setStatus} 
              />
            </div>
          </div>

          <div>
            <div className='flex flex-col mb-4'>
              <label htmlFor="" className='mb-2 font-semibold text-gray-500'> Proprietarios pelo modelo: </label>
              <input
                type="text"
                name="classifier_name"
                className='w-full border rounded border-gray-300 py-2 px-4'
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='flex flex-col mb-6'>

              <div className='flex ml-2'>
                <input
                  type="checkbox"
                  id="visibility"
                  checked={visibility == VISIBILITY.public}
                  onChange={() => setVisibility(visibility == VISIBILITY.public ? VISIBILITY.private : VISIBILITY.public)}
                />
                <label 
                  htmlFor="visibility" 
                  className='ml-2 font-semibold text-gray-500'
                >
                  Esse modelo poderá ser acessado públicamente?
                </label>
              </div>

              <ul className='text-[10px] list-disc ml-12 font-semibold text-gray-500'>
                <li> Modelos públicos podem ser utilizados por qualquer um com uma conta, mas só podem ser editados pelos proprietarios </li>
                <li> Modelos privados somente podem ser acessados e editados pelos proprietarios </li>
              </ul>             
            </div>
          </div>

          <button
            onClick={handleUploadClick}
            className={`
              flex font-semibold py-2 border rounded-xl w-full justify-center
              ${ true ? 'bg-gray-400 text-white' : '' }
            `}
          >
            Confirmar criação do modelo
          </button>

          {
            status == STATUS.ERROR &&
            <>
              <p className='text-red-400 font-medium mt-4'> Erro ao fazer o upload. Tente novamente mais tarde! </p>
            </>
          }

        </form>
      </div>
    </main>
  )
}



export const getServerSideProps: GetServerSideProps = (async (context) => {

  const session = await getServerSession(
    context.req,
    context.res,
    authOptions
  )

  console.log(session)

  if (!session || !session.user) {
    return { props: {}, redirect: { destination: '/' } }
  }

  return {
    props: { session }
  }
})