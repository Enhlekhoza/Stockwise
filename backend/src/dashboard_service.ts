import { SalesRecord } from './data_loader';

export const calculateDashboardStats = (salesData: SalesRecord[]) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let todaysRevenue = 0;
  let todaysSalesCount = 0;

  salesData.forEach((record) => {
    // Assuming 'Order Date' is in a format that can be parsed.
    // This might need adjustment based on the actual date format in the CSV.
    const orderDate = new Date(record['Order Date']).toISOString().split('T')[0];

    if (orderDate === todayStr) {
      todaysRevenue += parseFloat(record.Amount);
      todaysSalesCount += parseInt(record.Quantity, 10);
    }
  });

  // For 'Stock Health', we don't have enough data, so we'll return a placeholder.
  return [
    { id: 1, title: "Today's Revenue", value: `R ${todaysRevenue.toFixed(2)}` },
    { id: 2, title: "Today's Sales", value: `${todaysSalesCount} items` },
    { id: 3, title: 'Stock Health', value: '92% Good' }, // Placeholder
  ];
};
