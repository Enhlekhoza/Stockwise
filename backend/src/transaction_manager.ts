import { Product, getProductById } from './products';

interface TransactionItem {
  id: number; // Unique ID for the item in the current transaction
  productId: string; // ID from the product database
  name: string;
  price: number;
  quantity: number;
}

interface CurrentTransaction {
  items: TransactionItem[];
  total: number;
  nextItemId: number; // To assign unique IDs to transaction items
}

let currentTransaction: CurrentTransaction = {
  items: [],
  total: 0,
  nextItemId: 1,
};

export const getTransaction = () => {
  // Return a deep copy to prevent external modification
  return JSON.parse(JSON.stringify(currentTransaction));
};

export const addItemToTransaction = (productId: string): TransactionItem | undefined => {
  const product = getProductById(productId);
  if (!product) {
    return undefined;
  }

  // Check if item already exists in transaction, if so, increment quantity
  const existingItem = currentTransaction.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
    currentTransaction.total += product.price;
    return existingItem;
  } else {
    const newItem: TransactionItem = {
      id: currentTransaction.nextItemId++,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    currentTransaction.items.push(newItem);
    currentTransaction.total += product.price;
    return newItem;
  }
};

export const completeTransaction = () => {
  const completedTransaction = getTransaction();
  // Reset current transaction
  currentTransaction = {
    items: [],
    total: 0,
    nextItemId: 1,
  };
  return completedTransaction;
};

export const cancelTransaction = () => {
  const cancelledTransaction = getTransaction();
  // Reset current transaction
  currentTransaction = {
    items: [],
    total: 0,
    nextItemId: 1,
  };
  return cancelledTransaction;
};
