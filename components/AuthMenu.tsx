import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export const AuthMenu = () => {
  const { data: session, status } = useSession()

  switch (status) {
    case 'loading':
      return <>Loading…</>
    case 'unauthenticated':
      return (
        <a href="#" onClick={() => signIn()}>
          Sign in
        </a>
      )
    case 'authenticated':
      return (
        <>
          <Link href="/private/create">Post a job</Link> · {session.user?.name}{' '}
          (
          <a href="#" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </a>
          )
        </>
      )
  }
}
