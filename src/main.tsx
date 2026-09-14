import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { App } from '@components/app/app';
import { store } from '@services/store';

import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Не найден корневой элемент приложения');
}

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>
);
