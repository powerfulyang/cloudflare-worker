import app from '@/server'
import { discordAuth } from '@hono/oauth-providers/discord'
import { googleAuth } from '@hono/oauth-providers/google'

app.get(
  'auth/google',
  googleAuth({
    scope: ['email', 'profile'],
  }),
  async (c) => {
    const googleUser = c.get('user-google')
    const authService = c.get('authService')
    const user = await authService.findOrCreateGoogleUser(googleUser)

    return c.json({
      user,
    })
  },
)

app.get(
  'auth/discord',
  discordAuth({
    scope: ['email', 'identify'],
  }),
  async (c) => {
    const discordUser = c.get('user-discord')
    const authService = c.get('authService')
    const user = await authService.findOrCreateDiscordUser(discordUser)

    return c.json({
      user,
    })
  },
)
