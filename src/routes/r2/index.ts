import { getAppInstance } from '@/core'
import { HTTPException } from 'hono/http-exception'
import GetBucket from './bucket.get'
import PostBucket from './bucket.post'
import PostUpload from './upload.post'

const R2Route = getAppInstance()

// 配置子路由
R2Route.route('bucket', GetBucket)
R2Route.route('bucket', PostBucket)
R2Route.route('upload', PostUpload)

R2Route.get('upload/:hash', async (c) => {
  const { hash } = c.req.param()
  const response = await c.env.MY_BUCKET.get(hash)
  if (!response) {
    throw new HTTPException(404)
  }
  const contentType = response.httpMetadata?.contentType
  if (contentType) {
    return c.newResponse(response.body, 200, {
      'Content-Type': contentType,
    })
  }
  else {
    throw new HTTPException(500)
  }
})

export default R2Route
