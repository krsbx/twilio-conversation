import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import customTheme from './utils/customTheme';
import store from './store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider theme={customTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ChakraProvider>
);
