import { Router, Request, Response } from 'express'
import user_controllers from '../../controllers/user_controllers/user_controllers'

const route = Router()

route.get('/verify', user_controllers.login_user)
route.get("/getotp",user_controllers.get_otp)

export default route
