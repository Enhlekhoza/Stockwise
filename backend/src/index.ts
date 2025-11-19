import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculateMovingAverage } from './forecasting';
import { analyzeSecurityImage } from './security_service'; // Import the new service
import { getMonthlySales } from './sales_data';
import { calculateDashboardStats } from './dashboard_service';
import { getSecurityAlerts, confirmAlert, dismissAlert } from './alert_generator';
import { getPurchaseOrders, approvePurchaseOrder, rejectPurchaseOrder } from './purchase_orders';
import { getTransaction, addItemToTransaction, completeTransaction, cancelTransaction } from './transaction_manager';
import { getAllProducts, getProductById } from './products';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image uploads
app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/', (req, res) => {
  res.send('TII Backend is running!');
});

import { registerUser, loginUser } from './auth_service';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for middleware

// Middleware to authenticate JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.status(401).json({ error: 'Authentication token required.' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// --- API Endpoints ---

// User Registration
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required.' });
  }
  try {
    const user = await registerUser(username, password, email);
    if (user) {
      res.status(201).json({ message: 'User registered successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to register user. Username or email might already exist.' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const token = await loginUser(username, password);
    if (token) {
      res.json({ message: 'Login successful!', token });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' }); // Corrected to 401 Unauthorized
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Advisor: Chat Response (Gemini with fallback)
app.post('/api/advisor/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Try Gemini API first
    try {
      const prompt = `You are an expert business advisor for a small shop owner in a South African township. Your tone should be helpful, encouraging, and easy to understand. The user's question is: "${message}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({
        sender: 'ai',
        text: text,
      });
    } catch (geminiError: any) {
      console.error("Gemini API error, using fallback:", geminiError);
      console.log("Error details:", JSON.stringify(geminiError, null, 2));
      
      // Check if it's a quota exceeded error (check multiple possible error formats)
      const isQuotaError = 
        geminiError.message?.includes('quota') || 
        geminiError.message?.includes('429') || 
        geminiError.status === 429 ||
        geminiError.code === 429 ||
        geminiError.error?.code === 429 ||
        geminiError.error?.message?.includes('quota') ||
        geminiError.toString().includes('quota') ||
        geminiError.toString().includes('429');
      
      if (isQuotaError) {
        console.log("🔄 Gemini API quota exceeded, using mock advisor response");
        
        // Mock business advisor responses
        const mockResponses = [
          "That's a great question! For your township shop, I'd recommend focusing on customer relationships. Regular customers are the backbone of local businesses.",
          "Have you considered running a special promotion? Buy-one-get-one-half-off works well in our communities and brings in foot traffic.",
          "Stock management is crucial! Try to keep popular items always in stock, but don't over-order perishables. Track what sells best each season.",
          "Your pricing strategy looks good for the area. Remember that township customers value quality and fair pricing over fancy packaging.",
          "Have you thought about expanding your product range? Many successful shops add airtime, electricity vouchers, or basic groceries.",
          "Customer service is your competitive advantage! A friendly greeting and remembering regular customers' names goes a long way.",
          "Consider extending your hours slightly. Many township shoppers prefer early morning or evening slots after work.",
          "Security is important. Build good relationships with local security companies and your neighbors. Community watch programs help everyone.",
        ];
        
        // Simple keyword matching for more relevant responses
        let response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        
        if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
          response = "Pricing is key in township businesses. Keep prices competitive but profitable. Remember your customers value consistency and fairness. Consider bulk discounts for regular customers.";
        } else if (message.toLowerCase().includes('stock') || message.toLowerCase().includes('inventory')) {
          response = "Good stock management prevents losses and keeps customers happy. Track your best-selling items and ensure they're always available. Consider seasonal trends - more cold drinks in summer, more warm items in winter.";
        } else if (message.toLowerCase().includes('security') || message.toLowerCase().includes('theft')) {
          response = "Security is crucial. Install visible cameras, build good relationships with local security, and know your regular customers. A friendly greeting to everyone entering helps deter theft.";
        } else if (message.toLowerCase().includes('marketing') || message.toLowerCase().includes('advertise')) {
          response = "Word-of-mouth is powerful in townships! Encourage satisfied customers to spread the word. Consider a simple WhatsApp group for regular customers to announce special deals.";
        }

        res.json({
          sender: 'ai',
          text: response,
        });
      } else {
        throw geminiError;
      }
    }
  } catch (error) {
    console.error("Error in advisor chat:", error);
    res.status(500).json({
      sender: 'ai',
      text: 'Sorry, I encountered an error. Please try again.',
    });
  }
});


// --- Mock API Endpoints (for other features) ---

// Dashboard: Stat Cards
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await calculateDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    res.status(500).json({ error: 'Failed to calculate dashboard stats.' });
  }
});

// Dashboard: Expiry Alerts
app.get('/api/dashboard/expiry-alerts', authenticateToken, (req, res) => {
  res.json([
    { id: 1, name: 'Brown Bread', daysLeft: 2, stock: 5 },
    { id: 2, name: 'Milk 1L', daysLeft: 3, stock: 8 },
    { id: 3, name: 'Amasi 500ml', daysLeft: 5, stock: 12 },
  ]);
});

// Dashboard: Sales Trend
app.get('/api/sales-trend', authenticateToken, async (req, res) => {
  try {
    const monthlySales = await getMonthlySales();
    res.json(monthlySales);
  } catch (error) {
    console.error('Error getting monthly sales:', error);
    res.status(500).json({ error: 'Failed to get monthly sales.' });
  }
});

// AI Countertop: Get Current Transaction
app.get('/api/countertop/transaction', (req, res) => {
  const transaction = getTransaction();
  res.json(transaction);
});

// AI Countertop: Add Item to Transaction
app.post('/api/countertop/transaction/add', async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required.' });
  }
  try {
    const item = await addItemToTransaction(productId);
    if (item) {
      res.json(getTransaction());
    } else {
      res.status(404).json({ error: 'Product not found or could not be added.' });
    }
  } catch (error) {
    console.error('Error adding item to transaction:', error);
    res.status(500).json({ error: 'Failed to add item to transaction.' });
  }
});

// AI Countertop: Complete Transaction
app.post('/api/countertop/transaction/complete', async (req, res) => {
  try {
    const completedTransaction = await completeTransaction();
    if (completedTransaction) {
      res.json(completedTransaction);
    } else {
      res.status(400).json({ error: 'Cannot complete an empty transaction.' });
    }
  } catch (error) {
    console.error('Error completing transaction:', error);
    res.status(500).json({ error: 'Failed to complete transaction.' });
  }
});

// AI Countertop: Cancel Transaction
app.post('/api/countertop/transaction/cancel', (req, res) => {
  try {
    const cancelledTransaction = cancelTransaction();
    res.json(cancelledTransaction);
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    res.status(500).json({ error: 'Failed to cancel transaction.' });
  }
});

// AI Countertop: Get All Products
app.get('/api/countertop/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// AI Countertop: Get Product by ID
app.get('/api/countertop/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve product.' });
  }
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
app.post('/api/security/analyze', authenticateToken, async (req, res) => {
  const { image } = req.body; // Expecting base64 image string
  if (!image) {
    return res.status(400).json({ error: 'No image data provided.' });
  }

  try {
    const analysisResult = await analyzeSecurityImage(image);
    res.json({ analysis: analysisResult });
  } catch (error: any) {
    console.error('Error during security image analysis:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze security image.' });
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
app.get('/api/supply-chain/forecast', async (req, res) => {
  try {
    const movingAverages = await calculateMovingAverage();

    // Try Gemini API first
    try {
      const prompt = `Given the following monthly sales moving averages (month: average_quantity):\n${JSON.stringify(movingAverages, null, 2)}\n\nProvide a concise, human-readable demand forecast for a small shop owner in a South African township. Highlight any high demand, moderate increases, or potential stockouts. Format it as a list of bullet points.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      res.json({ forecast: text });
    } catch (geminiError: any) {
      console.error("Gemini API error, using fallback:", geminiError);
      console.log("Error details:", JSON.stringify(geminiError, null, 2));
      
      // Check if it's a quota exceeded error (check multiple possible error formats)
      const isQuotaError = 
        geminiError.message?.includes('quota') || 
        geminiError.message?.includes('429') || 
        geminiError.status === 429 ||
        geminiError.code === 429 ||
        geminiError.error?.code === 429 ||
        geminiError.error?.message?.includes('quota') ||
        geminiError.toString().includes('quota') ||
        geminiError.toString().includes('429');
      
      if (isQuotaError) {
        console.log("🔄 Gemini API quota exceeded, using mock forecast");
        
        // Mock demand forecast based on moving averages
        const mockForecasts = [
          "• **High Demand Expected**: Popular items like bread and milk show strong sales trends\n• **Stock Recommendations**: Increase inventory of cold drinks for summer season\n• **Moderate Growth**: Snacks and convenience foods showing steady increase\n• **Watch Items**: Some seasonal products declining, consider reducing stock",
          "• **Peak Sales Period**: Weekend demand significantly higher than weekdays\n• **Top Sellers**: Basic groceries and airtime vouchers consistently popular\n• **Seasonal Trend**: Warm beverages demand increasing as weather cools\n• **Inventory Alert**: Consider stocking up on popular snacks for month-end rush",
          "• **Growth Opportunity**: Electronic accessories showing upward trend\n• **Stable Demand**: Basic food items maintaining consistent sales\n• **Customer Pattern**: Early morning and evening peaks in customer traffic\n• **Stock Strategy**: Maintain higher levels of fast-moving consumer goods",
        ];

        // Select a relevant mock forecast
        const forecast = mockForecasts[Math.floor(Math.random() * mockForecasts.length)];
        res.json({ forecast });
      } else {
        throw geminiError;
      }
    }
  } catch (error) {
    console.error('Error calculating forecast:', error);
    res.status(500).json({ error: 'Failed to calculate forecast.' });
  }
});


app.listen(port, async () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
