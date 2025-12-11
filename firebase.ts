import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;