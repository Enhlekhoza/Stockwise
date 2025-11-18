import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('TII Backend is running!');
});

// --- Mock API Endpoints ---

// Dashboard: Stat Cards
app.get('/api/dashboard/stats', (req, res) => {
  res.json([
    { id: 1, title: "Today's Revenue", value: 'R 1,250.00' },
    { id: 2, title: "Today's Sales", value: '142 items' },
    { id: 3, title: 'Stock Health', value: '92% Good' },
  ]);
});

// Dashboard: Expiry Alerts
app.get('/api/dashboard/expiry-alerts', (req, res) => {
  res.json([
    { id: 1, name: 'Brown Bread', daysLeft: 2, stock: 5 },
    { id: 2, name: 'Milk 1L', daysLeft: 3, stock: 8 },
    { id: 3, name: 'Amasi 500ml', daysLeft: 5, stock: 12 },
  ]);
});

// AI Countertop: Mock Transaction
app.get('/api/countertop/transaction', (req, res) => {
  res.json({
    items: [
      { id: 1, name: 'Coca-Cola 2L', price: 'R 25.00' },
      { id: 2, name: 'Sasko Bread', price: 'R 15.00' },
      { id: 3, name: 'Simba Chips', price: 'R 10.00' },
    ],
    total: 'R 50.00',
  });
});

// AI Security: Alerts
app.get('/api/security/alerts', (req, res) => {
  res.json([
    { id: 1, title: 'Potential Shoplifting Detected', time: '2 minutes ago', severity: 'High' },
    { id: 2, title: 'Unusual Activity After Hours', time: '8 hours ago', severity: 'Medium' },
    { id: 3, title: 'Cash Drawer Opened Without Sale', time: 'Yesterday', severity: 'High' },
    { id: 4, title: 'Camera Temporarily Obscured', time: 'Yesterday', severity: 'Low' },
  ]);
});

// Supply Chain: Purchase Orders
app.get('/api/supply-chain/orders', (req, res) => {
  res.json([
    { id: 'PO-001', supplier: 'Bakers Biscuits', itemCount: 5, totalCost: 'R 550.00', status: 'Pending Approval' },
    { id: 'PO-002', supplier: 'Coca-Cola Beverages', itemCount: 12, totalCost: 'R 1,800.00', status: 'Pending Approval' },
    { id: 'PO-003', supplier: 'Simba Snacks', itemCount: 8, totalCost: 'R 920.00', status: 'Approved' },
  ]);
});

// Advisor: Chat Response
app.post('/api/advisor/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    sender: 'ai',
    text: `I have received your message: "${message}". I am processing your request and will provide a detailed analysis shortly.`,
  });
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
