import type { CookieOptions } from 'hono/utils/cookie'
import app from '@/server'
import { AuthType } from '@/service/auth.service'
import { discordAuth } from '@hono/oauth-providers/discord'
import { githubAuth } from '@hono/oauth-providers/github'
import { googleAuth } from '@hono/oauth-providers/google'
import { getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

const COOKIE_NAME = 'token'
const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as CookieOptions

// 鉴权中间件
app.use('*', async (c, next) => {
  // 跳过登录相关路由
  if (c.req.path.startsWith('/api/auth/')) {
    return next()
  }

  const token = getCookie(c, COOKIE_NAME)
  const authService = c.get('authService')

  if (!token) {
    throw new HTTPException(401, {
      message: 'Unauthorized',
    })
  }

  const user = await authService.verifyJwt(token)
  c.set('user', user)
  return next()
})

app.get(
  'auth/google',
  googleAuth({
    scope: ['email', 'profile'],
  }),
  async (c) => {
    const googleUser = c.get('user-google')
    const authService = c.get('authService')
    const { user, token } = await authService.login(AuthType.GOOGLE, googleUser)

    // set cookie
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS)

    return c.json({
      user,
      token,
    })
  },
)

app.get(
  'auth/discord',
  discordAuth({
    scope: ['identify', 'email'],
  }),
  async (c) => {
    const discordUser = c.get('user-discord')
    const authService = c.get('authService')
    const { user, token } = await authService.login(AuthType.DISCORD, discordUser)

    // set cookie
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS)

    return c.json({
      user,
      token,
    })
  },
)

app.get(
  'auth/github',
  githubAuth({
    scope: ['user:email'],
  }),
  async (c) => {
    const githubUser = c.get('user-github')
    const authService = c.get('authService')
    const { user, token } = await authService.login(AuthType.GITHUB, githubUser)

    // set cookie
    setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS)

    return c.json({
      user,
      token,
    })
  },
)
