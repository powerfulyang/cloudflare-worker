import type { BabyPatch, BabyPost, BabyResult } from '@/zodSchemas/Baby'
import type { z } from '@hono/zod-openapi'
import { BaseService } from '@/core/base.service'
import { baby } from '~drizzle/schema'
import { eq } from 'drizzle-orm'

export class BabyService extends BaseService {
  async getById(id: number): Promise<z.infer<typeof BabyResult> | undefined> {
    return this.drizzle.query.baby.findFirst({
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
    await this.drizzle
      .update(baby)
      .set(json)
      .where(eq(baby.id, id))
  }

  async create(json: z.infer<typeof BabyPost>) {
    await this.drizzle
      .insert(baby)
      .values(json)
      .execute()
  }
}
