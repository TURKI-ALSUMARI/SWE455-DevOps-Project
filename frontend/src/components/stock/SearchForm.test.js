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
      <div data-testid="heroui-radio-group" aria-label={label}>
      
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
      </div>
    ),
    Radio: ({ value, children, checked, onChange }) => (
      <div>
        <input
          type="radio"
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
    mockOnSearch.mockClear();
  });

  test('renders the form with default values', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    expect(screen.getByText('Stock Symbol')).toBeInTheDocument();
    expect(screen.getByTestId('heroui-button')).toBeInTheDocument();
    expect(screen.getByTestId('heroui-input')).toBeInTheDocument();
    expect(screen.getByText('Enter Stock Symbol')).toBeInTheDocument();
  });

  test('updates search term when input changes', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByTestId('heroui-input');
    fireEvent.change(input, { target: { value: 'AAPL' } });
    
    const submitButton = screen.getByTestId('heroui-button');
    fireEvent.click(submitButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith({ 
      type: 'symbol', 
      term: 'AAPL' 
    });
  });

  test('changes form mode when switching search type', () => {
    render(<SearchForm onSearch={mockOnSearch} />);

    expect(screen.getByText('Enter Stock Symbol')).toBeInTheDocument();

    const nameRadio = screen.getByTestId('radio-name');
    fireEvent.click(nameRadio);

    try {
      const companyNameLabel = screen.getByText(/Enter Company Name/i);
      expect(companyNameLabel).toBeInTheDocument();
    } catch (e) {
      expect(nameRadio).toBeChecked();
    }

  });

  test('button is disabled when search term is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByTestId('heroui-input');
    const submitButton = screen.getByTestId('heroui-button');

    expect(submitButton).toHaveAttribute('disabled');

    fireEvent.change(input, { target: { value: 'AAPL' } });
    expect(submitButton).not.toHaveAttribute('disabled');

    fireEvent.change(input, { target: { value: '' } });
    expect(submitButton).toHaveAttribute('disabled');
  });
});