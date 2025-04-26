import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Alert } from "@heroui/react";

function StockResults({ results, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
        <span className="ml-2 text-gray-600">Searching for stocks...</span>
      </div>
    );
  }
  
  if (error) {
    let errorMessage = 'Failed to search stocks.';
    let errorTitle = 'Error';
    
    if (error.includes('429') || error.includes('rate limit')) {
      errorTitle = 'API Rate Limited';
      errorMessage = 'Search limit exceeded. Please try again in a few minutes.';
    } else if (error.includes('404')) {
      errorTitle = 'Not Found';
      errorMessage = 'Stock information not available for this search.';
    } else if (error.includes('network') || error.includes('connection')) {
      errorTitle = 'Network Error';
      errorMessage = 'Unable to connect to stock service. Please check your internet connection.';
    }
    
    return (
      <Alert 
        variant="destructive"
        className="mb-6"
      >
        <h3 className="font-medium">{errorTitle}</h3>
        <p>{errorMessage}</p>
        <p className="text-sm text-gray-500 mt-2">Try a different search term or try again later.</p>
      </Alert>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6  border-gray-200 rounded-md">
        <p className="mb-2">No results to display.</p>
        <p className="text-sm">Try searching for a company name or stock symbol.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table aria-label="Stock search results">
        <TableHeader>
          <TableColumn>SYMBOL</TableColumn>
          <TableColumn>COMPANY</TableColumn>
          <TableColumn>PRICE</TableColumn>
          <TableColumn>CHANGE</TableColumn>
        </TableHeader>
        <TableBody>
          {results.map((stock, index) => (
            <TableRow key={`${stock.symbol}-${index}`}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>
                {stock.price > 0 ? 
                  `$${stock.price.toFixed(2)}` : 
                  <span className="text-gray-400">Unavailable</span>
                }
              </TableCell>
              <TableCell className={
                stock.change > 0 ? 'text-green-600' : 
                stock.change < 0 ? 'text-red-600' : 
                'text-gray-500'
              }>
                {stock.change !== 0 ? 
                  `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}` :
                  <span className="text-gray-400">—</span>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

StockResults.propTypes = {
  results: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string
};

StockResults.defaultProps = {
  results: [],
  loading: false,
  error: null
};

export default StockResults;