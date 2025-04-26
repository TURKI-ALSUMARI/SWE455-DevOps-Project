import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./pages/SearchPage', () => {
  const MockSearchPage = () => <div data-testid="mock-search-page">SearchPage</div>;
  MockSearchPage.displayName = 'MockSearchPage'; 
  return MockSearchPage;
});

test('renders stock tracker title', () => {
  render(<App />);
  const titleElement = screen.getByText(/^Stock Tracker$/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders footer with copyright', () => {
  render(<App />);
  const footerElement = screen.getByText(/© 2025 Stock Tracker/i);
  expect(footerElement).toBeInTheDocument();
});

test('renders SearchPage component', () => {
  render(<App />);
  const searchPageElement = screen.getByTestId('mock-search-page');
  expect(searchPageElement).toBeInTheDocument();
});
