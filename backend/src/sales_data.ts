import fs from 'fs';
import path from 'path';

export interface MonthlySales {
  month: string;
  totalSales: number;
}

export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  try {
    // Read CSV file directly from Kaggle dataset
    const csvPath = path.join(__dirname, '..', 'dataset', 'Sales Dataset.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV and group by month
    const lines = csvData.split('\n').filter(line => line.trim());
    
    // Fix malformed header - combine the broken header lines
    let headerLine = lines[0];
    if (headerLine.startsWith(' Select-Object')) {
      headerLine = 'Order ID,Amount,Profit,Quantity,Category,Sub-Category,PaymentMode,Order Date,CustomerName,State,City,Year-Month';
    }
    
    const headers = headerLine.split(',');
    
    const monthlySales = new Map<string, number>();
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('Select-Object')) continue;
      
      const values = line.split(',');
      if (values.length >= 11) { // Ensure we have enough columns
        const amount = parseFloat(values[1] || '0'); // Amount is at index 1
        const yearMonth = values[11]?.trim(); // Year-Month is at index 11
        
        if (yearMonth && amount > 0 && yearMonth !== 'Year-Month') {
          monthlySales.set(yearMonth, (monthlySales.get(yearMonth) || 0) + amount);
        }
      }
    }
    
    // Convert to array and sort by month
    return Array.from(monthlySales.entries())
      .map(([month, totalSales]) => ({ month, totalSales }))
      .sort((a, b) => a.month.localeCompare(b.month));
      
  } catch (error) {
    console.error('Error reading sales data from CSV:', error);
    return [];
  }
};
