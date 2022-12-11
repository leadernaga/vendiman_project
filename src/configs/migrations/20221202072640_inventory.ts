import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('inventory', (table) => {
        table
            .uuid('inventory_id')
            .defaultTo(knex.raw('gen_random_uuid()'))
            .notNullable()
            .primary()
        table.string('inventory_name').notNullable().unique()
        table.string('location').defaultTo('india')
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('inventory')
}
