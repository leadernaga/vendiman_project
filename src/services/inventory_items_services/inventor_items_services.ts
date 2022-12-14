import { Request } from 'express'
import custom_errors from '../../utils/Errors/custom_error'
import schema_validation from '../../utils/validations/schema_validations'
import status_code from '../../utils/Errors/status_codes'
import inventory_items_queries from '../../queries/inventory_items_queries/inventory_items_queries'

import error_message from '../../utils/Errors/error_message'

import { v4 as uuid } from 'uuid'
import utils from '../../utils/utils'
import user_queries from '../../queries/user_queries.ts/user_queries'

// types
import { database_error, jwtPayload } from '../../types/types'

async function post_inventory_items_service(req: Request) {
    const { inventory_id, item_ids } = req.body

    // input req.body validating through joi validate function

    req.logger.info('user entered into post_inventory_items_service')

    const schema = schema_validation
        .post_inventory_items_schema()
        .validate(req.body)

    // checking schema error  present or not if there throwing error
    if (schema.error) {
        req.logger.error('user entered invalid data')
        throw new custom_errors(schema.error.message, status_code.bad_request)
    }

    req.logger.info('user entering into database')
    const data =
        ((await inventory_items_queries.post_items_on_inventory(
            inventory_id,
            item_ids,
            req
        )) as database_error) ||
        undefined ||
        Error

    if (data.code === '22P02') {
        req.logger.error('post items_inventory failed due to invalid coloumn')
        throw new custom_errors(
            error_message.bad_request,
            status_code.bad_request
        )
    }

    if (data instanceof Error) {
        req.logger.error(
            'post items_inventory failed due to error occured in database'
        )

        throw new custom_errors(
            error_message.internal_error,
            status_code.internal_error
        )
    }
}

async function filter_items_service(req: Request) {
    const inventory_id = req.headers.inventory_id

    req.logger.info('user request in filter_items_service')

    if (!inventory_id || typeof inventory_id !== 'string') {
        req.logger.error('user enterd wrong invalid inventory_id')

        const error = new custom_errors(
            error_message.invalid_inventory_id,
            status_code.bad_request
        )
        throw error
    }

    // checking whether query parameter present or not

    if (Object.keys(req.query).length === 0) {
        req.logger.error('user is not enterd any filter')
        const error = new custom_errors(
            error_message.empty_filter_query,
            status_code.bad_request
        )

        throw error
    }

    req.logger.info('user entering to database')
    const filtered_result = await inventory_items_queries.filter_items(
        req.query,
        inventory_id,
        req
    )

    req.logger.info('got the data from searched result')

    // checking searched result is empty or not if empty throw error with 404
    if (Object.keys(filtered_result).length === 0) {
        req.logger.error('filtered query result is empty')

        const error = new custom_errors(
            error_message.filter_not_found,
            status_code.not_found
        )
        throw error
    }

    req.logger.info(
        'request filtered successfully sending to filter_controllers'
    )
    return filtered_result
}

async function search_items_service(req: Request) {
    const query = req.query.q || ''
    const inventory_id = req.headers.inventory_id

    req.logger.info('user request entered into search items service')

    if (!inventory_id || typeof inventory_id !== 'string') {
        req.logger.info('user provided invalid invntory id')
        const error = new custom_errors(
            error_message.invalid_inventory_id,
            status_code.bad_request
        )
        throw error
    }

    const items = await inventory_items_queries.search_items(
        query,
        inventory_id,
        req
    )

    req.logger.info('successfully got search items fromn database')

    if (items.length == 0) {
        req.logger.error('user requested items or not found')
        const error = new custom_errors(
            error_message.empty_search,
            status_code.not_found
        )
        throw error
    }

    req.logger.info('search service successfull and response to controller')
    return items
}

async function place_order_service(req: Request) {
    const { inventory_id, item_ids } = req.body

    req.logger.info('user entered into place_order_Service')

    const schema = schema_validation
        .post_inventory_items_schema()
        .validate(req.body)

    if (schema.error) {
        req.logger.error('user entered wrong inputs')
        const error = new custom_errors(
            schema.error.message,
            status_code.bad_request
        )
        throw error
    }

    // create order id to be unique among all products which are ordered
    const order_id = uuid()
    req.logger.info('ordered id created by uuid')

    // getting token from headers and getting user object from database
    const token = req.headers.authorization?.split(' ')[1] as string
    const decoded_data = utils.verifyJWT(token) as jwtPayload
    const user = await user_queries.get_user_by_email(decoded_data.email, req)
    req.logger.info(
        'got token from headers and decoded with jwtverify and got user by email'
    )

    // getting inventory items from based on inventory id and item_ids
    const inventory_items_data =
        await inventory_items_queries.get_inventory_items_data(
            item_ids,
            inventory_id,
            req
        )
    req.logger.info('got inventory_items form database ')

    //sorting both arrays inventory_items and item_ids t based on item_id
    inventory_items_data.sort((a: any, b: any) => a.item_id - b.item_id)
    item_ids.sort((a: any, b: any) => a.item_id - b.item_id)

    // checking qunatity availability for current orders
    let check_quantity = true
    let item_not_available_enough = ''

    // calculating total price based on price and quantity

    req.logger.info('total price of items are calculating')
    const total_price = inventory_items_data.reduce(
        (acc: number, elm: any, index: number) => {
            if (elm.qty < item_ids[index].qty && check_quantity) {
                check_quantity = false
                item_not_available_enough = elm.item_name
            }
            return acc + elm.price * item_ids[index].qty
        },
        0
    )

    // throwing error if quantity is less
    if (!check_quantity) {
        req.logger.error(
            'quantity is not have enough to buy' + item_not_available_enough
        )

        const error = new custom_errors(
            `${item_not_available_enough} ${error_message.less_qunatity}`,
            status_code.not_acceptable
        )

        throw error
    }

    //checking user balance more than total price or not
    if (user.balance < total_price) {
        req.logger.error('user dont have enough balance to buy')
        const error = new custom_errors(
            error_message.less_balance,
            status_code.payment_required
        )

        throw error
    }

    await user_queries.update_user_balance(user.email, total_price, req)

    //  const { order_id, inventory_id, user_id } = data

    const ordered_items = item_ids.map((item: any) => ({
        item_id: item.item_id,
        inventory_id,
        order_id,
        user_id: user.user_id,
        qty: item.qty,
    }))

    const placed_items = await inventory_items_queries.post_ordered_items(
        ordered_items,
        req
    )
    req.logger.info('user request performed post_ordered_items query')

    await inventory_items_queries.update_inventory_items_qty(
        inventory_id,
        item_ids,
        req
    )
    req.logger.info(
        'user request updated inventory items qty and sending placed items to controllers'
    )
    return placed_items
}

export default {
    post_inventory_items_service,
    filter_items_service,
    search_items_service,
    place_order_service,
}
