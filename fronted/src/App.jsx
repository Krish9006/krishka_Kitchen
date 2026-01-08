import React, { useState, useEffect } from 'react';
import './App.css';
import Approutes from './Routes/Approutes';
import ThemeToggle from './components/ThemeToggle';
import AddFood from './Pages/AddFood';
import PartnerProfile from './Pages/PartnerProfile';
import UserProfile from './Pages/UserProfile';
import { Route, Routes } from 'react-router-dom';

function App() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path='/*' element={<Approutes />} />
        <Route path='/add-food' element={<AddFood />} />
        <Route path='/partner-profile' element={<PartnerProfile />} />
        <Route path='/profile' element={<UserProfile />} />
      </Routes>
    </>
  )
}
export default App;
