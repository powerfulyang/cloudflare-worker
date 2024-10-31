import AiRoute from '@/routes/ai'
import BabyRoute from '@/routes/baby'
import MomentRoute from '@/routes/moment'
import R2Route from '@/routes/r2'
import app from '@/server'

app.route('ai', AiRoute)
app.route('baby', BabyRoute)
app.route('r2', R2Route)
app.route('moment', MomentRoute)

export default app
