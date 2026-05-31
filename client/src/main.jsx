import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { getRouterMode } from './lib/routerMode.js';
import './index.css';
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient();
const Router = getRouterMode() === 'hash' ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
