import React, { useState, useEffect } from 'react';

type TransactionItem = {
  id: number; // Unique ID for the item in the current transaction
  productId: string; // ID from the product database
  name: string;
  price: number;
  quantity: number;
};

type Transaction = {
  items: TransactionItem[];
  total: number; // Total is now a number
};

type Product = {
  id: string;
  name: string;
  price: number;
};

const AICountertopPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [productIdInput, setProductIdInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTransaction = () => {
      fetch('http://localhost:3001/api/countertop/transaction')
        .then((res) => res.json())
        .then((data) => setTransaction(data))
        .catch(console.error);
    };
    fetchTransaction(); // Fetch immediately on mount
    const interval = setInterval(fetchTransaction, 1000); // Fetch every 1 second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/countertop/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const handleCompleteSale = async () => {
    try {
      await fetch('http://localhost:3001/api/countertop/transaction/complete', {
        method: 'POST',
      });
      setTransaction(null); // Reset transaction after completion
      console.log('Sale completed.');
    } catch (error) {
      console.error('Error completing sale:', error);
    }
  };

  const handleCancelSale = async () => {
    try {
      await fetch('http://localhost:3001/api/countertop/transaction/cancel', {
        method: 'POST',
      });
      setTransaction(null); // Reset transaction after cancellation
      console.log('Sale cancelled.');
    } catch (error) {
      console.error('Error cancelling sale:', error);
    }
  };

  const handleScanItem = async () => {
    if (!productIdInput) return;
    try {
      const response = await fetch('http://localhost:3001/api/countertop/transaction/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: productIdInput }),
      });
      if (response.ok) {
        const updatedTransaction = await response.json();
        setTransaction(updatedTransaction);
        setProductIdInput(''); // Clear input after scanning
        console.log(`Item ${productIdInput} scanned.`);
      } else {
        const errorData = await response.json();
        console.error('Error scanning item:', errorData.error);
        alert(`Error scanning item: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error scanning item:', error);
      alert('Error scanning item. Please check console.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">StockWise AI-Powered Countertop</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 bg-black rounded-lg shadow-md flex items-center justify-center text-white p-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Scan Product</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter Product ID"
                className="p-2 rounded-lg text-black"
                value={productIdInput}
                onChange={(e) => setProductIdInput(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={handleScanItem}
              >
                Scan Item
              </button>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Available Products</h3>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center border rounded-lg p-2">
                <span className="text-gray-800">{product.name}</span>
                <span className="font-medium text-gray-900">ID: {product.id} (R {product.price.toFixed(2)})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Current Transaction</h3>
          {transaction && transaction.items.length > 0 ? (
            <>
              <ul className="mb-4">
                {transaction.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-2">
                    <span className="text-gray-800">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-gray-900">R {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600">R {transaction.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Awaiting transaction...</p>
          )}
          <div className="mt-6 flex space-x-2">
            <button
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              disabled={!transaction || transaction.items.length === 0}
              onClick={handleCompleteSale}
            >
              Complete Sale
            </button>
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
              disabled={!transaction || transaction.items.length === 0}
              onClick={handleCancelSale}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AICountertopPage;
