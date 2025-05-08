import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SearchPage from './SearchPage';

jest.mock('../components/stock/SearchForm', () => {
  const MockSearchForm = ({ onSearch }) => (
    <div data-testid="mock-search-form">
      <button onClick={() => onSearch({ term: 'AAPL', type: 'symbol' })}>
        Search
      </button>
    </div>
  );
  MockSearchForm.displayName = 'MockSearchForm';
  return MockSearchForm;
});

jest.mock('../components/stock/StockResults', () => {
  const MockStockResults = ({ results, loading, error }) => (
    <div data-testid="mock-stock-results">
      {loading && <span>Loading</span>}
      {error && <span>Error: {error}</span>}
      {results && <span>Results: {results.length}</span>}
    </div>
  );
  MockStockResults.displayName = 'MockStockResults';
  return MockStockResults;
});

global.fetch = jest.fn();

describe('SearchPage', () => {

  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn(); 
  });
  
  afterAll(() => {
    console.error = originalError; 
  });

  beforeEach(() => {
    fetch.mockClear();
    console.error.mockClear();
  });

  test('renders the search form and results components', () => {
    render(<SearchPage />);
    expect(screen.getByTestId('mock-search-form')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stock-results')).toBeInTheDocument();
  });

  test('performs search and updates state on successful API call', async () => {
    const mockResponseData = [{ symbol: 'AAPL', name: 'Apple Inc', price: 150, change: 2.5 }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    render(<SearchPage />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000/api/stocks/search')
      );
      expect(screen.getByText('Results: 1')).toBeInTheDocument();
    });
  });

  test('handles API error properly', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Server error',
    });

    render(<SearchPage />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(console.error).toHaveBeenCalled();
    });
  });
});