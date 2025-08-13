const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 4201;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Proxy middleware configuration
const proxyOptions = {
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> http://localhost:3000${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('[PROXY] Error:', err.message);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
};

// Apply proxy middleware to /api routes
app.use('/api', createProxyMiddleware(proxyOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server is running', target: 'http://localhost:3000' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying /api/* requests to http://localhost:3000/api/*`);
  console.log(`🔧 Configure your Angular app to use: http://localhost:${PORT}`);
});
