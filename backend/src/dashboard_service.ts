import db from './db';

interface DbSalesRecord {
  transaction_id: number;
  total: number;
  created_at: Date;
  quantity: number;
}

export const getSalesRecordsFromDb = async (): Promise<DbSalesRecord[]> => {
  return db('transactions as t')
    .join('transaction_items as ti', 't.id', 'ti.transaction_id')
    .select(
      't.id as transaction_id',
      't.total',
      't.created_at',
      'ti.quantity'
    ) as Promise<DbSalesRecord[]>;
};

export const calculateDashboardStats = async () => {
  const salesData = await getSalesRecordsFromDb();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let todaysRevenue = 0;
  let todaysSalesCount = 0;

  salesData.forEach((record) => {
    const orderDate = new Date(record.created_at).toISOString().split('T')[0];

    if (orderDate === todayStr) {
      todaysRevenue += record.total;
      todaysSalesCount += record.quantity;
    }
  });

  return [
    { id: 1, title: "Today's Revenue", value: `R ${todaysRevenue.toFixed(2)}` },
    { id: 2, title: "Today's Sales", value: `${todaysSalesCount} items` },
    // TODO: Implement dynamic Stock Health calculation based on actual stock levels in the database.
    // { id: 3, title: 'Stock Health', value: 'N/A' },
  ];
};
