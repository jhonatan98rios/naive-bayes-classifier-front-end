import { Session } from "next-auth"

export const fileValidation = (file: File) => {

  if (file.type !== 'text/csv') return false
  if (file.size > 1024 * 1024 * 5) return false

  return true
}

export const uploadFile = async (file: File, session: Session) => {

  if (!file) return

  const formData = new FormData()
  formData.append('filename', file.name)
  formData.append('file', file)

  try {
    const uploadRes = await fetch(process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT!, {
      method: 'POST',
      body: formData,
      headers: {
        //@ts-ignore
        "Authorization": session?.accessToken,
      }
    })
  
    const fileUploadRes = await uploadRes.json()
  
    console.log('fileUploadRes')
    console.log(fileUploadRes)
    
    return fileUploadRes
  }
  catch (err) {
    console.log(err)
    throw new Error(`Erro ao fazer o upload: ${err}`)
  }

}


export const formatFileSize = (number: number) => {
  const kb = 1024
  const mb = kb * kb
  
  return number > mb 
    ? (number / mb).toFixed(2) + ' mb'
    : (number / kb).toFixed(2) + ' kb'
}