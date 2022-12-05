import { Router } from 'express'
import inventory_controllers from '../../controllers/inventory_controllers/inventory_controllers'

const route = Router()

route.get('/', inventory_controllers.getlist)
