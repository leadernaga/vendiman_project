import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('inventory_items', (table) => {
        table.uuid('id').defaultTo(knex.raw('gen_random_uuid()'))
        table
            .uuid('invetory_id')
            .references('id')
            .inTable('inventory')
            .onDelete('CASCADE')
        table
            .uuid('item_id')
            .references('id')
            .inTable('items')
            .onDelete('CASCADE')
        table.integer('qty').notNullable().defaultTo(0)
        table.timestamps(true,true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('inventory_items')
}
