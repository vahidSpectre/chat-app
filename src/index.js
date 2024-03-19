import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { NightModeContextProvider } from './context/NightModeContext';
import { ThemeContextProvider } from './context/ThemeContext';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <NightModeContextProvider>
          <ThemeContextProvider>
            <App />
          </ThemeContextProvider>
        </NightModeContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
