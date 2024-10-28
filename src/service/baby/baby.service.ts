import type { BabyPatch, BabyPost } from '@/zodSchemas/Baby'
import type { z } from '@hono/zod-openapi'
import { BaseService } from '@/base/base.service'
import { baby } from '~drizzle/schema'
import { eq } from 'drizzle-orm'

export class BabyService extends BaseService {
  constructor(private readonly d1: D1Database) {
    super(d1)
  }

  getById(id: number) {
    return this.db.query.baby.findFirst({
      with: {
        avatar: {
          with: {
            bucket: true,
          },
        },
      },
      where: eq(baby.id, id),
    })
  }

  async updateById(id: number, json: z.infer<typeof BabyPatch>) {
    await this.db
      .update(baby)
      .set(json)
      .where(eq(baby.id, id))

    return this.getById(id)
  }

  async create(json: z.infer<typeof BabyPost>) {
    const { id } = await this.db
      .insert(baby)
      .values(json)
      .returning({
        id: baby.id,
      })
      .get()

    return this.getById(id)
  }
}
