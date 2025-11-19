import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('products').del();

  // Insert sample products
  await knex('products').insert([
    { id: 'laptop-basic', name: 'Basic Laptop', price: 499.99 },
    { id: 'laptop-pro', name: 'Pro Laptop', price: 1299.99 },
    { id: 'mouse-wireless', name: 'Wireless Mouse', price: 29.99 },
    { id: 'keyboard-mechanical', name: 'Mechanical Keyboard', price: 89.99 },
    { id: 'monitor-24', name: '24" Monitor', price: 199.99 },
    { id: 'monitor-27', name: '27" Monitor', price: 349.99 },
    { id: 'webcam-hd', name: 'HD Webcam', price: 49.99 },
    { id: 'headphones-bluetooth', name: 'Bluetooth Headphones', price: 79.99 },
    { id: 'usb-cable', name: 'USB Cable', price: 9.99 },
    { id: 'phone-charger', name: 'Phone Charger', price: 19.99 },
    { id: 'tablet-basic', name: 'Basic Tablet', price: 249.99 },
    { id: 'printer-inkjet', name: 'Inkjet Printer', price: 149.99 },
    { id: 'router-wifi', name: 'WiFi Router', price: 59.99 },
    { id: 'external-ssd', name: 'External SSD', price: 99.99 },
    { id: 'desk-lamp', name: 'Desk Lamp', price: 34.99 },
    { id: 'office-chair', name: 'Office Chair', price: 199.99 },
    { id: 'backpack-laptop', name: 'Laptop Backpack', price: 49.99 },
    { id: 'phone-case', name: 'Phone Case', price: 14.99 },
    { id: 'screen-protector', name: 'Screen Protector', price: 12.99 },
    { id: 'power-bank', name: 'Power Bank', price: 39.99 }
  ]);
}
