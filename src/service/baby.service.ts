import type { BabyPatch, BabyPost, BabyResult } from '@/zodSchemas/Baby'
import type { z } from '@hono/zod-openapi'
import { BaseService } from '@/core/base.service'
import { baby } from '~drizzle/schema'
import { eq } from 'drizzle-orm'

export class BabyService extends BaseService {
  constructor(private readonly d1: D1Database) {
    super(d1)
  }

  async getById(id: number): Promise<z.infer<typeof BabyResult> | undefined> {
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
  }

  async create(json: z.infer<typeof BabyPost>) {
    await this.db
      .insert(baby)
      .values(json)
      .execute()
  }
}
