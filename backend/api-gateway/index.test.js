const { createProxyMiddleware } = require('http-proxy-middleware');

jest.mock('http-proxy-middleware');
jest.mock('cors', () => jest.fn(() => jest.fn()));
jest.mock('express', () => {
  const mockJson = jest.fn(() => jest.fn());
  const mockExpress = jest.fn(() => ({
    use: jest.fn(),
    get: jest.fn(),
    listen: jest.fn((port, callback) => {
      if (callback) callback();
      return mockExpress;
    })
  }));
  mockExpress.json = mockJson;
  return mockExpress;
});

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('API Gateway', () => {
  test('creates proxy middleware with correct configuration', () => {
    createProxyMiddleware.mockReturnValue(jest.fn());
    
    require('./index');
    
    expect(createProxyMiddleware).toHaveBeenCalledWith({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api/stocks/search': '/api/search',
        '^/api/stocks': '/api'
      },
      logLevel: 'debug'
    });
  });
  
  test('configures health endpoint', () => {
    jest.resetModules();
    
    const mockApp = {
      use: jest.fn(),
      get: jest.fn(),
      listen: jest.fn((port, callback) => {
        if (callback) callback();
        return mockApp;
      })
    };
    
    const mockExpress = jest.fn(() => mockApp);
    mockExpress.json = jest.fn(() => jest.fn());
    
    jest.doMock('express', () => mockExpress);
    createProxyMiddleware.mockReturnValue(jest.fn());
    
    require('./index');
    
    expect(mockApp.get).toHaveBeenCalledWith('/health', expect.any(Function));
    
    const healthHandler = mockApp.get.mock.calls[0][1];
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    healthHandler(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ status: 'ok' });
  });
});