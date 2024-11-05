import BabyRoute from '@/routes/baby'
import app from '@/server'
import '@/oauth-providers/oauth.middleware'

app.route('baby', BabyRoute)

export default app
