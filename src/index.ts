import app from '@/server'
import AiRoute from '@/service/ai'
import BabyRoute from '@/service/baby'

app.route('ai', AiRoute)
app.route('', BabyRoute)

export default app
