import { NextFunction, Request, Response } from 'express'

import inventory_items_services from '../../services/inventory_items_services/inventor_items_services'
import status_codes from '../../utils/Errors/status_codes'

async function post_inventory_items(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        req.logger.info(
            'user requested to post inventory items and user request in post inventory items controller'
        )

        await inventory_items_services.post_inventory_items_service(req)

        req.logger.info(
            'user request for post items is succesfull and response to user'
        )
        res.status(status_codes.ok).send({ message: 'success' })
    } catch (err: any) {
        req.logger.error('error occured in post_inventory_items_controller')
        next(err)
    }
}

async function filter_items(req: Request, res: Response, next: NextFunction) {
    req.logger.info(
        'user requested to filter items in inventory and user in filter items controller'
    )

    try {
        req.logger.info('user request entering into filter_items')
        const search_result =
            await inventory_items_services.filter_items_service(req)

        req.logger.info('user request is successfull sending response to user')
        res.status(status_codes.ok).send({
            data: search_result,
            message: 'success',
        })
    } catch (err) {
        req.logger.info('filter items controller got error')
        next(err)
    }
}

async function search_items(req: Request, res: Response, next: NextFunction) {
    req.logger.info(
        'user requested to search items and user entered into search items controller'
    )
    try {
        const items = await inventory_items_services.search_items_service(req)

        req.logger.info(
            'user request successfull from database sending response to user'
        )
        res.status(200).send({ data: items, message: 'success' })
    } catch (err) {
        req.logger.info('search items got error ')
        next(err)
    }
}

async function place_order(req: Request, res: Response, next: NextFunction) {
    try {
        req.logger.info(
            'user requested to place order and user into place_order controllers'
        )
        const placed_items = await inventory_items_services.place_order_service(
            req
        )

        req.logger.info('user ordered placed successfully')
        res.status(status_codes.ok).send(placed_items)
    } catch (err: any) {
       
        req.logger.error('error occured in place order controller')
        next(err)
    }
}

export default { post_inventory_items, filter_items, search_items, place_order }
