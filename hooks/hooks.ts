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


