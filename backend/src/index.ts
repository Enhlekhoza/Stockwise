import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadSalesData, SalesRecord } from './data_loader';
import { calculateMovingAverage } from './forecasting';
import { analyzeSecurityImage } from './security_service'; // Import the new service
import { getMonthlySales } from './sales_data';
import { calculateDashboardStats } from './dashboard_service';
import { getSecurityAlerts, confirmAlert, dismissAlert } from './alert_generator';
import { getPurchaseOrders, approvePurchaseOrder, rejectPurchaseOrder } from './purchase_orders';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

let salesData: SalesRecord[] = [];

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001"});

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.static(path.join(__dirname, '../../frontend/public')));

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
  if (salesData.length === 0) {
    return res.status(503).json({ error: 'Sales data not loaded yet. Please try again in a moment.' });
  }
  try {
    const stats = calculateDashboardStats(salesData);
    res.json(stats);
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    res.status(500).json({ error: 'Failed to calculate dashboard stats.' });
  }
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
  const severityFilter = req.query.severity as 'High' | 'Medium' | 'Low' | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const alerts = getSecurityAlerts(severityFilter, page, limit);
  res.json(alerts);
});

// New API endpoints for confirming and dismissing security alerts
app.post('/api/security/alerts/:id/confirm', (req, res) => {
  const { id } = req.params;
  confirmAlert(parseInt(id));
  res.status(200).send('Alert confirmed');
});

app.post('/api/security/alerts/:id/dismiss', (req, res) => {
  const { id } = req.params;
  dismissAlert(parseInt(id));
  res.status(200).send('Alert dismissed');
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
  const orders = getPurchaseOrders();
  res.json(orders);
});

// New API endpoints for approving and rejecting purchase orders
app.post('/api/supply-chain/orders/:id/approve', (req, res) => {
  const { id } = req.params;
  approvePurchaseOrder(id);
  res.status(200).send('Purchase order approved');
});

app.post('/api/supply-chain/orders/:id/reject', (req, res) => {
  const { id } = req.params;
  rejectPurchaseOrder(id);
  res.status(200).send('Purchase order rejected');
});

// Supply Chain: Demand Forecast
app.get('/api/supply-chain/forecast', async (req, res) => { // Added async
  if (salesData.length === 0) {
    return res.status(503).json({ error: 'Sales data not loaded yet. Please try again in a moment.' });
  }
  try {
    const movingAverages = calculateMovingAverage(salesData);

    // Construct a prompt for Gemini to interpret the moving averages
    const prompt = `Given the following monthly sales moving averages (month: average_quantity):\n${JSON.stringify(movingAverages, null, 2)}\n\nProvide a concise, human-readable demand forecast for a small shop owner in a South African township. Highlight any high demand, moderate increases, or potential stockouts. Format it as a list of bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Gemini's response will be the forecast
    res.json({ forecast: text });
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
