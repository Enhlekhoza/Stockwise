export interface Product {
  id: string;
  name: string;
  price: number; // Store price as number for calculations
}

export const products: Product[] = [
  { id: '1001', name: 'Coca-Cola 2L', price: 25.00 },
  { id: '1002', name: 'Sasko Bread', price: 15.00 },
  { id: '1003', name: 'Simba Chips', price: 10.00 },
  { id: '1004', name: 'Milk 1L', price: 20.00 },
  { id: '1005', name: 'Brown Bread', price: 18.00 },
  { id: '1006', name: 'Amasi 500ml', price: 12.00 },
  { id: '1007', name: 'Apples (per kg)', price: 22.00 },
  { id: '1008', name: 'Bananas (per kg)', price: 15.00 },
  { id: '1009', name: 'Oranges (per kg)', price: 18.00 },
  { id: '1010', name: 'Chicken Fillets (per kg)', price: 65.00 },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};
