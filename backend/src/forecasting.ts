import fs from 'fs';
import path from 'path';

interface MonthlySales {
  [key: string]: {
    totalQuantity: number;
    count: number;
  };
}

interface SalesRecord {
  created_at: string;
  quantity: number;
}

export const calculateMovingAverage = async () => {
  try {
    // Read CSV file directly
    const csvPath = path.join(__dirname, '..', 'dataset', 'Sales Dataset.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV
    const lines = csvData.split('\n').filter(line => line.trim());
    
    // Fix malformed header
    let headerLine = lines[0];
    if (headerLine.startsWith(' Select-Object')) {
      headerLine = 'Order ID,Amount,Profit,Quantity,Category,Sub-Category,PaymentMode,Order Date,CustomerName,State,City,Year-Month';
    }
    
    const salesData: SalesRecord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('Select-Object')) continue;
      
      const values = line.split(',');
      if (values.length >= 11) {
        const quantity = parseInt(values[3] || '0');
        const orderDate = values[6]?.trim();
        
        if (quantity > 0 && orderDate) {
          salesData.push({
            created_at: orderDate,
            quantity
          });
        }
      }
    }
    
    const monthlySales: MonthlySales = {};

    // Aggregate sales data by month
    salesData.forEach(record => {
      const month = new Date(record.created_at).toISOString().substring(0, 7); // YYYY-MM
      const quantity = record.quantity;

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
  } catch (error) {
    console.error('Error calculating moving average:', error);
    return [];
  }
};
