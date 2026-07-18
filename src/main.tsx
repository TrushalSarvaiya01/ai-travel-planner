import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ContactPage from './ContactPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

function renderApp() {
  const path = window.location.pathname;
  if (path === '/contact') {
    root.render(
      <React.StrictMode>
        <ContactPage />
      </React.StrictMode>,
    );
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}

renderApp();

window.addEventListener('popstate', renderApp);
