import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase'; // Centralized instance

export const authService = {
  /**
   * Admin-Login mit Firebase.
   */
  login: async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return userCredential.user;
    } catch (error: any) {
      console.error("Login-Fehler:", error.code, error.message);
      throw new Error("Login fehlgeschlagen: " + error.message);
    }
  },

  /**
   * Abmelden.
   */
  logout: async () => {
    await signOut(auth);
  },

  /**
   * Authentifizierungsstatus überwachen (Firebase Listener).
   */
  observeAuth: (callback: (isAuthenticated: boolean, user: User | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback(true, user);
      } else {
        callback(false, null);
      }
    });
  }
};