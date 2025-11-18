import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadSalesData, SalesRecord } from './data_loader';
import { calculateMovingAverage } from './forecasting';
import { analyzeSecurityImage } from './security_service'; // Import the new service
import { getMonthlySales } from './sales_data';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

let salesData: SalesRecord[] = [];

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001"});

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads

app.get('/', (req, res) => {
  res.send('TII Backend is running!');
});

// --- API Endpoints ---

// Advisor: Chat Response (Now connected to Gemini)
app.post('/api/advisor/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // A simple prompt enhancement to guide the AI
    const prompt = `You are an expert business advisor for a small shop owner in a South African township. Your tone should be helpful, encouraging, and easy to understand. The user's question is: "${message}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      sender: 'ai',
      text: text,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({
      sender: 'ai',
      text: 'Sorry, I encountered an error trying to connect to the AI service. Please check the backend console for details.',
    });
  }
});


// --- Mock API Endpoints (for other features) ---

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

// Dashboard: Sales Trend
app.get('/api/sales-trend', async (req, res) => {
  try {
    const monthlySales = await getMonthlySales();
    res.json(monthlySales);
  } catch (error) {
    console.error('Error getting monthly sales:', error);
    res.status(500).json({ error: 'Failed to get monthly sales.' });
  }
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

// New API endpoint for security image analysis
app.post('/api/security/analyze', async (req, res) => {
  const { image } = req.body; // Expecting base64 image string
  if (!image) {
    return res.status(400).json({ error: 'No image data provided.' });
  }

  try {
    const analysisResult = await analyzeSecurityImage(image);
    res.json({ analysis: analysisResult });
  } catch (error) {
    console.error('Error during security image analysis:', error);
    res.status(500).json({ error: 'Failed to analyze security image.' });
  }
});


// Supply Chain: Purchase Orders
app.get('/api/supply-chain/orders', (req, res) => {
  res.json([
    { id: 'PO-001', supplier: 'Bakers Biscuits', itemCount: 5, totalCost: 'R 550.00', status: 'Pending Approval' },
    { id: 'PO-002', supplier: 'Coca-Cola Beverages', itemCount: 12, totalCost: 'R 1,800.00', status: 'Pending Approval' },
    { id: 'PO-003', supplier: 'Simba Snacks', itemCount: 8, totalCost: 'R 920.00', status: 'Approved' },
  ]);
});

// Supply Chain: Demand Forecast
app.get('/api/supply-chain/forecast', (req, res) => {
  if (salesData.length === 0) {
    return res.status(503).json({ error: 'Sales data not loaded yet. Please try again in a moment.' });
  }
  try {
    const forecast = calculateMovingAverage(salesData);
    res.json(forecast);
  } catch (error) {
    console.error('Error calculating forecast:', error);
    res.status(500).json({ error: 'Failed to calculate forecast.' });
  }
});


app.listen(port, async () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  try {
    salesData = await loadSalesData();
    console.log('Sales data loaded successfully. Records:', salesData.length);
    // console.log('First 5 records:', salesData.slice(0, 5)); // Optional: Keep for debugging
  } catch (error) {
    console.error('Failed to load sales data:', error);
  }
});
