import React from 'react';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Stock Tracker</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <SearchPage />
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Stock Tracker - SWE455 DevOps Project</p>
        </div>
      </footer>
    </div>
  );
}

export default App;