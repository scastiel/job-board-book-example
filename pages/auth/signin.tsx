import { GetServerSideProps, NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { getCurrentUser } from '../../lib/user_server'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser({ req: context.req })
  if (user) {
    return {
      redirect: {
        destination: String(context.query.callbackUrl || '/'),
        permanent: false,
      },
    }
  }

  return { props: {} }
}

const SignInPage: NextPage = () => {
  useEffect(() => {
    signIn('github')
  }, [])

  return null
}

// SECOND VERSION:
//
// const SignInPage: NextPage = () => {
//   const go = () => signIn('github')
//
//   useEffect(() => {
//     const timeout = setTimeout(go, 5000)
//     return () => clearTimeout(timeout)
//   }, [])
//
//   return (
//     <Layout title="Sign in">
//       <p>
//         You will be redirected to GitHub for authentication in five seconds.
//       </p>
//       <p>
//         <a href="#" onClick={() => go()}>
//           Sign in with GitHub
//         </a>
//       </p>
//     </Layout>
//   )
// }

export default SignInPage
