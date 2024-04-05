import {  Dispatch, SetStateAction } from 'react'
import { DragAndDropFileUploader } from '@/components/DragAndDropFileUploader';
import { MultiEmailInput } from '@/components/MultiEmailInput';
import { FILE_STATUS } from '@/domain/entities/FileStatus';
import { VISIBILITY } from '@/domain/entities/Visibility';

interface IPublishView {
  handleSubmit: (e: any) => Promise<void>,
  handleFileChange: ([file]: File[]) => Promise<void>,
  name: string, 
  setName: Dispatch<SetStateAction<string>>,
  description: string, 
  setDescription:  Dispatch<SetStateAction<string>>,
  type: string,
  setType: Dispatch<SetStateAction<string>>,
  owners: string[], 
  setOwners:  Dispatch<SetStateAction<string[]>>,
  visibility: VISIBILITY, 
  setVisibility:  Dispatch<SetStateAction<VISIBILITY>>,
  file:  File | undefined, 
  setFile:  Dispatch<SetStateAction<File | undefined>>,
  status: FILE_STATUS, 
  setStatus:  Dispatch<SetStateAction<FILE_STATUS>>
}

export default function PublishView({
  handleSubmit,
  handleFileChange,
  name, setName,
  description, setDescription,
  type, setType,
  owners, setOwners,
  visibility, setVisibility,
  file, setFile,
  status, setStatus
}: IPublishView) {

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

              <div className='flex flex-col mb-4'>
                <label htmlFor="" className='mb-2 font-semibold text-gray-500'> Tipo de modelo: </label>
                <select
                  id="classifier_type"
                  name="classifier_type"
                  className='w-80 border rounded border-gray-300 py-2 px-4 resize-y text-gray-700'
                  value={type} onChange={(e) => setType(e.target.value)}
                >
                  <option className='text-gray-700' value={"num"}> Classificação Tradicional Numérica </option>
                  <option className='text-gray-700' value={"nlp"}> Processamento de Linguagem Natural </option>
                </select>
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
