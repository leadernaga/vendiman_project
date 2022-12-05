import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table
            .uuid('id')
            .defaultTo(knex.raw('gen_random_uuid()'))
            .primary()
            .notNullable()
        table.string('name').notNullable()
        table.string('email').notNullable().unique()
        table.enu('role', ['customer', 'admin']).defaultTo('customer')
        table.string('token').nullable().defaultTo(null)
        table.integer('balance').notNullable().defaultTo(500)
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    // return knex.schema
    return knex.schema.dropTable('users')
}
