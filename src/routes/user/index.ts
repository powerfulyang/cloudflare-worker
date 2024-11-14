import { getAppInstance } from '@/core'
import GetCurrentUser from '@/routes/user/current.get'

const user = getAppInstance()

user.route('/user', GetCurrentUser)

export default user
