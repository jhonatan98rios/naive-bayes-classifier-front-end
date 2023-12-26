
interface LogInAvatarProps {
  email: string,
  name: string,
  image: string,

}

export function LogInAvatar({ email, name, image }: LogInAvatarProps) {
  return (
    <div className="flex flex-col">
      <img src={image} alt={`${name} avatar`} />
      <p> Name: { name }  </p>
      <p> Email: { email }  </p>
    </div>
  )
}