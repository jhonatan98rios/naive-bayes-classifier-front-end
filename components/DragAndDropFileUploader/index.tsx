import { DropzoneComponent } from './DropzoneComponent'
import { formatFileSize } from '@/usecases/FileUpload'
import { Condition } from '../Condition'
import { ProgressBar } from './ProgressBar'
import { FILE_STATUS } from '@/domain/entities/FileStatus'


interface IDragAndDropFileUploader {
  handleFileChange: Function
  file: File 
  setFile: (file: File | undefined) => void
  status: FILE_STATUS
  setStatus: (status: FILE_STATUS) => void
}

export const DragAndDropFileUploader = ({ handleFileChange, file, setFile, status, setStatus }: IDragAndDropFileUploader) => {

  function handleCancel() {
    setStatus(FILE_STATUS.NOFILE)
    setFile(undefined)
  }

  return (
    <div>
      <Condition condition={status == FILE_STATUS.NOFILE}>
        <div className='dag-and-drop'>
          <p className='text-base font-semibold text-gray-500 mb-2'> 
            Faça o upload do arquivo de treino 
          </p>
          <DropzoneComponent handleDrop={handleFileChange} />
        </div>
      </Condition>

      <Condition condition={[FILE_STATUS.LOADING, FILE_STATUS.DONE].includes(status)}>
        <div>
          <ProgressBar status={status}  />

          <p className="text-xs text-purple-500 text-center mt-3 cursor-pointer" onClick={handleCancel}>
            { status == FILE_STATUS.LOADING ? 'Cancelar Upload' : 'Substituir arquivo' }
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

      <Condition condition={status == FILE_STATUS.ERROR}>
        <p> Error </p>
      </Condition>
    </div>
  )
}