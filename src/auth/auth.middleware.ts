import app from '@/server'
import { googleAuth } from '@hono/oauth-providers/google'

app.get(
  'auth/google', // -> redirect_uri by default
  googleAuth({
    scope: ['email', 'profile'],
  }),
  (c) => {
    const token = c.get('token')
    const grantedScopes = c.get('granted-scopes')
    const user = c.get('user-google')

    return c.json({
      token,
      grantedScopes,
      user,
    })
  },
)
