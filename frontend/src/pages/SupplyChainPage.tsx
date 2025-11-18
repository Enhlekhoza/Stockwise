import React, { useState, useEffect } from 'react';

type PurchaseOrder = {
  id: string;
  supplier: string;
  itemCount: number;
  totalCost: string;
  status: 'Pending Approval' | 'Approved';
};

const SupplyChainPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/supply-chain/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">StockWise Autonomous Supply Chain Manager</h2>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Demand Forecast */}
        <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            Demand Forecast
          </h3>
          <ul className="space-y-3">
            <li className="text-gray-700">
              <span className="font-bold text-green-600">High demand</span> for soft drinks expected this weekend (local event).
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-yellow-600">Moderate increase</span> in bread sales predicted due to colder weather.
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-red-600">Potential stockout</span> of Amasi 500ml by Friday.
            </li>
          </ul>
        </div>

        {/* Draft Purchase Orders */}
        <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            Draft Purchase Orders
          </h3>
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600">Supplier: {order.supplier}</p>
                    <p className="text-sm text-gray-600">{order.itemCount} items - <span className="font-medium">{order.totalCost}</span></p>
                  </div>
                  {order.status === 'Pending Approval' ? (
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                        Approve
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 md:mt-0">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending purchase orders.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupplyChainPage;
