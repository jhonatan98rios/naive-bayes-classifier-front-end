import { PropsWithChildren } from "react"

interface ICondition {
  condition: boolean
}

export function Condition({ condition, children }: PropsWithChildren<ICondition>) {
  return condition && children
}