
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import GoogleAnalytics from './components/GoogleAnalytics';
import FacebookPixel from './components/FacebookPixel';
import ManyChatWidget from './components/ManyChatWidget';

// Register Service Worker for iPad PWA support with aggressive update check
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      // Check for updates every time the app is loaded
      registration.update();
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content available; please refresh.');
              // Force reload to get the new logo and manifest
              window.location.reload();
            }
          };
        }
      };
    }).catch(err => {
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
