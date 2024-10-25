import { momentSchema } from '@/service/moment/moment.post'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { createRoute, z } from '@hono/zod-openapi'
import { moment, momentsToUploads } from '~drizzle/schema/moment'
import { bucket, upload } from '~drizzle/schema/upload'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

export const route = createRoute({
  method: 'get',
  path: '/api/moment',
  request: {
    query: z.object(
      {
        page: z.string().transform(Number).optional(),
        pageSize: z.string().transform(Number).optional(),
        type: z.enum(['moment', 'feedback']).optional().default('moment'),
      },
    ),
  },
  responses: JsonResponse(
    z.object({
      data: z.array(momentSchema),
      total: z.number().int(),
    }),
  ),
})

appServer.openapi(route, async (c) => {
  const { page, pageSize, type } = c.req.valid('query')
  const db = drizzle(c.env.DB)

  const total = await db
    .select({
      count: sql<number>`COUNT(${moment.id})`,
    })
    .from(moment)
    .where(eq(moment.type, type))
    .get()

  const sqlScript = db
    .select({
      content: moment.content,
      id: moment.id,
      attachments: {
        id: momentsToUploads.uploadId,
        hash: upload.hash,
        thumbnailHash: upload.thumbnailHash,
        mediaType: upload.mediaType,
      },
      bucket: {
        name: bucket.name,
        domain: bucket.domain,
      },
      createdAt: moment.createdAt,
      updatedAt: moment.updatedAt,
    })
    .from(moment)
    .leftJoin(momentsToUploads, eq(moment.id, momentsToUploads.momentId))
    .leftJoin(upload, eq(momentsToUploads.uploadId, upload.id))
    .leftJoin(bucket, eq(upload.bucketName, bucket.name))
    .where(eq(moment.type, type))
    .orderBy(desc(moment.id), asc(momentsToUploads.order))

  if (page && pageSize) {
    sqlScript.limit(pageSize).offset((page - 1) * pageSize)
  }

  const result = await sqlScript.all()

  // type Result = typeof route.responses
  // z.infer<Result['200']['content']['application/json']['schema']>['data']

  const moments = result.reduce((acc, cur) => {
    const { id, content, createdAt, updatedAt, attachments, bucket } = cur
    const index = acc.findIndex(m => m.id === id)
    if (index === -1) {
      acc.push({
        id,
        content,
        createdAt,
        updatedAt,
        attachments: attachments.id ? [{ ...attachments, bucket }] : null,
      })
    }
    else {
      if (attachments.id && bucket) {
        acc[index].attachments.push(
          { ...attachments, bucket },
        )
      }
    }
    return acc
  }, [] as any[])

  return c.json({
    data: moments,
    total: total?.count ?? 0,
  })
})
