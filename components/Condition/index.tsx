interface ICondition {
  condition: boolean
  children: JSX.Element
}

export function Condition({ condition, children }: ICondition) {
  return condition && children
}