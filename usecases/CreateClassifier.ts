import { CreateClassifierDTO } from "@/domain/dtos/CreateClassifierDTO"
import { Session } from "next-auth"

export const createClassifier = async (createClassifierDTO: CreateClassifierDTO, session: Session) => {

  console.log('classifierData:')
  console.log(createClassifierDTO)

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_PUBLISH_ENDPOINT!, {
      method: 'POST',
      body: JSON.stringify(createClassifierDTO),
      headers: {
        "Content-Type": "application/json",
        //@ts-ignore
        "Authorization": session?.accessToken,
      },
    })

    const json = await res.json()
    console.log(json)

  } catch (err) {

    console.log(err)
    throw new Error(`Erro ao fazer a publicação: ${err}`)

  }
}