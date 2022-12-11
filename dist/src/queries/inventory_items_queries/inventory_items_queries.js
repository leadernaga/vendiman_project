"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../../configs/connection"));
function update_inventory_items_qty(inventory_id, item_ids) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = item_ids.map((item) => __awaiter(this, void 0, void 0, function* () {
            return yield connection_1.default
                .select('*')
                .from('inventory_items')
                .where('inventory_id', inventory_id)
                .andWhere('item_id', item.item_id)
                .decrement('qty', item.qty)
                .returning('*');
        }));
        return data;
    });
}
function get_inventory_items_data(data, inventory_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const item_ids = data.map((elm) => {
            return elm.item_id;
        });
        return connection_1.default
            .select('*')
            .from('inventory_items')
            .where('inventory_id', inventory_id)
            .whereIn('items.item_id', item_ids)
            .join('items', 'items.item_id', 'inventory_items.item_id');
    });
}
function post_items_on_inventory(inventory_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < data.length; i++) {
            const elm = data[i];
            try {
                yield connection_1.default.raw(`insert into inventory_items (inventory_id,item_id,qty) values ('${inventory_id}','${elm.item_id}',${elm.qty}) on conflict(item_id) do update set qty = inventory_items.qty+${elm.qty} returning *`);
            }
            catch (err) {
                return err;
            }
        }
    });
}
function filter_items(query, inventory_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const item_name = query.name || '';
        const item_category = query.category || '';
        const item_price = Number(query.price) || 9999;
        return yield connection_1.default
            .select('*')
            .from('inventory_items')
            .join('items', 'items.item_id', 'inventory_items.item_id')
            .join('inventory', 'inventory.inventory_id', 'inventory_items.inventory_id')
            .where('inventory.inventory_id', inventory_id)
            .andWhereILike('item_name', `%${item_name}%`)
            .andWhereILike('category', `%${item_category}%`)
            .andWhere('price', '<=', item_price);
    });
}
function search_items(query, inventory_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield connection_1.default
            .select('*')
            .from('inventory_items')
            .join('items', 'items.item_id', 'inventory_items.item_id')
            .join('inventory', 'inventory.inventory_id', 'inventory_items.inventory_id')
            .where('inventory.inventory_id', inventory_id)
            .andWhere((builder) => builder
            .orWhereILike('item_name', `%${query}%`)
            .orWhereILike('category', `%${query}%`)
            .orWhereILike('manifacturer', `%${query}%`));
    });
}
function post_ordered_items(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { order_id, inventory_id, user_id } = data;
        const ordered_items = data.item_ids.map((item) => {
            return {
                item_id: item.item_id,
                inventory_id,
                order_id,
                user_id,
                qty: item.qty,
            };
        });
        return connection_1.default
            .insert(ordered_items)
            .into('ordered_items')
            .returning('*');
    });
}
exports.default = {
    filter_items,
    search_items,
    post_ordered_items,
    update_inventory_items_qty,
    get_inventory_items_data,
    post_items_on_inventory,
};
