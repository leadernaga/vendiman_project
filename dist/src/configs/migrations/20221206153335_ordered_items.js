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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.createTable('ordered_items', (table) => {
            table
                .uuid('ordered_items_id')
                .defaultTo(knex.raw('gen_random_uuid()'))
                .primary();
            table.uuid('order_id').notNullable();
            table
                .uuid('item_id')
                .references('item_id')
                .inTable('items')
                .onDelete('CASCADE')
                .notNullable();
            table
                .uuid('inventory_id')
                .references('inventory_id')
                .inTable('inventory')
                .onDelete('CASCADE')
                .notNullable();
            table
                .uuid('user_id')
                .references('user_id')
                .inTable('users')
                .onDelete('CASCADE')
                .notNullable();
            table.integer('qty').notNullable();
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.schema.dropTable('ordered_items');
    });
}
exports.down = down;
