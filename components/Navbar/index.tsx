import { signOut, useSession } from "next-auth/react";
import { Profile } from "./Profile";
import { ExpandableIconButton } from "./ExpandableIconButton";
import { useState } from "react";
import { useRouter } from "next/router";


export default function Navbar({  }) {

  const { data: session } = useSession()
  const [isExpanded, setExpanded] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    signOut()
  }

  return (session && session.user) && (
    <nav
      className="flex flex-col fixed h-[calc(100%-16px)] top-2 left-2 p-5 bg-white z-10 items-start shadow-md drop-shadow-sm rounded-lg"
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
            handleClick={() => { router.push('/classifiers?visibility=private') }}
          />
        </li>

        <li>
          <ExpandableIconButton
            alt="Ícone de comunidade"
            text="Comunidade"
            isExpanded={isExpanded}
            handleClick={() => { router.push('/classifiers?visibility=public') }}
          />
        </li>

        <li>
          <ExpandableIconButton
            alt="Ícone de notificações"
            text="Notificações"
            isExpanded={isExpanded}
            handleClick={() => { }}
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