import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  // If we forget to set these variables, the application won’t start!
  throw new Error('Missing GitHub app environment variables')
}

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
})
