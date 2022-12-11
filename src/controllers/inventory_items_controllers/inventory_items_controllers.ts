import { NextFunction, Request, Response } from 'express'
import Sinon from 'sinon'
const joi = require('joi')
import { v4 as uuid } from 'uuid'
import utils from '../../utils/utils'
import user_queries from '../../queries/user_queries.ts/user_queries'
import { jwtPayload } from '../../types/types'
import user_controllers from '../user_controllers/user_controllers'
import inventory_items_queries from '../../queries/inventory_items_queries/inventory_items_queries'
import inventory_items_services from '../../services/inventory_items_services/inventor_items_services'
import status_codes from '../../utils/Errors/status_codes'

async function post_inventory_items(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const data =
            await inventory_items_services.post_inventory_items_service(req)

        res.status(status_codes.ok).send({ message: 'success' })
    } catch (err) {
        next(err)
    }
}

async function filter_items(req: Request, res: Response, next: NextFunction) {
    const inventory_id = req.body.inventory

    try {
        const search_result =
            await inventory_items_services.filter_items_service(req)

        res.status(status_codes.ok).send({
            data: search_result,
            message: 'success',
        })
    } catch (err) {
        next(err)
    }
}

async function search_items(req: Request, res: Response, next: NextFunction) {
    try {
        const items = await inventory_items_services.search_items_service(req)

        res.status(200).send({ data: items, message: 'success' })
    } catch (err) {
        next(err)
    }
}

async function place_order(req: Request, res: Response,next:NextFunction) {
    let { inventory_id, item_ids } = req.body
    try {
      
        const placed_items = await inventory_items_services.place_order_service(
            req
        )
        res.status(status_codes.ok).send(placed_items)
    } catch (err: any) {
    next(err)
}
}

export default { post_inventory_items, filter_items, search_items, place_order }
