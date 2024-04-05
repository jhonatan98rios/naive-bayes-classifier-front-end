import { useState } from 'react'
import { useRouter } from 'next/navigation';

import { fileValidation, uploadFile } from '@/usecases/FileUpload';
import { createClassifier } from '@/usecases/CreateClassifier';
import { CreateClassifierDTO } from '@/domain/dtos/CreateClassifierDTO';
import { FILE_STATUS } from '@/domain/entities/FileStatus';
import { VISIBILITY } from '@/domain/entities/Visibility';

export function usePublishModel({ session }: any) {

  const router = useRouter();

  const [id, setId] = useState()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [owners, setOwners] = useState<string[]>([])
  const [visibility, setVisibility] = useState<VISIBILITY>(VISIBILITY.public)
  const [file, setFile] = useState<File>()
  const [path, setPath] = useState()
  const [status, setStatus] = useState<FILE_STATUS>(FILE_STATUS.NOFILE)

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

  return {
    handleSubmit,
    handleFileChange,
    id, setId,
    name, setName,
    description, setDescription,
    owners, setOwners,
    visibility, setVisibility,
    file, setFile,
    path, setPath,
    status, setStatus
  }
}