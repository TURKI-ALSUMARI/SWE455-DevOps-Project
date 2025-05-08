const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('Env file path:', path.resolve(__dirname, '.env'));
console.log('API Key exists:', !!process.env.TWELVE_DATA_API_KEY);
console.log('API Key value:', process.env.TWELVE_DATA_API_KEY?.substring(0, 4) + '...');

const app = express();

const API_KEY = process.env.TWELVE_DATA_API_KEY;
if (!API_KEY) {
  console.error('ERROR: Twelvedata API key is missing! Please add it to your .env file.');
  console.error('Example: TWELVE_DATA_API_KEY=your_api_key');
  process.exit(1); 
}

app.use(cors());
app.use(express.json());

const handleStockSearch = async (term, type) => {
  if (!term || !type) {
    throw new Error('Search term and type are required');
  }

  console.log(`Making Twelvedata API request: type=${type}, term=${term}`);
  
  try {
    if (type === 'symbol') {

      const url = `https://api.twelvedata.com/quote?symbol=${term}&apikey=${API_KEY}`;
      console.log(`Request URL: ${url}`);
      
      const response = await axios.get(url);
      console.log('TwelveData API response (symbol search):', JSON.stringify(response.data));
      
      if (response.data && !response.data.code) { 
        return [{
          symbol: term,
          name: response.data.name || term.toUpperCase(),
          price: parseFloat(response.data.close || 0),
          change: parseFloat(response.data.change || 0),
          weekLow: response.data.fifty_two_week ? parseFloat(response.data.fifty_two_week.low || 0) : 0,
          weekHigh: response.data.fifty_two_week ? parseFloat(response.data.fifty_two_week.high || 0) : 0
        }];
      } else {
        console.log('No quote data found in response or API error');
      }
      return [];
    } else {

      const searchUrl = `https://api.twelvedata.com/symbol_search?symbol=${term}&apikey=${API_KEY}`;
      const searchResponse = await axios.get(searchUrl);
      console.log('TwelveData API response (keyword search):', JSON.stringify(searchResponse.data));
      
      if (searchResponse.data && searchResponse.data.data) {
        const matches = searchResponse.data.data;

        const usExchanges = matches.filter(match => 
          match.country === "United States" || 
          match.exchange === "NASDAQ" || 
          match.exchange === "NYSE"
        );
        
        const prioritizedMatches = usExchanges.length > 0 ? usExchanges : matches;
        
        const topMatches = prioritizedMatches.slice(0, 5);
        
        const symbols = topMatches.map(match => match.symbol);
        const uniqueSymbols = [...new Set(symbols)];
        const symbolsString = uniqueSymbols.join(',');
        
        const quoteUrl = `https://api.twelvedata.com/quote?symbol=${symbolsString}&apikey=${API_KEY}`;
        console.log(`Batch quote request: ${quoteUrl}`);
        const quotesResponse = await axios.get(quoteUrl);
        console.log('Batch quotes response:', JSON.stringify(quotesResponse.data));

        const getValidQuoteData = (quotes, symbolKey) => {

          if (!symbolKey || typeof symbolKey !== 'string' || !symbolKey.match(/^[A-Z0-9.]{1,5}$/)) {
            return null;
          }

          if (!Object.hasOwn(quotes, symbolKey)) {
            return null;
          }
          
          return Object.entries(quotes)
            .filter(([key]) => key === symbolKey)
            .map(([, value]) => value)[0] || null;
        };

        const results = topMatches.map(match => {
          const symbol = match.symbol;
          let quoteData;
          
          if (uniqueSymbols.length === 1) {
            quoteData = quotesResponse.data;
          } else if (quotesResponse.data && typeof quotesResponse.data === 'object') {

            quoteData = getValidQuoteData(quotesResponse.data, symbol);
          }
          
          if (quoteData && !quoteData.code) {
            return {
              symbol: symbol,
              name: match.instrument_name,
              price: parseFloat(quoteData.close || 0),
              change: parseFloat(quoteData.change || 0),
              weekLow: parseFloat(quoteData.fifty_two_week?.low || 0),
              weekHigh: parseFloat(quoteData.fifty_two_week?.high || 0)
            };
          }
          
          return {
            symbol: symbol,
            name: match.instrument_name,
            price: 0,
            change: 0
          };
        });

        const uniqueResults = [];
        const seenSymbols = new Set();
        
        for (const result of results) {
          if (!seenSymbols.has(result.symbol)) {
            seenSymbols.add(result.symbol);
            uniqueResults.push(result);
          }
        }
        
        return uniqueResults;
      }
      return [];
    }
  } catch (error) {
    console.error('Error in Twelvedata API request:', error.message);
    throw error; 
  }
};

const searchHandler = async (req, res) => {
  try {
    const { term, type } = req.query;
    console.log(`Search request: term=${term}, type=${type}, path=${req.path}`);
    
    if (!term || !type) {
      return res.status(400).json({ error: 'Search term and type are required' });
    }
    
    if (type !== 'symbol' && type !== 'name') {
      return res.status(400).json({ error: 'Invalid search type. Must be "symbol" or "name"' });
    }
    
    const results = await handleStockSearch(term, type);

    console.log('Sending stock results to frontend:', JSON.stringify(results));
    
    res.json(results);
  } catch (error) {
    console.error(`Error in search: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};

app.get('/api/search', searchHandler);
app.get('/search', searchHandler);

app.get('/api/details/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    const response = await axios.get(`https://api.twelvedata.com/profile?symbol=${symbol}&apikey=${API_KEY}`);
    
    if (!response.data || response.data.code) { 
      return res.status(404).json({ error: 'Stock details not found' });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock details:', error);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Stock service running on port ${PORT}`);
  });
}

module.exports = app;