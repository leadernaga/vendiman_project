import { Router } from 'express'
import user_controllers from '../../controllers/user_controllers/user_controllers'

const route = Router()
// utils.log.info('balle balle')

// console.log(logger.info(""), 'loggere')

route.post('/verify', user_controllers.verify_otp)
route.post('/sendotp', user_controllers.send_otp)

export default route
