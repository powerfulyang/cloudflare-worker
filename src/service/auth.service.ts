import type { Prisma, User } from '#/prisma/client'
import type { DiscordUser } from '@hono/oauth-providers/discord'
import type { GitHubUser } from '@hono/oauth-providers/github'
import type { GoogleUser } from '@hono/oauth-providers/google'
import { BaseService } from '@/core/base.service'
import { HTTPException } from 'hono/http-exception'
import { sign, verify } from 'hono/jwt'

export enum AuthType {
  GOOGLE = 'google',
  DISCORD = 'discord',
  GITHUB = 'github',
}

type AuthUser = Partial<GoogleUser | DiscordUser | GitHubUser>

export class AuthService extends BaseService {
  // jwt sign
  async signJwt(user: User, secret: string = this.jwtSecret) {
    return await sign({
      user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
    }, secret)
  }

  // jwt verify
  async verifyJwt(token: string, secret: string = this.jwtSecret) {
    const { user } = await verify(token, secret)
    return user as User
  }

  async login(type: AuthType, user?: AuthUser) {
    const dbUser = await this.findOrCreateUser(type, user)
    const token = await this.signJwt(dbUser)
    return {
      user: dbUser,
      token,
    }
  }

  private async findOrCreateUser(type: AuthType, user?: AuthUser) {
    if (!user) {
      throw new HTTPException(400, {
        message: `${type} user not found`,
      })
    }

    if ('email' in user && user.email) {
      // use email to find user
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      })
      // update oauth user id
      if (existingUser) {
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { [`${type}Id`]: user.id },
        })
      }
    }

    const existingUser = await this.prisma.user.findFirst(
      {
        where: {
          [`${type}Id`]: user.id,
        },
      },
    )

    if (existingUser) {
      return existingUser
    }

    let userData: Prisma.UserCreateInput

    switch (type) {
      case AuthType.GOOGLE: {
        const googleUser = user as Partial<GoogleUser>
        userData = {
          email: googleUser.email!,
          nickname: googleUser.name,
          avatar: googleUser.picture,
        }
        break
      }
      case AuthType.DISCORD: {
        const discordUser = user as Partial<DiscordUser>
        userData = {
          email: discordUser.id!,
          nickname: discordUser.global_name,
          avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        }
        break
      }
      case AuthType.GITHUB: {
        const githubUser = user as Partial<GitHubUser>
        userData = {
          email: githubUser.email!,
          nickname: githubUser.name,
          avatar: githubUser.avatar_url,
        }
        break
      }
    }

    return this.prisma.user.create({
      data: userData,
    })
  }
}
