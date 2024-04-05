import Dropzone from 'react-dropzone';


export const DropzoneComponent = ({ handleDrop }: any) => {

  return (
    <Dropzone
      onDrop={handleDrop}
    >
      {({ getRootProps, getInputProps }) => (

        <div
          {...getRootProps()}
          className='border-2 border-dashed border-gray-300 text-center flex flex-col justify-center items-center rounded-2xl pt-12 pb-8 h-80'
        >
          <input {...getInputProps()} multiple={false} />

          <div className='w-56 flex flex-col justify-center items-center'>
            <img className='w-24 h-16 mb-4' src="/upload.svg" alt="" />

            <p className='font-semibold text-gray-500 text-base'> Solte aqui um arquivo <br/> ou clique para selecionar </p>
            <p className='text-xs text-gray-500 font-light mt-2'> Formatos permitidos: text/csv </p>
          </div>

        </div>
      )}
    </Dropzone>
  )
}