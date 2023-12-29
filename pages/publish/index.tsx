import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]';
import { DragAndDropFileUploader } from '@/components/DragAndDropFileUploader';
import { fileValidation, uploadFile } from '@/usecases/FileUpload';
import { MultiEmailInput } from '@/components/MultiEmailInput';
import { createClassifier } from '@/usecases/CreateClassifier';
import { CreateClassifierDTO } from '@/domain/dtos/CreateClassifierDTO';
import { FILE_STATUS } from '@/domain/entities/FileStatus';
import { VISIBILITY } from '@/domain/entities/Visibility';
import { validateToken } from '@/hooks/hooks';


export default function Publish({ session }: any) {

  const router = useRouter();

  const [id, setId] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [owners, setOwners] = useState<string[]>([ ])

  const [visibility, setVisibility] = useState<VISIBILITY>(VISIBILITY.public)
  const [file, setFile] = useState<File>()
  const [path, setPath] = useState()

  const [status, setStatus] = useState<FILE_STATUS>(FILE_STATUS.NOFILE)

  useEffect(() => {
    if (session?.user?.email) setOwners([ session?.user?.email ])

  }, [session])


  const handleFileChange = async ([file]: File[]) => {

    if (!session) return
    if (!fileValidation(file)) console.log("Invalid file")

    setFile(file);
    setStatus(FILE_STATUS.LOADING)

    try {
      const { path: uploadedFilePath, id: uploadedFileId } = await uploadFile(file, session)

      setPath(uploadedFilePath)
      setId(uploadedFileId)

      setTimeout(() => {
        setStatus(FILE_STATUS.DONE)

      }, 1500);

    } catch (err) {
      setStatus(FILE_STATUS.ERROR)
      // throw Error(JSON.stringify(err))
      console.log(err)
    } 
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!file) return;
    if (!session) return

    const createClassifierDTO = new CreateClassifierDTO({
      id: id!,
      name: name,
      description: description,
      size: file?.size!,
      format: file?.type!,
      path: path!,
      status: "inProgress",
      isPublic: visibility == VISIBILITY.public,
      owners: owners
    })
  
    console.log('classifierData:')
    console.log(createClassifierDTO)
  
    createClassifier(createClassifierDTO, session)
      .then(() => {
        router.push("/classifiers?u=true");
      })
  };


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
                  id="classifier_name"
                  name="classifier_name"
                  className='w-80 border rounded border-gray-300 py-2 px-4'
                  value={name} onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='flex flex-col mb-4'>
                <label htmlFor="" className='mb-2 font-semibold text-gray-500'> Descrição do modelo: </label>
                <textarea
                  id="classifier_description"
                  name="classifier_description"
                  className='w-80 border h-36 rounded border-gray-300 py-2 px-4 resize-y'
                  value={description} onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className='w-6/12'>
              <DragAndDropFileUploader 
                handleFileChange={handleFileChange}
                file={file!}
                setFile={setFile}
                status={status} 
                setStatus={setStatus} 
              />
            </div>
          </div>

          <div>
            <div className='flex flex-col mb-4'>
              <MultiEmailInput owners={owners} setOwners={setOwners} />
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
                <li> Modelos públicos podem ser acessados por qualquer um com uma conta, mas só podem ser editados pelos proprietarios </li>
                <li> Modelos privados podem ser acessados e editados somente pelos proprietarios </li>
              </ul>             
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className={`
              flex font-semibold py-2 border rounded-xl w-full justify-center text-white  rgba(93, 149, 230, 1), 
              ${ (name && description && file && owners && status == FILE_STATUS.DONE ) ? 'bg-gradient-to-r from-[#5D95E6] to-[#935AFF]' : 'bg-gray-400' }
            `}
          >
            Confirmar criação do modelo
          </button>

          {
            status == FILE_STATUS.ERROR &&
            <p className='text-red-400 font-medium mt-4'> Erro ao fazer o upload. Tente novamente mais tarde! </p>
          }

        </form>
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

  return {
    props: { session }
  }
})