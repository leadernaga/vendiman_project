"use strict";
// import { Request, Response } from 'express'
// import { v4 as uuid } from 'uuid'
// import utils from '../../utils/utils'
// import user_queries from '../../queries/user_queries.ts/user_queries'
// import { jwtPayload } from '../../types/types'
// import user_controllers from '../user_controllers/user_controllers'
// import inventory_queries from '../../queries/inventory_queries/inventory_queries'
// import inventory_items_queries from "../../queries/inventory_items_queries/inventory_items_queries"
// async function filter_items(req: Request, res: Response) {
//     const inventory_id = req.body.inventory
//     try {
//         if (!inventory_id) {
//             return res
//                 .status(400)
//                 .send({ message: 'please provide inventory id' })
//         }
//         if (Object.keys(req.query).length === 0) {
//             return res
//                 .status(400)
//                 .send({ message: 'please filter on any field' })
//         }
//         const search_result = await inventory_items_queries.filter_items(
//             req.query,
//             inventory_id
//         )
//         if (Object.keys(search_result).length === 0) {
//             return res
//                 .status(400)
//                 .send({ message: 'please filter by correct details' })
//         }
//         res.status(200).send({ data: search_result, message: 'success' })
//     } catch (err) {
//         res.status(500).send({ message: 'something went internally' })
//     }
// }
// async function search_items(req: Request, res: Response) {
//     const query = req.query.q || ''
//     const inventory_id = req.body.inventory_id
//     try {
//         if (!inventory_id || typeof inventory_id !== 'string') {
//             return res
//                 .status(400)
//                 .send({ message: 'please send correct inventory id' })
//         }
//         const items = await inventory_items_queries.search_items(query, inventory_id)
//         if (items.length == 0) {
//             return res
//                 .status(404)
//                 .send({ message: 'no result found with your search' })
//         }
//         res.status(200).send({ data: items, message: 'success' })
//     } catch (err) {
//         res.status(500).send({ message: 'something happened internally' })
//     }
// }
// async function place_order(req: Request, res: Response) {
//     let { inventory_id, item_ids } = req.body
//     try {
//         if (!inventory_id || !item_ids || typeof item_ids !== 'object') {
//             return res.status(400).send({
//                 message: 'please provide inventory id and items array',
//             })
//         }
//         if (Array.isArray(item_ids) == false) {
//             item_ids = [item_ids]
//         }
//         const order_id = uuid()
//         const token = req.headers.authorization?.split(' ')[1] as string
//         const decoded_data = utils.verifyJWT(token) as jwtPayload
//         const user = await user_queries.get_user_by_email(decoded_data.email)
//         const inventory_items_data =
//             await inventory_items_queries.get_inventory_items_data(
//                 item_ids,
//                 inventory_id
//             )
//         inventory_items_data.sort((a: any, b: any) => {
//             return a.item_id - b.item_id
//         })
//         item_ids.sort((a: any, b: any) => {
//             return a.item_id - b.item_id
//         })
//         let check_quantity = true
//         let item_not_available_enough = ''
//         const total_price = inventory_items_data.reduce(
//             (acc: number, elm: any, index: number) => {
//                 if (elm.qty < item_ids[index].qty && check_quantity) {
//                     check_quantity = false
//                     item_not_available_enough = elm.item_name
//                 }
//                 return acc + elm.price * item_ids[index].qty
//             },
//             0
//         )
//         if (!check_quantity) {
//             return res.status(406).send({
//                 message: `${item_not_available_enough} dont have enough quantity`,
//             })
//         }
//         if (user.balance < total_price) {
//             return res
//                 .status(402)
//                 .send({ message: 'user dont have enough balance' })
//         }
//         const updated_user_data = await user_queries.update_user_balance(
//             user.email,
//             total_price
//         )
//         const placed_items = await inventory_items_queries.post_ordered_items({
//             order_id,
//             item_ids,
//             inventory_id,
//             user_id: user.user_id,
//         })
//         const updated_inventory_items =
//             await inventory_items_queries.update_inventory_items_qty(
//                 inventory_id,
//                 item_ids
//             )
//         res.status(200).send(placed_items)
//     } catch (err: any) {
//         console.log(err.message)
//         return res
//             .status(500)
//             .send({ message: 'something went wrong internally' })
//     }
// }
// // export default { filter_items, search_items, place_order }
