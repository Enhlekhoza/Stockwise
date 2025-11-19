import db from './db';

export interface MonthlySales {
  month: string;
  totalSales: number;
}

export const getMonthlySales = async (): Promise<MonthlySales[]> => {
  const sales = await db('transactions')
    .select(
      db.raw("TO_CHAR(created_at, 'YYYY-MM') as month"),
      db.raw('SUM(total) as "totalSales"')
    )
    .groupBy(db.raw("TO_CHAR(created_at, 'YYYY-MM')"))
    .orderBy('month');

  return sales.map((s: any) => ({
    month: s.month,
    totalSales: parseFloat(s.totalSales),
  }));
};
