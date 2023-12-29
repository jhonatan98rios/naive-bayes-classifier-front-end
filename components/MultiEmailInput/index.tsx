import { Dispatch, SetStateAction, useState } from "react"

interface IMultiEmailInput {
  owners: string[]
  setOwners: Dispatch<SetStateAction<string[]>>
}

export function MultiEmailInput({ owners, setOwners }: IMultiEmailInput) {

  const [value, setValue] = useState('')

  function handleExcludeOwner(owner: string) {

    setOwners(owners => {
      return owners.filter(email => owner !== email)
    })
  }

  function handlePressEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key == 'Tab') {
      setOwners(owners => {
        if (owners.includes(value)) return owners
        return [...owners, value]
      })

      setValue('')
    }
  }

  return (
    <>
      <label className='mb-2 font-semibold text-gray-500 flex flex-wrap items-start gap-2'> 
        <span> Proprietarios pelo modelo: </span>
        {
          owners.map((owner, index) => (
            <span className="text-xs bg-slate-300 py-1 px-2 rounded-md" key={index}> 
              { owner } 
              <span className="ml-1" onClick={() => handleExcludeOwner(owner)}> 
                ✕ 
              </span>
            </span>
          ))
        }
      </label>

      <input
        type="text"
        id='classifier_owners'
        name="classifier_owners"
        className='w-full border rounded border-gray-300 py-2 px-4'
        value={value} onChange={(e) => setValue(e.target.value)}
        onKeyUp={e => handlePressEnter(e)}
      />
    </>
  )
}