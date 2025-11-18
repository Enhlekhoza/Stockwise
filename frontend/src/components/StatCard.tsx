import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode; // Keep the prop for now to avoid breaking DashboardPage, but it will be null
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      {icon && <div className="mr-4">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
