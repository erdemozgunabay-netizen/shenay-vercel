import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase'; // Centralized instance

export const authService = {
  /**
   * Firebase ile Admin girişi yap.
   */
  login: async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return userCredential.user;
    } catch (error: any) {
      console.error("Giriş Hatası:", error.code, error.message);
      throw new Error("Giriş başarısız: " + error.message);
    }
  },

  /**
   * Çıkış yap.
   */
  logout: async () => {
    await signOut(auth);
  },

  /**
   * Oturum durumunu dinle (Firebase Listener).
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