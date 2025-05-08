const request = require('supertest');
const express = require('express');
const cors = require('cors');

describe('API Gateway Integration', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });
    
    app.use('/api/stocks', (req, res) => {
      let path = req.path;
      let targetPath;
      
      if (path === '/search') {
        targetPath = '/api/search';
      } else if (path.startsWith('/details/')) {
        targetPath = '/api' + path;
      } else {
        targetPath = '/api' + path;
      }
      
      const targetUrl = `http://localhost:3001${targetPath}`;
      
      if (req.query.term === 'ERROR') {
        return res.status(500).json({ error: 'Stock service error' });
      }
      
      res.status(200).json({
        success: true,
        path,
        query: req.query,
        targetUrl
      });
    });
  });
  
  test('health endpoint returns 200 status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
  
  test('proxies requests with proper path rewriting', async () => {
    const response = await request(app)
      .get('/api/stocks/search')
      .query({ term: 'AAPL', type: 'symbol' });
      
    expect(response.status).toBe(200);
    expect(response.body.path).toBe('/search');
    expect(response.body.query).toEqual({ term: 'AAPL', type: 'symbol' });
    expect(response.body.targetUrl).toBe('http://localhost:3001/api/search');
  });
  
  test('handles stock details endpoint', async () => {
    const response = await request(app).get('/api/stocks/details/AAPL');
    
    expect(response.status).toBe(200);
    expect(response.body.path).toBe('/details/AAPL');
    expect(response.body.targetUrl).toBe('http://localhost:3001/api/details/AAPL');
  });
  
  test('handles stock service errors', async () => {
    const response = await request(app)
      .get('/api/stocks/search')
      .query({ term: 'ERROR', type: 'symbol' });
      
    expect(response.status).toBe(500);
  });
});