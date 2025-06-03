import React from 'react';
import { Toaster } from 'react-hot-toast';
import WeatherDashboard from './components/WeatherDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900">
      <Toaster position="top-right" />
      <WeatherDashboard />
    </div>
  );
}

export default App;