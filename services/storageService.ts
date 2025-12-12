import { SiteConfig, FirestoreSettings, Order } from '../types';
import { ref, set, get, child, onValue } from 'firebase/database';
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, query, orderBy } from 'firebase/firestore';
import { db, rtdb, auth } from '../firebase'; // Centralized instances

const LOCAL_STORAGE_KEY = 'shenay_site_config_v9';

// --- FIRESTORE FUNCTIONS (settings/global) ---

export const saveSettingsToFirestore = async (settings: FirestoreSettings) => {
  if (!db || !auth) return false;
  
  // Enforce auth for writing
  if (!auth.currentUser) {
    throw new Error("Önce giriş yapın");
  }

  try {
    const docRef = doc(db, "settings", "global"); 
    await setDoc(docRef, settings, { merge: true });
    console.log("Firestore: Site ayarları güncellendi.");
    return true;
  } catch (error: any) {
    console.error("Firestore Yazma Hatası:", error);
    throw error;
  }
};

// Deprecated: use subscribeToSettings instead
export const saveSiteTitleToFirestore = async (newTitle: string) => {
    return saveSettingsToFirestore({ siteTitle: newTitle });
};

// Real-time Listener for Site Settings (Title, Subtitle, Image, Content)
export const subscribeToSettings = (
  onUpdate: (settings: FirestoreSettings | null) => void,
  onError?: (error: any) => void
) => {
  if (!db) return () => {};

  const docRef = doc(db, "settings", "global");
  
  const unsubscribe = onSnapshot(docRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreSettings;
        onUpdate(data);
      } else {
        onUpdate(null);
      }
    }, 
    (error) => {
      console.error("Firestore Settings Listener Error:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

// Deprecated wrapper for backward compatibility
export const subscribeToSiteTitle = (
    onUpdate: (title: string | null) => void,
    onError?: (error: any) => void
) => {
    return subscribeToSettings((settings) => {
        onUpdate(settings?.siteTitle || null);
    }, onError);
};


// --- FIRESTORE FUNCTIONS (orders) ---

export const saveOrderToFirestore = async (order: Order) => {
    if (!db) return false;
    try {
        // Create a new doc in 'orders' collection
        // We use order.id as document ID or let Firestore generate one. 
        // Using order.id (number) converted to string ensures idempotency.
        const docRef = doc(db, "orders", order.id.toString());
        await setDoc(docRef, order);
        console.log("Firestore: Sipariş kaydedildi.");
        return true;
    } catch (error) {
        console.error("Firestore Sipariş Kayıt Hatası:", error);
        return false;
    }
};

export const subscribeToOrders = (
    onUpdate: (orders: Order[]) => void,
    onError?: (error: any) => void
) => {
    if (!db) return () => {};

    const ordersRef = collection(db, "orders");
    // Optionally sort by date
    const q = query(ordersRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, 
        (snapshot) => {
            const orders: Order[] = [];
            snapshot.forEach((doc) => {
                orders.push(doc.data() as Order);
            });
            onUpdate(orders);
        },
        (error) => {
            console.error("Firestore Orders Listener Error:", error);
            if (onError) onError(error);
        }
    );

    return unsubscribe;
};


// --- REALTIME DB FUNCTIONS (Legacy/Full Config) ---

export const saveData = async (path: string, data: any) => {
  if (!rtdb) {
      console.warn("Firebase bağlantısı yok, işlem yapılamadı.");
      return false;
  }
  try {
      await set(ref(rtdb, path), data);
      return true;
  } catch (error: any) {
      if (error.code === 'PERMISSION_DENIED' || error.message?.includes('Permission denied')) {
          console.warn(`Firebase Save Skipped (${path}): Permission Denied. Rules likely restrict write access.`);
          return false;
      }
      console.error("Kaydetme hatası:", error);
      return false;
  }
};

export const getData = async (path: string) => {
  if (!rtdb) return null;
  try {
      const snapshot = await get(child(ref(rtdb), path));
      if (snapshot.exists()) {
          return snapshot.val();
      } else {
          return null;
      }
  } catch (error: any) {
      console.error("Veri çekme hatası:", error);
      return null;
  }
};

export const storageService = {
  saveData,
  getData,
  saveSiteTitleToFirestore,
  saveSettingsToFirestore,
  subscribeToSettings,
  subscribeToSiteTitle,
  saveOrderToFirestore,
  subscribeToOrders,
  
  save: async (config: SiteConfig) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    return await saveData('siteConfig', config);
  },

  subscribe: (callback: (data: SiteConfig | null) => void) => {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
        try { callback(JSON.parse(local)); } catch (e) { console.error(e); }
    }

    if (rtdb) {
        const configRef = ref(rtdb, 'siteConfig');
        onValue(configRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
                callback(data);
            }
        }, (error) => {
            if (error.code !== 'PERMISSION_DENIED') {
                console.warn("Firebase Subscribe Error:", error);
            }
        });
    }

    const handler = (e: StorageEvent) => {
        if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
            try { callback(JSON.parse(e.newValue)); } catch (e) {}
        }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
};