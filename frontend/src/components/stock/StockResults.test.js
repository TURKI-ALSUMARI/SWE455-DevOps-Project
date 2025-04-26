import React from 'react';
import { render, screen } from '@testing-library/react';
import StockResults from './StockResults';

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
    { symbol: 'AAPL', name: 'Apple Inc', price: 150.5, change: 2.5 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 240.75, change: -1.25 },
    { symbol: 'GOOG', name: 'Alphabet Inc', price: 2100, change: 0 }
  ];

  test('shows loading spinner when loading prop is true', () => {
    render(<StockResults loading={true} results={[]} error={null} />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('shows error message when error prop is provided', () => {
    render(<StockResults loading={false} results={[]} error="API error occurred" />);
    expect(screen.getByTestId('alert')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();

    expect(screen.getByText('Failed to search stocks.')).toBeInTheDocument();
  });

  test('shows no results message when results array is empty', () => {
    render(<StockResults loading={false} results={[]} error={null} />);
    expect(screen.getByText('No results to display.')).toBeInTheDocument();
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

    expect(screen.getByText('-1.25')).toBeInTheDocument();

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('correctly formats prices and changes', () => {
    const testResults = [
      { symbol: 'TEST', name: 'Test Stock', price: 0, change: 0 }
    ];
    
    render(<StockResults loading={false} results={testResults} error={null} />);
    
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('handles different error types with appropriate messages', () => {
    render(<StockResults loading={false} results={[]} error="429: Too many requests" />);
    expect(screen.getByText('API Rate Limited')).toBeInTheDocument();
    expect(screen.getByText('Search limit exceeded. Please try again in a few minutes.')).toBeInTheDocument();
    
    render(<StockResults loading={false} results={[]} error="404: Not found" />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
    
    render(<StockResults loading={false} results={[]} error="network error" />);
    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText('Unable to connect to stock service. Please check your internet connection.')).toBeInTheDocument();
  });
});