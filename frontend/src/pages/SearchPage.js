import React, { useState } from 'react';
import SearchForm from '../components/stock/SearchForm';
import StockResults from '../components/stock/StockResults';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Searching with params:', searchParams);
      setTimeout(() => {
        const mockResults = [
          { symbol: 'AAPL', name: 'Apple Inc.', price: 173.45, change: 2.33 },
          { symbol: 'MSFT', name: 'Microsoft Corporation', price: 342.78, change: -1.05 },
        ];
        setSearchResults(mockResults);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to search stocks. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Stock Search
      </h1>
      
      <SearchForm onSearch={handleSearch} />
      
      <StockResults 
        results={searchResults} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default SearchPage;