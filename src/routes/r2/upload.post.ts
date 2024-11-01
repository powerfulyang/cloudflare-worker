import type { AppEnv } from '@/core'
import { getAppInstance, getDrizzleInstance } from '@/core'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { UploadResult } from '@/zodSchemas/Upload'
import { createRoute, z } from '@hono/zod-openapi'
import { bucket, upload } from '~drizzle/schema/upload'
import { eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { sha256 } from 'hono/utils/crypto'

const PostUpload = getAppInstance()

const route = createRoute({
  method: 'post',
  path: '',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z
            .object(
              {
                file: z.instanceof(File),
              },
            )
            .openapi('UploadFile'),
        },
      },
    },
  },
  responses: JsonResponse(UploadResult),
})

export async function uploadFile(file: File) {
  const c = getContext<AppEnv>()
  const env = c.env
  const bucketName = c.env.BUCKET_NAME
  const hash = (await sha256(await file.arrayBuffer()))!
  const db = getDrizzleInstance(env.DB)

  // 判断文件是否已经上传, 使用 head 方法
  const head = await env.BUCKET.head(hash)
  if (!head) {
    await env.BUCKET.put(hash, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
      sha256: hash,
    })
  }

  const mediaType = file.type

  const result = await db
    .insert(upload)
    .values({ hash, bucketName, mediaType })
    .returning()
    .get()

  return db.query.upload.findFirst({
    where: eq(bucket.id, result.id),
    with: {
      bucket: true,
    },
  })
}

PostUpload.openapi(route, async (c) => {
  const form = c.req.valid('form')
  const file = form.file

  const result = await uploadFile(file)

  return c.json(result)
})

export default PostUpload
