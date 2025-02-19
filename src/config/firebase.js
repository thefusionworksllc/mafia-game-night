import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence, 
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuFNEOQzORdP1C_45MhKg94UI0DVGnnBs",
  authDomain: "mafia-game-night.firebaseapp.com",
  databaseURL: "https://mafia-game-night-default-rtdb.firebaseio.com",
  projectId: "mafia-game-night",
  storageBucket: "mafia-game-night.firebasestorage.app",
  messagingSenderId: "432712350761",
  appId: "1:432712350761:web:717a3d75d28af018d93038",
  measurementId: "G-87D4BWHHH5"
};

// Initialize Firebase immediately
const app = initializeApp(firebaseConfig);

// Initialize Auth based on platform
const auth = Platform.OS === 'web' 
  ? (() => {
      const webAuth = getAuth(app);
      setPersistence(webAuth, browserLocalPersistence)
        .catch((error) => console.error("Error setting web persistence:", error));
      return webAuth;
    })()
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

// Initialize Database immediately
const database = getDatabase(app);

// Verify initialization
if (!database) {
  throw new Error('Failed to initialize Firebase database');
}						
console.log('Firebase initialized successfully:', {
  app: !!app,
  auth: !!auth,
  database: !!database,
  databaseURL: firebaseConfig.databaseURL
});

export { app, auth, database }; 
