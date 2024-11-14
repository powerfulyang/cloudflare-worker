import User from '@/routes/user'
import app from '@/server'
import '@/oauth-providers/oauth.middleware'

app.route('/', User)

export default app
