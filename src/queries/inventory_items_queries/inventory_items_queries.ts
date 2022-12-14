import inventoryDB from '../../configs/connection'
import { place_order } from '../../types/types'
import { Request } from 'express'
import {Knex} from "knex"

async function update_inventory_items_qty(
    inventory_id: string,
    item_ids: [object],
    req: Request
) {
    req.logger.info('user request performing update_inventory_items_qty query')

    const data = item_ids.map(async (item: any) => {
        return await inventoryDB
            .select('*')
            .from('inventory_items')
            .where('inventory_id', inventory_id)
            .andWhere('item_id', item.item_id)
            .decrement('qty', item.qty)
            .returning('*')
    })

    return data
}

async function get_inventory_items_data(
    data: any,
    inventory_id: string,
    req: Request
) {
    req.logger.info('user trying to get inventory_items_data')
    const item_ids = data.map((elm: any) => {
        return elm.item_id
    })

    return inventoryDB
        .select('*')
        .from('inventory_items')
        .where('inventory_id', inventory_id)
        .whereIn('items.item_id', item_ids)
        .join('items', 'items.item_id', 'inventory_items.item_id')
}


//change
async function post_items_on_inventory(inventory_id: string, data: any,req:Request) {
    req.logger.info("user request entered into database ")
    for (let i = 0; i < data.length; i++) {
        const elm = data[i]
        try {
            await inventoryDB.raw(
                `insert into inventory_items (inventory_id,item_id,qty) values ('${inventory_id}','${elm.item_id}',${elm.qty}) on conflict(inventory_id,item_id) do update set qty = inventory_items.qty+${elm.qty} returning *`
            )
        } catch (err) {
            req.logger.error("post items_on inventory data base failed ")
            return err
        }
    }
}

//change
async function filter_items(query: any, inventory_id: string,req:Request) {
    const item_name = query.name || ''
    const item_category = query.category || ''
    const item_price = Number(query.price) || 9999

    req.logger.info("user request enterd into filter_items_query to get data")

    return await inventoryDB
        .select('*')
        .from('inventory_items')
        .join('items', 'items.item_id', 'inventory_items.item_id')
        .join(
            'inventory',
            'inventory.inventory_id',
            'inventory_items.inventory_id'
        )
        .where('inventory.inventory_id', inventory_id)
        .andWhereILike('item_name', `%${item_name}%`)
        .andWhereILike('category', `%${item_category}%`)
        .andWhere('price', '<=', item_price)
}

async function search_items(query: any, inventory_id: string, req: Request) {
    req.logger.info('user request performing search_items_query')

    return await inventoryDB
        .select('*')
        .from('inventory_items')
        .join('items', 'items.item_id', 'inventory_items.item_id')
        .join(
            'inventory',
            'inventory.inventory_id',
            'inventory_items.inventory_id'
        )
        .where('inventory.inventory_id', inventory_id)
        .andWhere((builder: Knex) =>
            builder
                .orWhereILike('item_name', `%${query}%`)
                .orWhereILike('category', `%${query}%`)
                .orWhereILike('manifacturer', `%${query}%`)
        )
}

async function post_ordered_items(ordered_items: place_order, req: Request) {
    req.logger.info('user request performing post_ordered_items query')
    return inventoryDB
        .insert(ordered_items)
        .into('ordered_items')
        .returning('*')
}

export default {
    filter_items,
    search_items,
    post_ordered_items,
    update_inventory_items_qty,
    get_inventory_items_data,
    post_items_on_inventory,
}
