import { getAppInstance } from '@/core'
import GetCurrentUser from '@/routes/user/current.get'

const user_app = getAppInstance()

user_app.route('/user', GetCurrentUser)

export default user_app
