# **Project Specification: StockWise (Township Inventory Intelligence) v3.0**

---

## **1. Project Overview**

**Project Name:** StockWise (formerly Township Inventory Intelligence - TII)

**Project Type:** Web-based SaaS platform for informal retail.

**Purpose:** To empower small township retailers and spaza shops to automate operations, eliminate loss, and dramatically increase profitability through a suite of powerful, accessible AI tools.

**Core Concept:** A lightweight, practical web app that leverages **multimodal AI (Google Gemini)** to deliver a fully automated point-of-sale, security, and supply chain management system, enhanced with predictive intelligence and customer insights. The platform is designed specifically for the realities of informal retail: cash constraints, limited tech literacy, and unreliable connectivity.

---

## **2. Problem Statement**

Small township and informal retailers face critical operational challenges that directly impact their survival and growth:

1.  **Manual Operations & Sales Blindness:** All sales, inventory, and ordering are done manually. This is slow, error-prone, and provides zero data for making smart business decisions.
2.  **Inventory & Cash Flow Mismanagement:** Overstocking ties up precious cash, while understocking leads to lost sales. Perishable goods often expire, resulting in direct financial loss.
3.  **High Shrinkage & Theft:** Customer shoplifting and internal theft are major sources of hidden losses, with no affordable or practical security solutions available.
4.  **Complex Supplier Relations:** Managing orders, payments, and deliveries from multiple suppliers is a chaotic, paper-based process.
5.  **Limited Data & Benchmarking:** Owners are cut off from market trends, competitor insights, and customer behavior data, forcing them to operate on guesswork.

---

## **3. Target Market**

| Segment | Description | Size/Reach |
| :--- | :--- | :--- |
| **Primary: Township Retailers** | Micro-retailers (spaza shops) selling FMCG, airtime, snacks. | 100,000+ shops in South Africa |
| **Secondary: Small Supermarkets** | Serving low-income urban and semi-urban areas. | 5,000–10,000 potential early adopters |
| **Partners: Suppliers/Wholesalers** | FMCG distributors and local suppliers. | 500–1,000 potential paying partners |
| **Data Consumers: FMCG Brands** | Coca-Cola, Unilever, Nestlé, etc. | Partner for aggregated market insights |

---

## **4. Proposed Solution & Features**

StockWise offers a comprehensive suite of AI-powered features designed to transform informal retail operations:

### **Core AI-Powered Features (Current Prototype Focus)**

#### **Feature 1: The AI-Powered Countertop (Automated POS)**

*   **Concept:** Using a simple tablet or smartphone camera mounted over the counter, the AI watches transactions happen.
*   **AI Capabilities:**
    *   **Visual Product Recognition:** Gemini identifies products being sold in real-time.
    *   **Automated Transaction Logging:** Automatically creates a sales record, calculates the total, and updates inventory—no manual input required.
    *   **Cash Recognition:** Identifies currency notes to verify payment and calculate change, reducing errors.

#### **Feature 2: The AI Security Guard (Automated Loss Prevention)**

*   **Concept:** The same camera feed used for the POS is used for security monitoring.
*   **AI Capabilities:**
    *   **Theft Detection:** Identifies when an item is taken from a shelf but not paid for at the counter.
    *   **Suspicious Activity Flagging:** Detects unusual events, like the cash drawer opening without a sale.
    *   **Instant, Discreet Alerts:** Sends a private notification (e.g., via WhatsApp) with a short video clip to the shop owner's phone for immediate review.

#### **Feature 3: The Autonomous Supply Chain Manager**

*   **Concept:** The system moves from making suggestions to running the supply chain.
*   **AI Capabilities:**
    *   **Predictive Demand Forecasting:** Analyzes sales data and external factors (weather, local events) to predict future demand with high accuracy.
    *   **Automated Purchase Orders:** Generates and sends draft purchase orders to suppliers via WhatsApp for owner approval.
    *   **Smart Supplier Management:** Compares prices across different suppliers to recommend the most profitable option for each item on an order.

#### **Feature 4: The Generative Business Advisor (Conversational BI)**

*   **Concept:** A conversational AI that allows owners to talk to their business data.
*   **AI Capabilities:**
    *   **Natural Language Queries:** Owners can ask questions in voice or text, like *"What should I put on sale tomorrow?"* or *"Show me my profit from last week."*
    *   **Goal-Oriented Advice:** Owners can state a goal, like *"I want to increase my profit by 5%,"* and the AI will generate a list of concrete, actionable steps.
    *   **Automated Reporting:** Instantly generates and shares reports for suppliers or partners.

