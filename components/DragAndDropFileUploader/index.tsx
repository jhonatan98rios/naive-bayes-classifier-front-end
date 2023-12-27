import { DropzoneComponent } from './DropzoneComponent';
import { uploadFile, fileValidation, formatFileSize } from '@/usecases/FileUpload';
import { Condition } from '../Condition';
import { ProgressBar } from './ProgressBar';
import { useState } from 'react';


/* 
[x] Upload de arquivo 
[x] Drag and Drop
[ ]
[ ]
[ ]
[ ]
*/

enum STATUS {
  NOFILE = 0,
  LOADING = 1,
  DONE = 2,
  ERROR = 3
}

interface IDragAndDropFileUploader {
  status: STATUS,
  setStatus: (status: STATUS) => void,
}

export const DragAndDropFileUploader = ({ status, setStatus }: IDragAndDropFileUploader) => {

  const [ file, setFile ] = useState<File>()

  async function handleDrop([file]: File[]) {
    
    if (!fileValidation(file)) console.log("invalid file")

    const uploadedFile = await uploadFile(file)
    console.log(uploadedFile)

    setStatus(STATUS.LOADING)
    setFile(file)
  }

  function handleUploadComplete() {
    setStatus(STATUS.DONE)
  }

  function handleCancel() {
    setStatus(STATUS.NOFILE)
    setFile(undefined)
  }

  return (
    <div>
      <Condition condition={status == STATUS.NOFILE}>
        <div className='dag-and-drop'>
          <p className='text-base font-semibold text-gray-500 mb-2'> 
            Faça o upload do arquivo de treino 
          </p>
          <DropzoneComponent handleDrop={handleDrop} />
        </div>
      </Condition>

      <Condition condition={[STATUS.LOADING, STATUS.DONE].includes(status)}>
        <div>
          <ProgressBar status={status} handleComplete={handleUploadComplete}  />

          <p className="text-xs text-purple-500 text-center mt-3 cursor-pointer" onClick={handleCancel}>
            { status == STATUS.LOADING ? 'Cancelar Upload' : 'Substituir arquivo' }
          </p>

          <Condition condition={!!file}>
            <div className='mt-12 text-sm text-gray-500 font-semibold'>
              <p> Nome do arquivo: {file?.name} </p>
              <p> Tamanho do arquivo: { formatFileSize(file?.size!) } </p>
              <p> Formato do arquivo: {file?.type} </p>
            </div>
          </Condition>
        </div>
      </Condition>

      <Condition condition={status == STATUS.ERROR}>
        <p> Error </p>
      </Condition>
    </div>
  )
}