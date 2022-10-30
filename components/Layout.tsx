import Head from 'next/head'
import { PropsWithChildren } from 'react'
import Link from 'next/link'
import { AuthMenu } from './AuthMenu'

export interface Props {
  title?: string
}

export const Layout = ({ title, children }: PropsWithChildren<Props>) => {
  return (
    <>
      <Head>
        <title>{`${title ? `${title} · ` : ''}My job board`}</title>
      </Head>
      <header>
        <h1>My Job Board</h1>
        <nav>
          <Link href="/">Home</Link> · <Link href="/about">About</Link> ·{' '}
          <AuthMenu />
        </nav>
        <hr />
      </header>
      <main>{children}</main>
    </>
  )
}
