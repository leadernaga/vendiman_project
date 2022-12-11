import { Request } from 'express'
import custom_errors from '../../utils/Errors/custom_error'
import schema_validation from '../../utils/validations/schema_validations'
import status_code from '../../utils/Errors/status_codes'
import inventory_items_queries from '../../queries/inventory_items_queries/inventory_items_queries'
import inventory from '../../queries/inventory_queries/inventory_queries'
import error_messages from '../../utils/Errors/error_message'
import { Knex } from 'knex'
import error_message from '../../utils/Errors/error_message'
import status_codes from '../../utils/Errors/status_codes'
import { v4 as uuid } from 'uuid'
import utils from '../../utils/utils'
import user_queries from '../../queries/user_queries.ts/user_queries'

// types
import { jwtPayload } from '../../types/types'

async function post_inventory_items_service(req: Request) {
    let { inventory_id, item_ids } = req.body

    // input req.body validating through joi validate function

    const schema = schema_validation
        .post_inventory_items_schema()
        .validate(req.body)

    // checking schema error  present or not if there throwing error
    if (schema.error) {
        throw new custom_errors(schema.error.message, status_code.bad_request)
    }

    const data = await inventory_items_queries.post_items_on_inventory(
        inventory_id,
        item_ids
    )

    if (data instanceof Error) {
        const error = new custom_errors(
            error_message.bad_request,
            status_codes.bad_request
        )
        throw error
    }
}

async function filter_items_service(req: Request) {
    const inventory_id = req.body.inventory_id

    if (!inventory_id || typeof inventory_id !== 'string') {
        const error = new custom_errors(
            error_message.invalid_inventory_id,
            status_code.bad_request
        )
        throw error
    }

    // checking whether query parameter present or not

    if (Object.keys(req.query).length === 0) {
        const error = new custom_errors(
            error_message.empty_filter_query,
            status_code.bad_request
        )

        throw error
    }

    const search_result = await inventory_items_queries.filter_items(
        req.query,
        inventory_id
    )

    // checking searched result is empty or not if empty throw error with 404
    if (Object.keys(search_result).length === 0) {
        const error = new custom_errors(
            error_message.filter_not_found,
            status_code.not_found
        )
        throw error
    }

    return search_result
}

async function search_items_service(req: Request) {
    const query = req.query.q || ''
    const inventory_id = req.body.inventory_id

    if (!inventory_id || typeof inventory_id !== 'string') {
        const error = new custom_errors(
            error_message.invalid_inventory_id,
            status_code.bad_request
        )
        throw error
    }

    const items = await inventory_items_queries.search_items(
        query,
        inventory_id
    )
    if (items.length == 0) {
        const error = new custom_errors(
            error_message.empty_search,
            status_code.not_found
        )
        throw error
    }
    return items
}

async function place_order_service(req: Request) {
    let { inventory_id, item_ids } = req.body

    const schema = schema_validation
        .post_inventory_items_schema()
        .validate(req.body)

    if (schema.error) {
        const error = new custom_errors(
            schema.error.message,
            status_code.bad_request
        )
        throw error
    }

    // create order id to be unique among all products which are ordered
    const order_id = uuid()

    // getting token from headers and getting user object from database
    const token = req.headers.authorization?.split(' ')[1] as string
    const decoded_data = utils.verifyJWT(token) as jwtPayload
    const user = await user_queries.get_user_by_email(decoded_data.email)

    // getting inventory items from based on inventory id and item_ids
    const inventory_items_data =
        await inventory_items_queries.get_inventory_items_data(
            item_ids,
            inventory_id
        )

    //sorting both arrays inventory_items and item_ids t based on item_id
    inventory_items_data.sort((a: any, b: any) => {
        return a.item_id - b.item_id
    })
    item_ids.sort((a: any, b: any) => {
        return a.item_id - b.item_id
    })

    // checking qunatity availability for current orders
    let check_quantity = true
    let item_not_available_enough = ''

    // calculating total price based on price and quantity

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
        const error = new custom_errors(
            `${item_not_available_enough} ${error_message.less_qunatity}`,
            status_code.not_acceptable
        )

        throw error
    }

    //checking user balance more than total price or not
    if (user.balance < total_price) {
        const error = new custom_errors(
            error_message.less_balance,
            status_code.payment_required
        )

        throw error
    }

    const updated_user_data = await user_queries.update_user_balance(
        user.email,
        total_price
    )

    const placed_items = await inventory_items_queries.post_ordered_items({
        order_id,
        item_ids,
        inventory_id,
        user_id: user.user_id,
    })

    const updated_inventory_items =
        await inventory_items_queries.update_inventory_items_qty(
            inventory_id,
            item_ids
        )

    return placed_items
}

export default {
    post_inventory_items_service,
    filter_items_service,
    search_items_service,
    place_order_service,
}
