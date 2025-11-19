import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('transactions').del();

  // Read CSV file
  const csvPath = path.join(__dirname, '..', 'dataset', 'Sales Dataset.csv');
  const csvData = fs.readFileSync(csvPath, 'utf8');
  
  // Parse CSV
  const lines = csvData.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  // Group by Order ID to create transactions
  const orderGroups = new Map<string, any[]>();
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
      });
      
      const orderId = row['Order ID'];
      if (!orderGroups.has(orderId)) {
        orderGroups.set(orderId, []);
      }
      orderGroups.get(orderId)!.push(row);
    }
  }

  // Insert transactions only (skip transaction_items due to foreign key constraint)
  for (const [orderId, items] of orderGroups) {
    // Calculate total for this order
    const total = items.reduce((sum: number, item: any) => {
      return sum + parseFloat(item['Amount'] || '0');
    }, 0);

    // Get date from first item
    const orderDate = items[0]['Order Date'];
    const created_at = orderDate ? new Date(orderDate) : new Date();

    // Insert transaction
    await knex('transactions').insert({
      total,
      created_at
    });
  }
}
