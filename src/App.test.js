import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the HeroUI button since we're not testing its internal functionality
jest.mock('@heroui/react', () => ({
  Button: ({ children, ...props }) => (
    <button data-testid="heroui-button" {...props}>
      {children}
    </button>
  )
}));

test('renders stock tracker title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Stock Tracker Application/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders get started button', () => {
  render(<App />);
  const buttonElement = screen.getByTestId('heroui-button');
  expect(buttonElement).toHaveTextContent(/Get Started/i);
});
