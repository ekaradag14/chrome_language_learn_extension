import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // New import
const constants = require('../constants.js');
export const app = initializeApp(constants.firebaseConfig);
export const auth = getAuth(app);
