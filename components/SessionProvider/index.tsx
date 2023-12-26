import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

interface ProviderProps {
    children: React.ReactNode,
    session?: Session 
}

export const Provider = ({ children, session }: ProviderProps) => {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}