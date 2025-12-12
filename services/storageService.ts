import { SiteConfig, FirestoreSettings, Order, Service, Product, BlogPost, Invoice, GalleryItem, Appointment, Testimonial, TeamMember, AdBanner } from '../types';
import { ref, set, onValue } from 'firebase/database';
import { doc, setDoc, onSnapshot, collection, query, orderBy, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, rtdb, auth } from '../firebase'; 

const LOCAL_STORAGE_KEY = 'shenay_site_config_v9';

// --- GENERIC FIRESTORE CRUD ---

export const subscribeToCollection = <T>(
  colName: string,
  onUpdate: (data: T[]) => void,
  onError?: (error: any) => void
) => {
  if (!db) return () => {};
  const q = query(collection(db, colName)); 
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => {
        const data = doc.data();
        // ID handling: Use doc.id if data.id is missing or override to ensure consistency
        return { ...data, id: data.id || (isNaN(Number(doc.id)) ? doc.id : Number(doc.id)) } as unknown as T; 
    });
    
    // Sort logic: Sort by ID (usually numeric timestamp) desc to show newest first
    const sorted = items.sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0));
    onUpdate(sorted);
  }, (error) => {
    console.warn(`Firestore subscription warning [${colName}]:`, error.code);
    if (onError) onError(error);
  });
};

export const addItem = async (colName: string, item: any) => {
    // Basic check for writes, mostly for admin items.
    // Ideally, "appointments" creation shouldn't require auth here if handled via UI securely or logic update
    // But for this simplified CMS, we check auth for "Content" items.
    // For public submissions (Appointments), we bypass if user is not admin in the calling component or allow writes via security rules.
    // Here we will allow if current user is present OR if it's the 'appointments' collection
    if (colName !== 'appointments' && !auth.currentUser) throw new Error("Yetkisiz erişim: Önce giriş yapın.");
    
    const docId = item.id ? item.id.toString() : Date.now().toString();
    const itemToSave = { ...item, id: item.id || parseInt(docId) }; 
    await setDoc(doc(db, colName, docId), itemToSave, { merge: true });
};

const deleteItem = async (colName: string, id: string | number) => {
    if (!auth.currentUser) throw new Error("Yetkisiz erişim.");
    await deleteDoc(doc(db, colName, id.toString()));
};

export const saveSettingsToFirestore = async (settings: FirestoreSettings) => {
    if (!auth.currentUser) throw new Error("Yetkisiz erişim");
    const cleanSettings = JSON.parse(JSON.stringify(settings)); // Remove undefined
    await setDoc(doc(db, "settings", "global"), cleanSettings, { merge: true });
};

// Aliases for specific collections to keep API clean
export const storageService = {
  saveSettingsToFirestore,
  
  subscribeToSettings: (onUpdate: (s: FirestoreSettings | null) => void) => {
      return onSnapshot(doc(db, "settings", "global"), (snap) => {
          onUpdate(snap.exists() ? snap.data() as FirestoreSettings : null);
      });
  },

  saveOrderToFirestore: async (order: Order) => addItem("orders", order),
  subscribeToOrders: (cb: (o: Order[]) => void) => subscribeToCollection("orders", cb),
  
  // Content Collections
  subscribeToServices: (cb: (d: Service[]) => void) => subscribeToCollection('services', cb),
  subscribeToProducts: (cb: (d: Product[]) => void) => subscribeToCollection('products', cb),
  subscribeToBlog: (cb: (d: BlogPost[]) => void) => subscribeToCollection('blog', cb),
  subscribeToGallery: (cb: (d: GalleryItem[]) => void) => subscribeToCollection('gallery', cb),
  subscribeToTestimonials: (cb: (d: Testimonial[]) => void) => subscribeToCollection('testimonials', cb),
  subscribeToTeam: (cb: (d: TeamMember[]) => void) => subscribeToCollection('team', cb),
  subscribeToBanners: (cb: (d: AdBanner[]) => void) => subscribeToCollection('banners', cb),
  subscribeToAppointments: (cb: (d: Appointment[]) => void) => subscribeToCollection('appointments', cb),

  // Generic Actions
  addService: (item: Service) => addItem('services', item),
  deleteService: (id: number) => deleteItem('services', id),

  addProduct: (item: Product) => addItem('products', item),
  deleteProduct: (id: number) => deleteItem('products', id),

  addBlogPost: (item: BlogPost) => addItem('blog', item),
  deleteBlogPost: (id: number) => deleteItem('blog', id),

  addGalleryItem: (item: GalleryItem) => addItem('gallery', item),
  deleteGalleryItem: (id: number) => deleteItem('gallery', id),

  addTestimonial: (item: Testimonial) => addItem('testimonials', item),
  deleteTestimonial: (id: number) => deleteItem('testimonials', id),

  addTeamMember: (item: TeamMember) => addItem('team', item),
  deleteTeamMember: (id: number) => deleteItem('team', id),

  addBanner: (item: AdBanner) => addItem('banners', item),
  deleteBanner: (id: number) => deleteItem('banners', id),

  // Public can add appointments, Admin can delete/update
  addAppointment: (item: Appointment) => addItem('appointments', item),
  updateAppointment: (item: Appointment) => addItem('appointments', item),
  deleteAppointment: (id: number) => deleteItem('appointments', id),
};
