import type { DiscordUser } from '@hono/oauth-providers/discord'
import type { GoogleUser } from '@hono/oauth-providers/google'
import { BaseService } from '@/core/base.service'
import { HTTPException } from 'hono/http-exception'

export class AuthService extends BaseService {
  async findOrCreateGoogleUser(googleUser?: Partial<GoogleUser>) {
    if (!googleUser) {
      throw new HTTPException(400, {
        message: 'Google user not found',
      })
    }
    const existingUser = await this.prisma.user.findFirst({
      where: {
        googleId: googleUser.id,
      },
    })

    if (existingUser) {
      return existingUser
    }

    return await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        firstName: googleUser.given_name,
        lastName: googleUser.family_name,
        avatar: googleUser.picture,
        googleId: googleUser.id,
      },
    })
  }

  async findOrCreateDiscordUser(discordUser?: Partial<DiscordUser>) {
    if (!discordUser) {
      throw new HTTPException(400, {
        message: 'Discord user not found',
      })
    }
    const existingUser = await this.prisma.user.findFirst({
      where: {
        discordId: discordUser.id,
      },
    })

    if (existingUser) {
      return existingUser
    }

    return await this.prisma.user.create({
      data: {
        email: discordUser.email,
        name: discordUser.username,
        avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        discordId: discordUser.id,
      },
    })
  }
}
