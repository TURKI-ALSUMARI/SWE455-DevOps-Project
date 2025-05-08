import { useState } from 'react';
import SearchForm from '../components/stock/SearchForm';
import StockResults from '../components/stock/StockResults';

// Use environment variable with fallback for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = `${API_URL}/api/stocks/search?term=${encodeURIComponent(searchParams.term)}&type=${searchParams.type}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format from API');
      }
      
      setSearchResults(data);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search stocks. Please try again.');
    } finally {
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