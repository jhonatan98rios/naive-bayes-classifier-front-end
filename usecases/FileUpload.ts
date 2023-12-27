export const fileValidation = (file: File) => {

  if (file.type !== 'text/csv') return false
  if (file.size > 1024 * 1024 * 5) return false

  return true
}

export const uploadFile = async (file: File) => {

  if (!file) return

  const formData = new FormData()
  formData.append('filename', file.name)
  formData.append('file', file)

  return formData

  // const uploadRes = await fetch('http://localhost:3001/upload', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {
  //     "Access-Control-Allow-Origin": "http://localhost:3000",
  //     //@ts-ignore
  //     "Authorization": session?.accessToken,
  //   }
  // })

  // const fileUploadRes = await uploadRes.json()

  // console.log(fileUploadRes)
  // return fileUploadRes
}


export const formatFileSize = (number: number) => {
  const kb = 1024
  const mb = kb * kb
  
  return number > mb 
    ? (number / mb).toFixed(2) + ' mb'
    : (number / kb).toFixed(2) + ' kb'
}