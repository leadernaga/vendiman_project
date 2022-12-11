import { Router } from 'express'
import inventory_controllers from '../../controllers/inventory_controllers/inventory_controllers'
import inventory_items_controllers from '../../controllers/inventory_items_controllers/inventory_items_controllers'

import middlewere from '../../middleweres/Auth/auth_middlewere'

const route = Router()

route.get('/', inventory_controllers.get_list_of_inventories)
route.get('/filter', inventory_items_controllers.filter_items)
route.get('/search', inventory_items_controllers.search_items)
route.post(
    '/place_order',
    middlewere.auth_middlewere,
    inventory_items_controllers.place_order
)
route.post(
    '/items',
    middlewere.admin_middlewere,
    inventory_items_controllers.post_inventory_items
)
route.put(
    '/items',
    middlewere.admin_middlewere,
    inventory_items_controllers.post_inventory_items
)

export default route
