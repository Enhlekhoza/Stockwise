import knex from 'knex';
import knexConfig from '../knexfile'; // Adjust path as needed

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

export default knex(config);
