import { SalesRecord } from './data_loader';

interface MonthlySales {
  [key: string]: {
    totalQuantity: number;
    count: number;
  };
}

export const calculateMovingAverage = (salesData: SalesRecord[]) => {
  const monthlySales: MonthlySales = {};

  // Aggregate sales data by month
  salesData.forEach(record => {
    const month = record['Year-Month'];
    const quantity = parseInt(record.Quantity, 10);

    if (!monthlySales[month]) {
      monthlySales[month] = { totalQuantity: 0, count: 0 };
    }

    monthlySales[month].totalQuantity += quantity;
    monthlySales[month].count++;
  });

  const months = Object.keys(monthlySales).sort();
  const movingAverages: { month: string; average: number }[] = [];

  // Calculate 3-month moving average
  for (let i = 2; i < months.length; i++) {
    const month1 = months[i - 2];
    const month2 = months[i - 1];
    const month3 = months[i];

    const avg1 = monthlySales[month1].totalQuantity / monthlySales[month1].count;
    const avg2 = monthlySales[month2].totalQuantity / monthlySales[month2].count;
    const avg3 = monthlySales[month3].totalQuantity / monthlySales[month3].count;

    const movingAverage = (avg1 + avg2 + avg3) / 3;

    movingAverages.push({
      month: month3,
      average: parseFloat(movingAverage.toFixed(2)),
    });
  }

  return movingAverages;
};
