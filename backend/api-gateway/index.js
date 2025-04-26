const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/stocks', createProxyMiddleware({ 
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/stocks/search': '/api/search',  
    '^/api/stocks': '/api'                
  },
  logLevel: 'debug' 
}));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});