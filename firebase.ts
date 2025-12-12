import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCSK6o0MxAqqgVyNhAwc7i_u5ncl9TqoYE",
  authDomain: "e-s-ai.firebaseapp.com",
  databaseURL: "https://e-s-ai-default-rtdb.firebaseio.com",
  projectId: "e-s-ai",
  storageBucket: "e-s-ai.appspot.com",
  messagingSenderId: "884733943510",
  appId: "1:884733943510:web:1fea2f4512924337f9b377",
  measurementId: "G-CNFG1C81XP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Enable persistence for mobile browsers
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth Persistence Error:", error);
});

export default app;