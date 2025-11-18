import React, { useState, useEffect } from 'react';

type PurchaseOrder = {
  id: string;
  supplier: string;
  itemCount: number;
  totalCost: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
};

const SupplyChainPage: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [forecast, setForecast] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/supply-chain/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/supply-chain/forecast')
      .then((res) => res.json())
      .then((data) => {
        // Assuming data.forecast is a string with bullet points, split it into an array
        const forecastLines = data.forecast.split('\n').filter((line: string) => line.trim() !== '');
        setForecast(forecastLines);
      })
      .catch(console.error);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/supply-chain/orders/${id}/approve`, {
        method: 'POST',
      });
      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: 'Approved' } : order
        )
      );
      console.log(`Order ${id} approved.`);
    } catch (error) {
      console.error(`Error approving order ${id}:`, error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetch(`http://localhost:3001/api/supply-chain/orders/${id}/reject`, {
        method: 'POST',
      });
      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: 'Rejected' } : order
        )
      );
      console.log(`Order ${id} rejected.`);
    } catch (error) {
      console.error(`Error rejecting order ${id}:`, error);
    }
  };

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
            {forecast.length > 0 ? (
              forecast.map((line, index) => (
                <li key={index} className="text-gray-700" dangerouslySetInnerHTML={{ __html: line }}></li>
              ))
            ) : (
              <li className="text-gray-500">Loading demand forecast...</li>
            )}
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
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                        onClick={() => handleApprove(order.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                        onClick={() => handleReject(order.id)}
                      >
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
