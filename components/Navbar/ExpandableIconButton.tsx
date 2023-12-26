interface IExpandableIconButton {
  icon?: string
  alt: string
  text: string
  isExpanded: boolean
  handleClick: () => void
}

export function ExpandableIconButton({ text, icon="https://static.thenounproject.com/png/778835-200.png", alt, isExpanded, handleClick }: IExpandableIconButton) {
  return (
    <div className="flex items-center justify-center py-4">
      <button onClick={handleClick} className="flex items-center">
        <img
          className="w-6 mx-[6px]"
          src={icon}
          alt={alt}
        />

        {
          isExpanded &&
          <p className="ml-2 text-xs font-medium"> {text} </p>
        }

      </button>
    </div>
  )
}