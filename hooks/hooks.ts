import { useEffect, useRef } from "react"

export default function useDidMount(callback: Function) {
  const didMount = useRef(false)

  useEffect(() => {
    if (callback && !didMount.current) {
      didMount.current = true
      callback()
    }
  })
}

/* TODO: Tratar no getServerSideProps de cada página */
export async function validateToken(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_GOOGLE_OAUTH2!}=${token}`)
  const data = await res.json()
  
  if(data.error == "invalid_token" || !data.email) {
    console.log("Erro ao autenticar")
    return false
  }

  return true
}


/* 
issued_to: "486371358243-1ndqu4s13infhek1b8doju0pv1v98ovh.apps.googleusercontent.com",
audience: "486371358243-1ndqu4s13infhek1b8doju0pv1v98ovh.apps.googleusercontent.com",
user_id: "108352607482705323746",
scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
expires_in: 3445,
email: "jhonatan98rios@gmail.com",
verified_email: true,
access_type: "online"
*/