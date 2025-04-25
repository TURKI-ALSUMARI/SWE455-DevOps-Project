import React from 'react';
import { Button } from '@heroui/react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Stock Tracker Application
        </h1>
        
        <div className="flex justify-center">
          <Button color="primary" className="px-6 py-2">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;