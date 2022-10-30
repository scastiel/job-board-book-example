import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useCurrentUser } from '../lib/hooks'

export const AuthMenu = () => {
  const { user, loading } = useCurrentUser()

  if (loading) {
    return <>Loading…</>
  }

  if (user === null) {
    return (
      <a href="#" onClick={() => signIn()}>
        Sign in
      </a>
    )
  }

  return (
    <>
      <Link href="/private/create">Post a job</Link> · {user.name} (
      <a href="#" onClick={() => signOut({ callbackUrl: '/' })}>
        Sign out
      </a>
      )
    </>
  )
}
