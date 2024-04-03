import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account"
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        console.log("account.access_token")
        console.log(account.access_token)
      }
      return token
    },
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      console.log("token.access_token")
      console.log(token.access_token)
      return session
    }
  }

} satisfies NextAuthOptions
