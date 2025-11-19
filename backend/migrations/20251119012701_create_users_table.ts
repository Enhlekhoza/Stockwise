import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {


  return knex.schema.createTable('users', (table) => {


    table.increments('id').primary();


    table.string('username').unique().notNullable();


    table.string('password_hash').notNullable();


    table.string('email').unique().notNullable(); // Optional, but good practice


    table.timestamps(true, true); // Adds created_at and updated_at columns


  });


}





export async function down(knex: Knex): Promise<void> {


  return knex.schema.dropTable('users');


}

