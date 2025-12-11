import { SiteConfig } from '../types';
import { ref, set, get, child, onValue } from 'firebase/database';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, rtdb, auth } from '../firebase'; // Centralized instances

const LOCAL_STORAGE_KEY = 'shenay_site_config_v9';

// --- FIRESTORE FUNCTIONS (settings/siteTitle) ---

export const saveSiteTitleToFirestore = async (newTitle: string) => {
  if (!db || !auth) return false;
  
  // Enforce auth for writing
  if (!auth.currentUser) {
    throw new Error("Önce giriş yapın");
  }

  try {
    const docRef = doc(db, "settings", "siteTitle"); 
    // Save to 'value' field as requested
    await setDoc(docRef, { value: newTitle }, { merge: true });
    console.log("Firestore: Site başlığı güncellendi.");
    return true;
  } catch (error: any) {
    console.error("Firestore Yazma Hatası:", error);
    throw error;
  }
};

export const getSiteTitleFromFirestore = async (): Promise<string | null> => {
  if (!db) return null;

  try {
    const docRef = doc(db, "settings", "siteTitle");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().value;
    } else {
      return null;
    }
  } catch (error: any) {
    // Permission denied hatasını veya diğer erişim hatalarını yakala ve sessizce null dön.
    // Bu sayede uygulama çökmez ve varsayılan başlığı kullanır.
    if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
        console.warn("Firestore: Erişim kısıtlı (Permission Denied). Varsayılan başlık kullanılıyor.");
        return null;
    }
    console.warn("Firestore Okuma Uyarısı:", error.message);
    return null;
  }
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
  getSiteTitleFromFirestore,
  
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