import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('transactions', (table) => {
      table.increments('id').primary();
      table.decimal('total', 10, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('transaction_items', (table) => {
      table.increments('id').primary();
      table.integer('transaction_id').unsigned().notNullable();
      table.string('product_id').notNullable();
      table.string('name').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.integer('quantity').notNullable();

      table.foreign('transaction_id').references('id').inTable('transactions').onDelete('CASCADE');
      table.foreign('product_id').references('id').inTable('products');
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('transaction_items')
    .dropTable('transactions');
}

