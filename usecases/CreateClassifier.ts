import { CreateClassifierDTO } from "@/domain/dtos/CreateClassifierDTO"
import { Session } from "next-auth"

export const createClassifier = async (createClassifierDTO: CreateClassifierDTO, session: Session) => {

  console.log('classifierData:')
  console.log(createClassifierDTO)

  try {
    const res = await fetch('http://localhost:3001/publish', {
      method: 'POST',
      body: JSON.stringify(createClassifierDTO),
      headers: {
        "Content-Type": "application/json",
        //@ts-ignore
        "Authorization": session?.accessToken,
      },
    })

    console.log(res)

  } catch (err) {

    console.log('err')
    console.log(err)
    throw Error(JSON.stringify(err))

  }
}