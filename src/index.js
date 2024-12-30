import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { storePromise } from './redux/store';
import './index.css';
import './fonts.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { isExtension } from './util/jsutil';

// Create a StoreProvider component that waits for the store
const StoreProvider = ({ children }) => {
  const [store, setStore] = React.useState(null);

  React.useEffect(() => {
    storePromise.then(setStore);
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terminal-black">
        <div className="text-terminal-accent animate-pulse">
          Initializing...
        </div>
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
};
document.title = isExtension() ? "New Terminal" :"Teja util"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
