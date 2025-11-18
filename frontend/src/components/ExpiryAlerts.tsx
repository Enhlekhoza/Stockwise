import React from 'react';

type Alert = {
  id: number;
  name: string;
  daysLeft: number;
  stock: number;
};

interface ExpiryAlertsProps {
  alerts: Alert[];
}

const ExpiryAlerts: React.FC<ExpiryAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Expiry Alerts</h3>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id} className="flex justify-between items-center border-b py-2 last:border-none">
              <div>
                <p className="font-medium text-gray-800">{alert.name}</p>
                <p className="text-sm text-gray-500">{alert.stock} units in stock</p>
              </div>
              <div className={`text-right ${alert.daysLeft <= 3 ? 'text-red-500' : 'text-yellow-500'}`}>
                <p className="font-bold">{alert.daysLeft} days left</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No expiry alerts.</p>
      )}
    </div>
  );
};

export default ExpiryAlerts;
