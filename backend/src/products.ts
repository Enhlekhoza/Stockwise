import db from './db';

export interface Product {
  id: string;
  name: string;
  price: number; // Store price as number for calculations
}

export const getAllProducts = async (): Promise<Product[]> => {
  return db('products').select('*');
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  return db('products').where({ id }).first();
};
