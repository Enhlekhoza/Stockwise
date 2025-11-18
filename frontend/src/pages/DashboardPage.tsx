import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import ExpiryAlerts from '../components/ExpiryAlerts';

// Define types for our data
type Stat = {
  id: number;
  title: string;
  value: string;
};

type Alert = {
  id: number;
  name: string;
  daysLeft: number;
  stock: number;
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Fetch stats
    fetch('http://localhost:3001/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);

    // Fetch expiry alerts
    fetch('http://localhost:3001/api/dashboard/expiry-alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Business Health Dashboard</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} title={stat.title} value={stat.value} icon={null} />
        ))}
      </div>

      {/* Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <ExpiryAlerts alerts={alerts} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
