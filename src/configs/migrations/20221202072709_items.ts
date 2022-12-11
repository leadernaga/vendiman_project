import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('items', (table) => {
        table
            .uuid('item_id')
            .defaultTo(knex.raw('gen_random_uuid()'))
            .primary()
            .notNullable()
        table.string('item_name').notNullable().unique()
        table.string('category').notNullable()
        table.string('manifacturer').notNullable()
        table.string('description').nullable()
        table.string('unit').notNullable()
        table.integer('price').notNullable()
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('items')
}
