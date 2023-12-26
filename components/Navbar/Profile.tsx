
interface ProfileProps {
  name: string
  email: string
  image: string
  isExpanded: boolean
}

export function Profile({ name, email, image, isExpanded }: ProfileProps) {

  return (
    <div className="flex items-center justify-center mb-6">
      <img
        className="w-8 h-8"
        src={image}
        alt=""
      />

      {
        isExpanded &&
        <div className="flex items-center ml-2">
          <div className="flex flex-col">
            <p className="text-xs font-medium"> {name} </p>
            <p className="text-[8px]"> {email} </p>
          </div>
        </div>
      }

    </div>
  )
}