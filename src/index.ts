import user_app from '@/routes/user'
import app from '@/server'
import '@/oauth-providers/oauth.middleware'

app.route('/', user_app)

export default app
