import { signOut, useSession } from "next-auth/react";
import { Profile } from "./Profile";
import { ExpandableIconButton } from "./ExpandableIconButton";
import { useState } from "react";


export default function Navbar({ }) {

  const { data: session } = useSession()
  const [ isExpanded, setExpanded ] = useState(false)


  async function handleSignOut() {
    signOut()
  }

  return (session && session.user) && (
    <nav 
      className="flex flex-col fixed h-full p-5 bg-white z-10 items-start shadow-2xl" 
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {
        (session && session.user && session.user.name) &&
        <Profile
          name={session?.user?.name!}
          email={session?.user?.email!}
          image={session?.user?.image!}
          isExpanded={isExpanded}
        />
      }

      <ul className="flex flex-col items-start justify-start w-full">
        <li>
          <ExpandableIconButton
            alt="Ícone de modelos"
            text="Modelos"
            isExpanded={isExpanded}
            handleClick={() => {}}
          />
        </li>

        <li>
          <ExpandableIconButton
            alt="Ícone de comunidade"
            text="Comunidade"
            isExpanded={isExpanded}
            handleClick={() => {}}
          />
        </li>

        <li>
          <ExpandableIconButton
            alt="Ícone de notificações"
            text="Notificações"
            isExpanded={isExpanded}
            handleClick={() => {}}
          />
        </li>
      </ul>

      <ul className="flex flex-col items-start justify-start w-full mt-auto mb-0">
        <li>
          <ExpandableIconButton
            alt="Ícone de sair"
            text="Sair"
            isExpanded={isExpanded}
            handleClick={handleSignOut}
          />
        </li>

        <li>
          <ExpandableIconButton
            alt="Ícone de informações"
            text="Sobre o sistema"
            isExpanded={isExpanded}
            handleClick={handleSignOut}
          />
        </li>
      </ul>
    </nav>
  )
}