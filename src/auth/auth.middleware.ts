import app from '@/server'
import { discordAuth } from '@hono/oauth-providers/discord'
import { googleAuth } from '@hono/oauth-providers/google'

app.get(
  'auth/google', // -> redirect_uri by default
  googleAuth({
    scope: ['email', 'profile'],
  }),
  (c) => {
    const user = c.get('user-google')

    return c.json({
      user,
    })
  },
)

app.get(
  'auth/discord',
  discordAuth({
    scope: ['email', 'identify'],
    redirect_uri: 'https://tunnel.littleeleven.com/api/auth/discord',
  }),
  (c) => {
    const user = c.get('user-discord')

    return c.json({
      user,
    })
  },
)
