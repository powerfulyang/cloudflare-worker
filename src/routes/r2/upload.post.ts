import { getAppInstance, getDrizzleInstance } from '@/core'
import { isLocalDev } from '@/utils'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { Upload } from '@/zodSchemas/Upload'
import { createRoute, z } from '@hono/zod-openapi'
import { bucket, upload } from '~drizzle/schema/upload'
import { eq } from 'drizzle-orm'
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
                bucketName: z.string().optional(),
              },
            )
            .openapi('UploadFile'),
        },
      },
    },
  },
  responses: JsonResponse(Upload),
})

export async function uploadFile(env: Bindings, options: {
  file: File
  bucketName?: string
}) {
  const defaultBucketName = isLocalDev(env) ? 'test' : 'eleven'
  const { file, bucketName = defaultBucketName } = options

  const hash = (await sha256(await file.arrayBuffer()))!
  const db = getDrizzleInstance(env.DB)

  // check if the upload already exists
  const existing = await db.query.upload.findFirst({
    where: eq(upload.hash, hash),
    with: {
      bucket: true,
    },
  })
  if (existing) {
    return existing
  }

  const uploaded = await env.MY_BUCKET.put(hash, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
    sha256: hash,
  })
  if (!uploaded) {
    throw new Error('Upload failed')
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
  const bucketName = form.bucketName

  const result = await uploadFile(c.env, {
    file,
    bucketName,
  })

  return c.json(result)
})

export default PostUpload
