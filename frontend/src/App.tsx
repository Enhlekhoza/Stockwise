import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import AICountertopPage from './pages/AICountertopPage';
import AISecurityPage from './pages/AISecurityPage';
import SupplyChainPage from './pages/SupplyChainPage';
import AdvisorPage from './pages/AdvisorPage';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/countertop', name: 'AI Countertop' },
    { path: '/security', name: 'AI Security' },
    { path: '/supply-chain', name: 'Supply Chain' },
    { path: '/advisor', name: 'Advisor' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">Stockwise</div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-md p-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Welcome to Stockwise</h1>
            <div className="flex items-center">
              <span className="mr-2">Shop Owner</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/countertop" element={<AICountertopPage />} />
              <Route path="/security" element={<AISecurityPage />} />
              <Route path="/supply-chain" element={<SupplyChainPage />} />
              <Route path="/advisor" element={<AdvisorPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

