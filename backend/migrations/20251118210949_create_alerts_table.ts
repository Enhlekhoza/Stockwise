import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('alerts', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('time').notNullable();
    table.string('severity').notNullable();
    table.string('image').notNullable();
    table.string('status').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('alerts');
}

