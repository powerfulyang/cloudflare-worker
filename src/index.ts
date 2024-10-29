import AiRoute from '@/routes/ai'
import BabyRoute from '@/routes/baby'
import R2Route from '@/routes/r2'
import app from '@/server'

app.route('ai', AiRoute)
app.route('baby', BabyRoute)
app.route('r2', R2Route)

export default app
