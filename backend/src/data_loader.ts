import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

export interface SalesRecord {
  'Order ID': string;
  Amount: string;
  Profit: string;
  Quantity: string;
  Category: string;
  'Sub-Category': string;
  PaymentMode: string;
  'Order Date': string;
  CustomerName: string;
  State: string;
  City: string;
  'Year-Month': string;
}

export const loadSalesData = (): Promise<SalesRecord[]> => {
  return new Promise((resolve, reject) => {
    const results: SalesRecord[] = [];
    const filePath = path.resolve(__dirname, '../dataset/Sales Dataset.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};
