import React, { useState } from 'react';
import { Button, Input, Form, RadioGroup, Radio } from '@heroui/react';
import PropTypes from 'prop-types';

function SearchForm({ onSearch }) {
  const [searchType, setSearchType] = useState('symbol');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ type: searchType, term: searchTerm });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <Form onSubmit={handleSubmit}>
        <div className="mb-4">
          <RadioGroup 
            label="Search Type" 
            value={searchType} 
            onValueChange={setSearchType}
          >
            <Radio value="symbol">Stock Symbol</Radio>
            <Radio value="name">Company Name</Radio>
          </RadioGroup>
        </div>

        <div className="mb-4">
          <label className="block text-gray-500 text-md mb-2" htmlFor="search">
            {searchType === 'symbol' ? 'Enter Stock Symbol' : 'Enter Company Name'}
          </label>
          <Input
            id="search"
            type="text"
            placeholder={searchType === 'symbol' ? 'e.g. AAPL, MSFT' : 'e.g. Apple, Microsoft'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <Button 
            color="primary" 
            className="px-6 py-2" 
            type="submit"
            disabled={!searchTerm.trim()}
          >
            Search
          </Button>
        </div>
      </Form>
    </div>
  );
}

SearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default SearchForm;