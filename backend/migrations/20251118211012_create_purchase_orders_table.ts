import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('purchase_orders', (table) => {
    table.string('id').primary();
    table.string('supplier').notNullable();
    table.integer('itemCount').notNullable();
    table.string('totalCost').notNullable(); // Storing as string for now as per existing type
    table.string('status').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('purchase_orders');
}

