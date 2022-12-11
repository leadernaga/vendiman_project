import inventoryDB from '../../configs/connection'
import { place_order } from '../../types/types'
import { v4 as uuid } from 'uuid'
import knex, { Knex } from 'knex'
import custom_errors from '../../utils/Errors/custom_error'

async function update_inventory_items_qty(
    inventory_id: string,
    item_ids: [Object]
) {
    let data = item_ids.map(async (item: any) => {
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

async function get_inventory_items_data(data: any, inventory_id: string) {
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

async function post_items_on_inventory(inventory_id: string, data: any) {
   
    for (let i = 0; i < data.length; i++) {
        const elm = data[i]
        try {
            await inventoryDB.raw(
                `insert into inventory_items (inventory_id,item_id,qty) values ('${inventory_id}','${elm.item_id}',${elm.qty}) on conflict(item_id) do update set qty = inventory_items.qty+${elm.qty} returning *`
            )
        } catch (err) {
            return err
        }
    }
}

async function filter_items(query: any, inventory_id: string) {
    const item_name = query.name || ''
    const item_category = query.category || ''
    const item_price = Number(query.price) || 9999

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

async function search_items(query: any, inventory_id: string) {
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

async function post_ordered_items(data: place_order) {
    const { order_id, inventory_id, user_id } = data

    const ordered_items = data.item_ids.map((item: any) => {
        return {
            item_id: item.item_id,
            inventory_id,
            order_id,
            user_id,
            qty: item.qty,
        }
    })

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
