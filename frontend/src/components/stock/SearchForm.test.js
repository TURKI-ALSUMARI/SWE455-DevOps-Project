import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from './SearchForm';

jest.mock('@heroui/react', () => {
  return {
    Button: (props) => (
      <button data-testid="heroui-button" disabled={props.disabled} onClick={props.onClick}>
        {props.children}
      </button>
    ),
    Input: (props) => (
      <input 
        data-testid="heroui-input"
        id="search"
        placeholder={props.placeholder}
        value={props.value || ""}
        onChange={props.onChange}
      />
    ),
    Form: ({ children, onSubmit }) => (
      <form data-testid="heroui-form" onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(e); }}>
        {children}
      </form>
    ),
    RadioGroup: ({ children, label, value, onValueChange }) => (
      <fieldset data-testid="heroui-radio-group" aria-label={label}>
        <legend>{label}</legend>
        {Array.isArray(children) 
          ? children.map(child => ({
              ...child,
              props: {
                ...child.props,
                checked: child.props.value === value,
                onChange: () => onValueChange(child.props.value)
              }
            }))
          : { 
              ...children, 
              props: {
                ...children.props,
                checked: children.props.value === value,
                onChange: () => onValueChange(children.props.value)
              }
            }
        }
      </fieldset>
    ),
    Radio: ({ value, children, checked, onChange }) => (
      <div>
        <input
          type="radio"
          id={`radio-${value}`}
          data-testid={`radio-${value}`}
          value={value}
          checked={checked || false}
          onChange={() => onChange && onChange()}
        />
        <label htmlFor={`radio-${value}`}>{children}</label>
      </div>
    ),
  };
});

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form elements correctly', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    // Check radio options
    expect(screen.getByTestId('radio-symbol')).toBeInTheDocument();
    expect(screen.getByTestId('radio-name')).toBeInTheDocument();
    expect(screen.getByText('Stock Symbol')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();
    
    // Check input field
    expect(screen.getByPlaceholderText(/e.g. AAPL, MSFT/i)).toBeInTheDocument();
    
    // Check button
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
    // Button should be disabled initially
    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();
  });

  test('disables search button when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    expect(searchButton).toBeDisabled();
  });

  test('enables search button when input has text', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText(/e.g. AAPL, MSFT/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });
    expect(searchButton).not.toBeDisabled();
  });

  test('updates placeholder when search type changes', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    // Initially shows symbol placeholder
    expect(screen.getByPlaceholderText(/e.g. AAPL, MSFT/i)).toBeInTheDocument();
    
    // Change to company name search
    fireEvent.click(screen.getByTestId('radio-name'));
    
    // Now shows company name placeholder
    expect(screen.getByPlaceholderText(/e.g. Apple, Microsoft/i)).toBeInTheDocument();
  });
  
  test('calls onSearch with correct parameters when submitted', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/e.g. AAPL, MSFT/i);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    
    // Type into input
    fireEvent.change(searchInput, { target: { value: 'AAPL' } });
    
    // Submit form
    fireEvent.click(searchButton);
    
    // Check if onSearch was called with correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith({ type: 'symbol', term: 'AAPL' });
    
    // Change to company name search
    fireEvent.click(screen.getByTestId('radio-name'));
    
    // Change input
    fireEvent.change(searchInput, { target: { value: 'Apple' } });
    
    // Submit form again
    fireEvent.click(searchButton);
    
    // Check if onSearch was called with correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith({ type: 'name', term: 'Apple' });
  });
});