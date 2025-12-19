
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import GoogleAnalytics from './components/GoogleAnalytics';
import FacebookPixel from './components/FacebookPixel';
import ManyChatWidget from './components/ManyChatWidget';

// Register Service Worker for iPad PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleAnalytics />
      <FacebookPixel />
      <ManyChatWidget />
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
