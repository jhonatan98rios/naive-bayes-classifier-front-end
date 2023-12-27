import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';


const DragAndDrop = () => {

  const onDrop = useCallback(([ file ]: any) => {

    setUploadedFile(file);

    /* Send file data by Context API */
    
  }, [])

  const [ uploadedFile, setUploadedFile ] = useState();


  return (
    <Dropzone 
      onDrop={onDrop} 
    >
      { ({getRootProps, getInputProps}) => (

        <div 
          {...getRootProps()} 
          className='border-2 border-dashed border-gray-500 w-11/12 max-w-3xl mx-auto text-center flex flex-col justify-center items-center rounded-2xl py-16 mt-60'
        >
          <p className='text-xl font-medium text-gray-500'> 
            Actually, there is no classifiers.
          </p>

          <p className='text-base mb-4 text-gray-500'>
            Drag and Drop a file or click on button bellow to create a new classifier.
          </p>

          <div className='w-12 h-12 rounded-full p-3 bg-white shadow-sm drop-shadow-md'>
            <img src="/plus.svg" alt="" />
          </div>

          <p> { JSON.stringify(uploadedFile) }  </p>
        </div>

      )}
    </Dropzone>
  );
};
export default DragAndDrop;