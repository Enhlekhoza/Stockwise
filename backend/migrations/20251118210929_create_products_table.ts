import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.decimal('price', 10, 2).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}

