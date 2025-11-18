import { loadSalesData, SalesRecord } from './data_loader';

export interface MonthlySales {
  month: string;
  totalSales: number;
}

export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  const salesData = await loadSalesData();
  const monthlySales: { [key: string]: number } = {};

  salesData.forEach((record: SalesRecord) => {
    const month = record['Year-Month'];
    const amount = parseFloat(record.Amount);

    if (monthlySales[month]) {
      monthlySales[month] += amount;
    } else {
      monthlySales[month] = amount;
    }
  });

  return Object.keys(monthlySales).map((month) => ({
    month,
    totalSales: monthlySales[month],
  }));
};
