import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detection from './pages/Detection';
import HandSigns from './pages/HandSigns';
import About from './pages/About';
import { apiService } from './services/api';

export function App() {
  const [backendStatus, setBackendStatus] = useState('online');

  // Check health on mount and every 10 seconds
  useEffect(() => {
    const checkEngine = async () => {
      const res = await apiService.checkHealth();
      setBackendStatus(res.success ? 'online' : 'offline');
    };

    checkEngine();
    const interval = setInterval(checkEngine, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar backendStatus={backendStatus} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detection" element={<Detection />} />
            <Route path="/signs" element={<HandSigns />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
