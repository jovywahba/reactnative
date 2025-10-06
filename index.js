// index.js
import { registerRootComponent } from 'expo';
import App from './App';

// ensures the app works in Expo (dev client) and in bare RN
registerRootComponent(App);
