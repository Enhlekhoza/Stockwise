import fs from 'fs';
import path from 'path';

export interface DashboardStat {
  id: number;
  title: string;
  value: string;
}

export const calculateDashboardStats = async (): Promise<DashboardStat[]> => {
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
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let todaysRevenue = 0;
    let todaysSalesCount = 0;
    let totalRevenue = 0;
    let totalSales = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('Select-Object')) continue;
      
      const values = line.split(',');
      if (values.length >= 11) {
        const amount = parseFloat(values[1] || '0');
        const quantity = parseInt(values[3] || '0');
        const orderDate = values[6]?.trim();
        
        if (amount > 0) {
          totalRevenue += amount;
          totalSales += quantity;
          
          // Check if today's sale (simplified check)
          if (orderDate && orderDate.includes(todayStr.split('-')[2])) { // Check if day matches
            todaysRevenue += amount;
            todaysSalesCount += quantity;
          }
        }
      }
    }
    
    return [
      { id: 1, title: "Today's Revenue", value: `R ${todaysRevenue.toFixed(2)}` },
      { id: 2, title: "Today's Sales", value: `${todaysSalesCount} items` },
      { id: 3, title: "Total Revenue", value: `R ${totalRevenue.toFixed(2)}` },
      { id: 4, title: "Total Sales", value: `${totalSales} items` },
    ];
    
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return [
      { id: 1, title: "Today's Revenue", value: "R 0.00" },
      { id: 2, title: "Today's Sales", value: "0 items" },
      { id: 3, title: "Total Revenue", value: "R 0.00" },
      { id: 4, title: "Total Sales", value: "0 items" },
    ];
  }
};
