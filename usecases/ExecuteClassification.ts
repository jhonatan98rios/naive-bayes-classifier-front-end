import { Session } from "next-auth";

type Sample = {
  sample: string
  id: string
}

type Response = {
  classification: string
}

export const executeClassification = async (data: Sample, session: Session) => {

    const response = await fetch(process.env.NEXT_PUBLIC_CLASSIFY_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //@ts-ignore
        "Authorization": session?.accessToken,
      },
      body: JSON.stringify(data),
    });

    const json = await response.json()
    return json as Response
}