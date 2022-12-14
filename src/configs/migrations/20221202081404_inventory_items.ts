import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('inventory_items', (table) => {
        table
            .uuid('inventory_items_id')
            .defaultTo(knex.raw('gen_random_uuid()'))
        table
            .uuid('inventory_id')
            .notNullable()
            .references('inventory_id')
            .inTable('inventory')
            .onDelete('CASCADE')
        table
            .uuid('item_id')
            .notNullable()
            .references('item_id')
            .inTable('items')
            .onDelete('CASCADE')
        table.integer('qty').notNullable().defaultTo(0)
        table.unique(['item_id', 'inventory_id'])
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('inventory_items')
}
