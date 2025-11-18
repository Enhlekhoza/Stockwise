import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlySales {
  month: string;
  totalSales: number;
}

const SalesChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/sales-trend')
      .then((res) => res.json())
      .then((data: MonthlySales[]) => {
        const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
        const chartData = {
          labels: sortedData.map((d) => d.month),
          datasets: [
            {
              label: 'Total Sales',
              data: sortedData.map((d) => d.totalSales),
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        };
        setChartData(chartData);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Sales Trend</h3>
      <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
        {chartData ? (
          <Line data={chartData} />
        ) : (
          <p className="text-gray-500">[Loading Sales Chart...]</p>
        )}
      </div>
    </div>
  );
};

export default SalesChart;