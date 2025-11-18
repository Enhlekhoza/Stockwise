import React, { useState, useEffect } from 'react';
import { FiCamera, FiXCircle } from 'react-icons/fi';

type Item = {
  id: number;
  name: string;
  price: string;
};

type Transaction = {
  items: Item[];
  total: string;
};

const AICountertopPage: React.FC = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/countertop/transaction')
      .then((res) => res.json())
      .then((data) => setTransaction(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">AI-Powered Countertop</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 bg-black rounded-lg shadow-md flex items-center justify-center text-white">
          <div className="text-center">
            <FiCamera size={64} className="mx-auto mb-4" />
            <p>Live Camera Feed</p>
            <p className="text-sm text-gray-400">(Placeholder)</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Current Transaction</h3>
          {transaction ? (
            <>
              <ul className="mb-4">
                {transaction.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-2">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-green-600">{transaction.total}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Awaiting transaction...</p>
          )}
          <div className="mt-6 flex space-x-2">
            <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600" disabled={!transaction}>
              Complete Sale
            </button>
            <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center" disabled={!transaction}>
              <FiXCircle className="mr-2" /> Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AICountertopPage;