### **Aligned & Enhanced Features (Future Development)**

These features build upon the core functionalities, leveraging multimodal AI for deeper insights and automation:

#### **Feature 5: Smart Shelf Monitoring & Automated Replenishment**

*   **Concept:** Extends vision AI to monitor product shelves in real-time.
*   **AI Capabilities:**
    *   **Vision:** Continuously monitors shelves, identifies products, and detects low stock levels or empty slots.
    *   **Reasoning:** Correlates shelf stock with sales data and demand forecasts to trigger alerts or automated internal orders for replenishment.
*   **Impact:** Minimizes lost sales due to stockouts and optimizes staff efficiency.

#### **Feature 6: Customer Sentiment & Feedback Analysis (Voice/Text)**

*   **Concept:** Collects and analyzes customer feedback in an accessible, informal way.
*   **Multimodal AI:**
    *   **Voice/Text:** Prompts customers for feedback after a transaction (via screen or voice). Gemini processes and analyzes the sentiment and content.
    *   **Reasoning:** Identifies common themes and summarizes key insights for the owner.
*   **Impact:** Provides actionable customer insights to improve service, product offerings, and overall customer experience.

#### **Feature 7: Predictive Theft Hotspots & Behavioral Anomaly Detection**

*   **Concept:** Elevates security from reactive alerts to proactive prediction and prevention.
*   **Multimodal AI:**
    *   **Vision:** Analyzes patterns of customer and staff movement, loitering, and interactions in specific areas of the shop over time.
    *   **Reasoning:** Identifies "hotspots" prone to theft or unusual behavioral patterns that precede theft.
*   **Impact:** Provides proactive alerts and strategic recommendations to safeguard stock and reduce shrinkage.

---

## **5. Technology Stack**

| Component | Technology / Tool | Purpose |
| :--- | :--- | :--- |
| Frontend | **React (with TypeScript)** | Fully-integrated web UI, dashboard, and real-time components. |
| Styling | **Tailwind CSS** | For rapid, modern, and responsive UI development. |
| Backend | **Node.js / Express (with TypeScript)** | API handling, user authentication, business logic. |
| Database | **PostgreSQL / MongoDB** | Scalable storage for inventory, sales, and user data. |
| **AI / ML** | **Google Gemini API** | **Core engine for all features:** multimodal recognition, reasoning, and generation. |
| Analytics | **Recharts / Chart.js** | Visualizations for the Business Health Dashboard. |
| Hosting | **Vercel / AWS** | Scalable deployment for the application. |
| Security | **JWT, SSL/TLS** | Authentication and secure data transfer. |

---

## **6. Cost Structure**

**Fixed Costs (initial dev + infrastructure):**

* Web development & AI integration: R150,000 – R250,000
* Design/UI: R50,000 – R70,000
* Hosting + storage (initial 500 shops): R5,000/month

**Variable Costs:**

* Gemini API usage (token & image processing limits)
* SMS/WhatsApp messages (per message cost)
* Data storage growth
* Maintenance & support

**Total MVP cost estimate:** R200,000 – R300,000

---

## **7. Revenue Streams**

1. **Supplier Partnerships**

   * Wholesalers/FMCG pay per active shop for access to network insights
   * Subscription: R50–R100/shop/month
   * Optional commission: 2–3% of orders processed

2. **FMCG Brand Insights**

   * Aggregated, anonymized sales & stock data
   * Subscription or annual license: R50,000–500,000/year per major brand

3. **Freemium Shops Model**

   * Free tier: basic expiry alerts + sales tracker
   * Premium tier (R99/month): advanced analytics, supplier tools, community features

4. **Transaction Fees (Optional Future)**

   * Payment processing fees or facilitated supplier orders: 1–2%

---

## **8. Distribution Channels**

* **Direct Field Outreach**: Shop visits, local ambassadors, community activations
* **WhatsApp / Social Media**: Marketing via informal retail communities
* **Supplier / Distributor Partnerships**: Incentivize suppliers to onboard shops
* **FMCG Brand Partnerships**: Co-marketing & integration with their distribution networks

---

## **9. KPIs & Success Metrics**

| KPI | Target |
| :--- | :--- |
| Shop Adoption | 1,000 active shops in first 6 months |
| Daily Active Usage | 70% of shops log sales daily |
| Supplier Subscriptions | 50 suppliers onboard within year 1 |
| Expiry Reduction | Reduce wastage by 20–30% per shop |
| Revenue Growth | Supplier + brand revenue covers operating cost within 12 months |