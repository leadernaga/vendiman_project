import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('inventory_items', (table) => {
        table.uuid('item_id').unique().notNullable().alter()
    })
}

export async function down(knex: Knex): Promise<void> {}
