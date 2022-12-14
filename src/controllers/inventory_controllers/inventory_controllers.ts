import { NextFunction, Request, Response } from 'express'
import inventory_services from '../../services/inventory_services/inventory_services'
import custom_error from '../../utils/Errors/custom_error'
import status_codes from '../../utils/Errors/status_codes'

async function get_list_of_inventories(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const inventory_list =
            await inventory_services.get_inventories_service()

        res.status(200).send(inventory_list)
    } catch (err) {
        const error = new custom_error(
            'something went wrong internally',
            status_codes.internal_error
        )

        next(error)
    }
}


export default {
    get_list_of_inventories,
}
