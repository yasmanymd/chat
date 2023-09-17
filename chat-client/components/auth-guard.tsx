// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { signOut, useSession } from 'next-auth/react'

const AuthGuard = props => {
  const { children, fallback } = props
  const session = useSession()
  const router = useRouter()
  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (router.route != '/login' && router.route != '/register') {
        let redirect = session.status === 'unauthenticated';
        if (!redirect && session.status == 'authenticated') {
          const tokenExp = session.data.user.accessToken.exp * 1000;
          redirect = Date.now() > tokenExp;
        }
        if (redirect) {
          if (router.asPath !== '/') {
            signOut({ callbackUrl: router.asPath, redirect: false }).then(() => {
              window.location.replace('/login');
            });
          } else {
            signOut({ callbackUrl: '/', redirect: false }).then(() => {
              window.location.replace('/login');
            });
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, session.status]
  )

  return <>{children}</>
}

export default AuthGuard
