import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation';
import { ClassifierDTO } from '@/domain/entities/Classifier';
import { Spinner } from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { authOptions } from '../api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

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

  const uploadFile = async (file: File) => {

    if (!file) return

    const formData = new FormData()
    formData.append('filename', file.name)
    formData.append('file', file)

    const uploadRes = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        //@ts-ignore
        "Authorization": session?.accessToken,
      }
    })

    const fileUploadRes = await uploadRes.json()

    console.log(fileUploadRes)
    return fileUploadRes
  }

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
      <div>
        <h1 className='text-2xl mb-4 font-semibold text-blue-700'> Publish a new model </h1>

        <form className='flex flex-col'>

          <label htmlFor="" className='mb-2'> Classifier name: </label>
          <input 
            type="text" 
            name="classifier_name"
            className='w-80 mb-4 border rounded border-blue-500 py-2 px-4'
            value={name} onChange={(e) => setName(e.target.value)} 
          />

          <label htmlFor="visibility"> Classifier visibility </label>
          <select 
            id="visibility" 
            name="visibility" 
            value={visibility} 
            className='w-64 mt-2 mb-4' 
            onChange={(e) => setVisibility( e.target.value as any )}
          >
            <option value={VISIBILITY.public}> Public </option>
            <option value={VISIBILITY.private}> Private </option>
          </select>

          <label htmlFor="file" className='mb-2'> File Upload: </label>
          <input 
            type="file" 
            name="file" 
            id="file" 
            onChange={handleFileChange} 
          />

          {
            status == STATUS.LOADING && <Spinner />
          }

          {
            status == STATUS.DONE &&
            <>
              <p className='my-4'> File path: { path } </p>
              <button 
                onClick={handleUploadClick} 
                className="flex bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded w-56 justify-center"
              >
                Upload
              </button>
            </>
          }

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