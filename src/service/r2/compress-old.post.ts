import { compressImage } from '@/utils/compressImage'
import { createRoute } from '@hono/zod-openapi'
import { upload } from '~drizzle/schema/upload'
import { asc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { sha1 } from 'hono/utils/crypto'

const route = createRoute({
  method: 'post',
  path: '/api/compress-old',
  responses: {
    200: {
      description: 'Success',
    },
  },
})

appServer.openapi(route, async (c) => {
  const db = drizzle(c.env.DB)
  const all = await db
    .select()
    .from(upload)
    .orderBy(asc(upload.updatedAt))
  for (const item of all) {
    const obj = {
      key: item.hash,
    }
    const res = await c.env.MY_BUCKET.get(obj.key)
    if (!res) {
      await db
        .delete(upload)
        .where(eq(upload.hash, obj.key))
      continue
    }
    const file = new File([await res.arrayBuffer()], obj.key)
    const buffer = await compressImage(file)
    if (!buffer) {
      continue
    }
    const thumbnailHash = (await sha1(buffer))!
    await c.env.MY_BUCKET.put(thumbnailHash, buffer)
    await db
      .update(upload)
      .set({ thumbnailHash, updatedAt: new Date() })
      .where(eq(upload.hash, obj.key))
      .execute()
  }
  return c.json({
    success: true,
  })
})
