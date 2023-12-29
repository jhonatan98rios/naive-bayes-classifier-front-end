import { Session } from "next-auth";

type Sample = {
  sample: string
  id: string
}

type Response = {
  classification: string
}

export const executeClassification = async (data: Sample, session: Session) => {

    const response = await fetch('http://localhost:3002/classify', {
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