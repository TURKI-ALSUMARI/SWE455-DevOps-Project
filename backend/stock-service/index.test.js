const axios = require('axios');
const request = require('supertest');

process.env.TWELVE_DATA_API_KEY = 'test-api-key';
process.env.PORT = 3001;

console.log = jest.fn();
console.error = jest.fn();

jest.mock('axios');
jest.mock('path', () => ({
  resolve: () => '.env'
}));

jest.mock('dotenv', () => ({
  config: jest.fn()
}));

const app = require('./index');

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Stock Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log.mockClear();
    console.error.mockClear();
  });

  describe('Symbol Search', () => {
    test('returns properly formatted data for valid symbol', async () => {
      const mockQuoteData = { 
        symbol: 'AAPL',
        name: 'Apple Inc',
        close: '200.5',
        change: '2.5'
      };
      
      axios.get.mockResolvedValueOnce({ data: mockQuoteData });
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'AAPL', type: 'symbol' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        symbol: 'AAPL',
        name: 'Apple Inc'
      });
      
      expect(typeof response.body[0].price).toBe('number');
      expect(typeof response.body[0].change).toBe('number');
      
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('symbol=AAPL')
      );
    });
    
    test('returns empty array for unknown symbol', async () => {
      axios.get.mockResolvedValueOnce({ data: { code: 404, message: 'Symbol not found' } });
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'INVALID', type: 'symbol' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    test('handles API errors correctly', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'AAPL', type: 'symbol' });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: expect.any(String) });
    });
  });

  describe('Name Search', () => {
    test('returns multiple stocks when searching by name', async () => {
      const mockSearchData = {
        data: [
          { symbol: 'AAPL', instrument_name: 'Apple Inc.', exchange: 'NASDAQ', country: 'United States' },
          { symbol: 'MSFT', instrument_name: 'Microsoft Corporation', exchange: 'NASDAQ', country: 'United States' }
        ]
      };
      
      const mockQuoteData = {
        'AAPL': { close: '200.5', change: '2.5' },
        'MSFT': { close: '300.75', change: '-1.25' }
      };
      
      axios.get.mockImplementation((url) => {
        if (url.includes('symbol_search')) {
          return Promise.resolve({ data: mockSearchData });
        } else if (url.includes('quote')) {
          return Promise.resolve({ data: mockQuoteData });
        }
      });
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'Apple', type: 'name' });
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('symbol');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('price');
      expect(response.body[0]).toHaveProperty('change');
      
      expect(typeof response.body[0].price).toBe('number');
      expect(typeof response.body[0].change).toBe('number');
    });
    
    test('prioritizes US exchanges in results', async () => {
      const mockSearchData = {
        data: [
          { symbol: 'AAPL', instrument_name: 'Apple Inc.', exchange: 'Other', country: 'Germany' },
          { symbol: 'AAPL', instrument_name: 'Apple Inc.', exchange: 'NASDAQ', country: 'United States' }
        ]
      };
      
      const mockQuoteData = {
        'AAPL': { close: '200.5', change: '2.5' }
      };
      
      axios.get.mockImplementation((url) => {
        if (url.includes('symbol_search')) {
          return Promise.resolve({ data: mockSearchData });
        } else if (url.includes('quote')) {
          return Promise.resolve({ data: mockQuoteData });
        }
      });
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'Apple', type: 'name' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
    
    test('handles empty search results', async () => {
      axios.get.mockResolvedValueOnce({ data: { data: [] } });
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'NonexistentCompany', type: 'name' });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
    
    test('handles API errors in name search', async () => {
      axios.get.mockRejectedValueOnce(new Error('API error'));
      
      const response = await request(app)
        .get('/api/search')
        .query({ term: 'Apple', type: 'name' });
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: expect.any(String) });
    });
  });

  test('handles missing search parameters', async () => {
    const response = await request(app).get('/api/search');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('rejects invalid search types', async () => {
    const response = await request(app)
      .get('/api/search')
      .query({ term: 'AAPL', type: 'invalid' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});