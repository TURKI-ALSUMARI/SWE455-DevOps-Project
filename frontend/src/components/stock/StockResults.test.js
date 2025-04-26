import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StockResults from './StockResults';

// Mock chart.js to avoid rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mocked-chart">Chart</div>,
}));

// Mock the Chart.js library
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

jest.mock('@heroui/react', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
  Table: ({ children, ...props }) => <table {...props}>{children}</table>,
  TableHeader: ({ children }) => <thead><tr>{children}</tr></thead>, 
  TableColumn: ({ children }) => <th>{children}</th>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableRow: ({ children }) => <tr>{children}</tr>,
  TableCell: ({ children, className }) => <td className={className}>{children}</td>,
  Alert: ({ children, variant, className }) => (
    <div data-testid="alert" className={`${variant} ${className}`}>
      {children}
    </div>
  ),
}));

describe('StockResults', () => {
  const mockResults = [
    { symbol: 'AAPL', name: 'Apple Inc', price: 150.50, change: 2.50, weekLow: 125.00, weekHigh: 180.00 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 240.75, change: -1.25, weekLow: 220.00, weekHigh: 260.00 },
    { symbol: 'GOOG', name: 'Alphabet Inc', price: 2100.00, change: 0, weekLow: 1900.00, weekHigh: 2250.00 }
  ];

  test('shows loading spinner when loading prop is true', () => {
    render(<StockResults loading={true} results={[]} error={null} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText(/Loading stocks/i)).toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    render(<StockResults loading={false} results={[]} error="API error occurred" />);
    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to search stocks.')).toBeInTheDocument();
  });

  test('renders table with stock results when data is provided', () => {
    render(<StockResults loading={false} results={mockResults} error={null} />);
    
    expect(screen.getByText('SYMBOL')).toBeInTheDocument();
    expect(screen.getByText('COMPANY')).toBeInTheDocument();
    expect(screen.getByText('PRICE')).toBeInTheDocument();
    expect(screen.getByText('CHANGE')).toBeInTheDocument();
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc')).toBeInTheDocument();
    expect(screen.getByText('$150.50')).toBeInTheDocument();
    expect(screen.getByText('+2.50')).toBeInTheDocument();
    
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Corporation')).toBeInTheDocument();
    expect(screen.getByText('-1.25')).toBeInTheDocument();
  });

  test('shows empty state when no results are provided', () => {
    render(<StockResults loading={false} results={[]} error={null} />);
    expect(screen.getByText('No results to display.')).toBeInTheDocument();
  });

  test('displays modal with chart when a stock row is clicked', () => {
    render(<StockResults loading={false} results={mockResults} error={null} />);
    
    // Click on a stock row
    fireEvent.click(screen.getByTestId('stock-row-AAPL'));
    
    // Check if modal is displayed
    expect(screen.getByTestId('chart-modal')).toBeInTheDocument();
    expect(screen.getByText('AAPL - Apple Inc Price Range')).toBeInTheDocument();
    
    // Check if modal can be closed
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('chart-modal')).not.toBeInTheDocument();
  });

  test('handles different error types with appropriate messages', () => {
    render(<StockResults loading={false} results={[]} error="429: Too many requests" />);
    expect(screen.getByText('API Rate Limited')).toBeInTheDocument();
    expect(screen.getByText('Search limit exceeded. Please try again in a few minutes.')).toBeInTheDocument();
    
    render(<StockResults loading={false} results={[]} error="404: Not found" />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    
    render(<StockResults loading={false} results={[]} error="network error" />);
    expect(screen.getByText('Network Error')).toBeInTheDocument();
  });
});