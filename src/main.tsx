console.log("App is Mounting");
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from './useAuth';

// Aggressive cache clearing for the logo fix
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <React.Suspense fallback={<div className="bg-dark text-white min-h-screen flex items-center justify-center text-2xl font-bold">CaterProAi Loading...</div>}>
          <App />
        </React.Suspense>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
