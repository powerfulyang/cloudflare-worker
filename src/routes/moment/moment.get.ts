import { getAppInstance, getDrizzleInstance } from '@/core'
import { JsonResponse } from '@/zodSchemas/JsonResponse'
import { Moment } from '@/zodSchemas/Moment'
import { createRoute, z } from '@hono/zod-openapi'
import { moment } from '~drizzle/schema/moment'
import { desc, eq, sql } from 'drizzle-orm'

const QueryMoment = getAppInstance()

const route = createRoute({
  method: 'get',
  path: '',
  request: {
    query: z.object({
      page: z.coerce.number().optional().default(1),
      pageSize: z.coerce.number().optional().default(10),
      type: z.enum(['moment', 'feedback']).optional().default('moment'),
    }),
  },
  responses: JsonResponse(
    z.object({
      data: z.array(Moment),
      total: z.number().int(),
    }),
  ),
})

QueryMoment.openapi(route, async (c) => {
  const { page, pageSize, type } = c.req.valid('query')
  const db = getDrizzleInstance(c.env.DB)

  const totalQuery = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(moment)
    .where(eq(moment.type, type))
    .get()

  const data = await db.query.moment.findMany({
    with: {
      attachments: {
        with: {
          upload: {
            with: {
              bucket: true,
            },
          },
        },
      },
    },
    where: eq(moment.type, type),
    orderBy: desc(moment.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  })

  return c.json(
    {
      data,
      total: totalQuery?.count || 0,
    },
    200,
  )
})

export default QueryMoment
