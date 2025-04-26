import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StockResults({ results, loading, error }) {
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div data-testid="spinner" className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading stocks...</span>
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
      <div data-testid="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
        <h3 className="font-medium">{errorTitle}</h3>
        <p>{errorMessage}</p>
        <p className="text-sm text-gray-500 mt-2">Try a different search term or try again later.</p>
      </div>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6 border-gray-200 rounded-md">
        <p className="mb-2">No results to display.</p>
        <p className="text-sm">Try searching for a company name or stock symbol.</p>
      </div>
    );
  }

  const handleRowClick = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SYMBOL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMPANY</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHANGE</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((stock, index) => (
              <tr 
                key={`${stock.symbol}-${index}`}
                onClick={() => handleRowClick(stock)}
                className="cursor-pointer hover:bg-gray-50"
                data-testid={`stock-row-${stock.symbol}`}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium">{stock.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap">{stock.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {stock.price > 0 ? 
                    `$${stock.price.toFixed(2)}` : 
                    <span className="text-gray-400">Unavailable</span>
                  }
                </td>
                <td className={`px-6 py-4 whitespace-nowrap ${
                  stock.change > 0 ? 'text-green-600' : 
                  stock.change < 0 ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {stock.change !== 0 ? 
                    `${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}` :
                    <span className="text-gray-400">—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" data-testid="chart-modal">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            {selectedStock && (
              <>
                <div className="border-b px-6 py-4">
                  <h3 className="text-lg font-semibold">
                    {selectedStock.symbol} - {selectedStock.name} Price Range
                  </h3>
                </div>
                
                <div className="px-6 py-4">
                  <div className="h-80">
                    <Bar 
                      data-testid="price-chart"
                      data={{
                        labels: ['52-Week Low', 'Current Price', '52-Week High'],
                        datasets: [{
                          data: [
                            selectedStock.weekLow || selectedStock.price * 0.8, 
                            selectedStock.price, 
                            selectedStock.weekHigh || selectedStock.price * 1.2
                          ],
                          backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            callbacks: {
                              title: () => ''
                            }
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }}
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <div className="text-blue-700 font-bold">52-Week Low</div>
                      <div className="text-xl">${(selectedStock.weekLow || selectedStock.price * 0.8).toFixed(2)}</div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <div className="text-green-700 font-bold">Current</div>
                      <div className="text-xl">${selectedStock.price.toFixed(2)}</div>
                    </div>
                    <div className="bg-red-100 p-3 rounded-lg">
                      <div className="text-red-700 font-bold">52-Week High</div>
                      <div className="text-xl">${(selectedStock.weekHigh || selectedStock.price * 1.2).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t px-6 py-4 flex justify-end">
                  <button 
                    onClick={closeModal}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded"
                    data-testid="close-modal"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

StockResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    change: PropTypes.number.isRequired,
    weekLow: PropTypes.number,
    weekHigh: PropTypes.number
  })),
  loading: PropTypes.bool,
  error: PropTypes.string
};

StockResults.defaultProps = {
  results: [],
  loading: false,
  error: null
};

export default StockResults;