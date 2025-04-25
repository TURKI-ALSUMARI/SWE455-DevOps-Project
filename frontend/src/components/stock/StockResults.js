import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

function StockResults({ results, loading, error }) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!results.length) {
    return <div className="text-center text-gray-500 py-6">No results to display. Search for a stock above.</div>;
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
          {results.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>${stock.price.toFixed(2)}</TableCell>
              <TableCell className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

StockResults.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      change: PropTypes.number.isRequired
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default StockResults;