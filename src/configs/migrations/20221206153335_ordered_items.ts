import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ordered_items', (table) => {
        table
            .uuid('ordered_items_id')
            .defaultTo(knex.raw('gen_random_uuid()'))
            .primary()
        table.uuid('order_id').notNullable()
        table
            .uuid('item_id')
            .references('item_id')
            .inTable('items')
            .onDelete('CASCADE')
            .notNullable()
        table
            .uuid('inventory_id')
            .references('inventory_id')
            .inTable('inventory')
            .onDelete('CASCADE')
            .notNullable()
        table
            .uuid('user_id')
            .references('user_id')
            .inTable('users')
            .onDelete('CASCADE')
            .notNullable()
        table.integer('qty').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ordered_items')
}
