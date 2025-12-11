import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Video, Type, 
  Users, ShoppingBag, Package, Settings, RefreshCw, 
  Trash2, LogOut, CheckCircle, X, Plus, Printer, 
  Phone, Mail, MapPin, Menu, Calendar, User, Clock,
  ArrowRight, ExternalLink, CloudUpload, Loader2, Upload
} from 'lucide-react';
import { TranslationStructure, SiteConfig, Service, Product, BlogPost, Order, Appointment } from '../types';
import { AdminLogin } from './AdminLogin';
import { storageService, saveSiteTitleToFirestore } from '../services/storageService';
import { auth } from '../firebase'; // Import auth to check user status directly

interface AdminDashboardProps {
  t: TranslationStructure['admin'];
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

// ... (STATUS CONSTANTS kept same)
const ORDER_STATUS_LABELS: Record<Order['status'], string> = {
  pending: 'Beklemede',
  shipped: 'Kargolandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  return_requested: 'İade Talebi',
  returned: 'İade Edildi',
  refunded: 'Geri Ödendi'
};

const ORDER_STATUS_COLORS: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  return_requested: 'bg-orange-100 text-orange-700',
  returned: 'bg-purple-100 text-purple-700',
  refunded: 'bg-gray-100 text-gray-700'
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ t, siteConfig, setSiteConfig, isAuthenticated, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Genel Bakış'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false); // New state for success message
  
  // Manual Edit States
  const [manualTitle, setManualTitle] = useState(siteConfig.heroTitle);
  const [manualSubtitle, setManualSubtitle] = useState(siteConfig.heroSubtitle);
  const [manualImage, setManualImage] = useState(siteConfig.heroImage);
  const [manualVideo, setManualVideo] = useState(siteConfig.heroVideo || '');
  const [manualAboutImage, setManualAboutImage] = useState(siteConfig.aboutImage);
  const [manualAboutText, setManualAboutText] = useState(siteConfig.aboutText);
  
  // New Footer/Contact States
  const [manualSiteTitle, setManualSiteTitle] = useState(siteConfig.siteTitle);
  const [manualFooterBio, setManualFooterBio] = useState(siteConfig.footerBio);
  const [manualEmail, setManualEmail] = useState(siteConfig.contactEmail);
  const [manualPhone, setManualPhone] = useState(siteConfig.contactPhone);
  const [manualAddress, setManualAddress] = useState(siteConfig.contactAddress);
  const [manualNsTitle, setManualNsTitle] = useState(siteConfig.newsletterTitle);
  const [manualNsText, setManualNsText] = useState(siteConfig.newsletterText);

  // Payment States
  const [manualAccount, setManualAccount] = useState(siteConfig.paymentConfig?.accountHolder || '');
  const [manualIban, setManualIban] = useState(siteConfig.paymentConfig?.iban || '');
  const [manualBank, setManualBank] = useState(siteConfig.paymentConfig?.bankName || '');
  const [manualSwift, setManualSwift] = useState(siteConfig.paymentConfig?.swift || '');

  // Invoice Legal States
  const [manualTaxId, setManualTaxId] = useState(siteConfig.invoiceConfig?.taxId || '');
  const [manualVatId, setManualVatId] = useState(siteConfig.invoiceConfig?.vatId || '');
  const [manualJurisdiction, setManualJurisdiction] = useState(siteConfig.invoiceConfig?.jurisdiction || '');

  // Order View State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Drag and Drop State for Products
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  // Responsive Check
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync local state when config changes
  useEffect(() => {
    setManualTitle(siteConfig.heroTitle);
    setManualSubtitle(siteConfig.heroSubtitle);
    setManualImage(siteConfig.heroImage);
    setManualVideo(siteConfig.heroVideo || '');
    setManualAboutImage(siteConfig.aboutImage);
    setManualAboutText(siteConfig.aboutText);
    
    // Only sync title if we are not currently saving (to avoid jumpiness)
    // The real-time listener handles the incoming updates
    if (siteConfig.siteTitle && !isSaving) {
       setManualSiteTitle(siteConfig.siteTitle);
    }
    
    setManualFooterBio(siteConfig.footerBio);
    setManualEmail(siteConfig.contactEmail);
    setManualPhone(siteConfig.contactPhone);
    setManualAddress(siteConfig.contactAddress);
    setManualNsTitle(siteConfig.newsletterTitle);
    setManualNsText(siteConfig.newsletterText);
    setManualAccount(siteConfig.paymentConfig?.accountHolder || '');
    setManualIban(siteConfig.paymentConfig?.iban || '');
    setManualBank(siteConfig.paymentConfig?.bankName || '');
    setManualSwift(siteConfig.paymentConfig?.swift || '');
    setManualTaxId(siteConfig.invoiceConfig?.taxId || '');
    setManualVatId(siteConfig.invoiceConfig?.vatId || '');
    setManualJurisdiction(siteConfig.invoiceConfig?.jurisdiction || '');
  }, [siteConfig]);


  // -- Image Resizer Utility --
  const resizeImage = (file: File, maxWidth: number = 1000, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image(); 
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("Canvas context error"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
  };

  // --- SAVE TO CLOUD ---
  const handlePublishChanges = async () => {
      // Auth Check
      if (!auth.currentUser) {
          alert("Önce giriş yapın");
          return;
      }

      if (confirm("Tüm değişiklikler buluta kaydedilecek. Onaylıyor musunuz?")) {
          setIsSaving(true);
          setSaveSuccess(false); // Reset before save
          try {
              // 1. Tüm config'i 'siteConfig' altına kaydet (Realtime DB)
              await storageService.saveData('siteConfig', siteConfig);
              
              // 2. Site Başlığını FIRESTORE'a kaydet (Requirement)
              const titleToSave = manualSiteTitle;
              
              try {
                  await saveSiteTitleToFirestore(titleToSave);
                  // Başarılı olduğunda state güncelle
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 3000); // 3 saniye sonra mesajı kaldır
              } catch (firestoreError: any) {
                  if (firestoreError.message.includes("Önce giriş yapın")) {
                      alert("Önce giriş yapın");
                  } else {
                      alert("Firestore kaydı sırasında bir hata oluştu: " + firestoreError.message);
                  }
              }

          } catch (e) {
              alert("❌ Genel hata oluştu.");
              console.error(e);
          } finally {
              setIsSaving(false);
          }
      }
  };

  // ... (Rest of the component functions: handleManualUpdate, handleMediaUpdate, etc. stay the same)

  const handleManualUpdate = () => {
      setSiteConfig(prev => ({
          ...prev,
          heroTitle: manualTitle,
          heroSubtitle: manualSubtitle
      }));
  };

  const handleMediaUpdate = async (type: 'image' | 'video' | 'about', urlOrFile: string | File) => {
      if (urlOrFile instanceof File) {
          try {
             const base64 = await resizeImage(urlOrFile, 1200, 0.8);
             if (type === 'image') setSiteConfig(prev => ({ ...prev, heroImage: base64 }));
             if (type === 'about') setSiteConfig(prev => ({ ...prev, aboutImage: base64 }));
             alert("Görsel işlendi! Yayınlamak için 'Yayınla' butonuna basmayı unutmayın.");
          } catch (e) {
              alert("Görsel işlenirken hata oluştu.");
          }
      } else {
          if (type === 'image') setSiteConfig(prev => ({ ...prev, heroImage: urlOrFile }));
          if (type === 'video') setSiteConfig(prev => ({ ...prev, heroVideo: urlOrFile }));
          if (type === 'about') setSiteConfig(prev => ({ ...prev, aboutImage: urlOrFile }));
          alert("Medya güncellendi!");
      }
  };

  const handleFooterUpdate = () => {
      setSiteConfig(prev => ({
          ...prev,
          siteTitle: manualSiteTitle, // This updates the config state
          footerBio: manualFooterBio,
          contactEmail: manualEmail,
          contactPhone: manualPhone,
          contactAddress: manualAddress,
          newsletterTitle: manualNsTitle,
          newsletterText: manualNsText,
          paymentConfig: {
            ...prev.paymentConfig,
            accountHolder: manualAccount,
            bankName: manualBank,
            iban: manualIban,
            swift: manualSwift
          },
          invoiceConfig: {
            taxId: manualTaxId,
            vatId: manualVatId,
            jurisdiction: manualJurisdiction
          }
      }));
      alert("Ayarlar güncellendi! 'Yayınla' butonuna basarak veritabanına yazın.");
  };

  const handleAboutTextUpdate = () => {
    setSiteConfig(prev => ({
      ...prev,
      aboutText: manualAboutText
    }));
  };

  // ... (CMS Logic methods - handleServiceUpdate, handleProductUpdate, etc. kept as is)
  const handleServiceUpdate = (id: number, field: keyof Service, value: any) => {
    setSiteConfig(prev => ({
        ...prev,
        services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };
  const handleServiceAdd = () => {
      const newId = Math.max(...siteConfig.services.map(s => s.id), 0) + 1;
      const newService: Service = {
          id: newId,
          title: "Yeni Hizmet",
          description: "Kısa açıklama...",
          longDescription: "Detaylı açıklama buraya gelecek.",
          image: "https://via.placeholder.com/400",
          gallery: []
      };
      setSiteConfig(prev => ({ ...prev, services: [...prev.services, newService] }));
  };
  const handleServiceDelete = (id: number) => {
      if (confirm("Bu hizmeti silmek istediğinize emin misiniz?")) {
          setSiteConfig(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
      }
  };
  const handleServiceGalleryAdd = async (id: number, file: File) => {
      try {
          const base64 = await resizeImage(file, 800, 0.8);
          setSiteConfig(prev => ({
              ...prev,
              services: prev.services.map(s => {
                  if (s.id === id) {
                      return { ...s, gallery: [...(s.gallery || []), base64] };
                  }
                  return s;
              })
          }));
      } catch (err) {
          alert("Fotoğraf yüklenemedi.");
      }
  };
  const handleServiceGalleryRemove = (id: number, indexToRemove: number) => {
      setSiteConfig(prev => ({
          ...prev,
          services: prev.services.map(s => {
              if (s.id === id && s.gallery) {
                  return { ...s, gallery: s.gallery.filter((_, i) => i !== indexToRemove) };
              }
              return s;
          })
      }));
  };
  // Blog
  const handleBlogUpdate = (id: number, field: keyof BlogPost, value: any) => {
    setSiteConfig(prev => ({
      ...prev,
      blogPosts: prev.blogPosts.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };
  const handleBlogAdd = () => {
    const newId = Math.max(...(siteConfig.blogPosts?.map(p => p.id) || [0]), 0) + 1;
    const newPost: BlogPost = {
      id: newId,
      title: "Yeni Blog Yazısı",
      excerpt: "Kısa özet...",
      content: "Detaylı içerik buraya...",
      date: new Date().toISOString().split('T')[0],
      image: "https://via.placeholder.com/600x400",
      gallery: []
    };
    setSiteConfig(prev => ({ ...prev, blogPosts: [...(prev.blogPosts || []), newPost] }));
  };
  const handleBlogDelete = (id: number) => {
    if (confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) {
      setSiteConfig(prev => ({ ...prev, blogPosts: prev.blogPosts.filter(p => p.id !== id) }));
    }
  };
  const handleBlogGalleryAdd = async (id: number, file: File) => {
    try {
      const base64 = await resizeImage(file, 800, 0.8);
      setSiteConfig(prev => ({
        ...prev,
        blogPosts: prev.blogPosts.map(p => {
          if (p.id === id) {
            return { ...p, gallery: [...(p.gallery || []), base64] };
          }
          return p;
        })
      }));
    } catch (err) {
      alert("Fotoğraf yüklenemedi.");
    }
  };
  const handleBlogGalleryRemove = (id: number, indexToRemove: number) => {
    setSiteConfig(prev => ({
      ...prev,
      blogPosts: prev.blogPosts.map(p => {
        if (p.id === id && p.gallery) {
          return { ...p, gallery: p.gallery.filter((_, i) => i !== indexToRemove) };
        }
        return p;
      })
    }));
  };
  // Product
  const handleProductUpdate = (id: number, field: keyof Product, value: string | number) => {
    setSiteConfig(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };
  const handleProductAdd = () => {
      const newId = Math.max(...siteConfig.products.map(p => p.id), 0) + 1;
      const newProduct: Product = {
          id: newId,
          name: "Yeni Ürün",
          description: "Ürün açıklaması...",
          price: "€0.00",
          image: "https://via.placeholder.com/400",
          rating: 5,
          orderCount: 0,
          voteCount: 0
      };
      setSiteConfig(prev => ({ ...prev, products: [...prev.products, newProduct] }));
  };
  const handleProductDelete = (id: number) => {
      if(confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
          setSiteConfig(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
      }
  };
  const handleDragOver = (e: React.DragEvent, id: number) => {
      e.preventDefault();
      setDragOverId(id);
  };
  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverId(null);
  };
  const handleDrop = async (e: React.DragEvent, id: number) => {
      e.preventDefault();
      setDragOverId(null);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          try {
              const base64 = await resizeImage(file, 600, 0.8);
              handleProductUpdate(id, 'image', base64);
          } catch (err) {
              alert("Görsel yüklenemedi.");
          }
      }
  };
  // Order
  const handleOrderStatus = (id: number, status: Order['status']) => {
      setSiteConfig(prev => ({
          ...prev,
          orders: prev.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
      if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
  };
  const handleOrderDelete = (id: number) => {
      if(confirm("Bu siparişi kayıtlardan silmek istiyor musunuz?")) {
          setSiteConfig(prev => ({
              ...prev,
              orders: prev.orders.filter(o => o.id !== id)
          }));
          if (selectedOrder?.id === id) setSelectedOrder(null);
      }
  };
  const handleAppointmentStatus = (id: number, status: 'confirmed' | 'cancelled') => {
    setSiteConfig(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => a.id === id ? { ...a, status } : a)
    }));
  };
  const handleAppointmentDelete = (id: number) => {
    if(confirm("Randevuyu silmek istediğinize emin misiniz?")) {
        setSiteConfig(prev => ({
            ...prev,
            appointments: prev.appointments.filter(a => a.id !== id)
        }));
    }
  };
  const handlePrintInvoice = () => {
    if (!selectedOrder) return;
    const getPrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
    const grossTotal = getPrice(selectedOrder.totalAmount);
    const netTotal = grossTotal / 1.19; // 19% MwSt included
    const taxAmount = grossTotal - netTotal;
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
          <meta charset="UTF-8">
          <title>Rechnung #${selectedOrder.id}</title>
          <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; padding: 40px; }
              .header { display: flex; justify-content: space-between; margin-bottom: 50px; }
              .logo { font-size: 24px; font-weight: bold; color: #D4AF37; text-transform: uppercase; }
              .meta { text-align: right; font-size: 14px; color: #666; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 40px; }
              .address-box { font-size: 14px; }
              .address-box strong { font-size: 11px; text-decoration: underline; color: #999; display: block; margin-bottom: 5px; }
              .invoice-details { text-align: right; }
              h1 { font-size: 28px; margin: 0 0 20px 0; font-weight: normal; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
              th { text-align: left; border-bottom: 2px solid #eee; padding: 10px; font-weight: bold; }
              td { border-bottom: 1px solid #eee; padding: 10px; }
              .totals { width: 300px; margin-left: auto; }
              .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
              .totals-row.final { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 10px; }
              .footer { margin-top: 80px; border-top: 1px solid #eee; padding-top: 20px; font-size: 11px; color: #888; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="logo">${siteConfig.siteTitle}</div>
              <div class="meta">
                  ${siteConfig.contactAddress}<br>
                  ${siteConfig.contactEmail}<br>
                  ${siteConfig.contactPhone}
              </div>
          </div>
          <div class="info-grid">
              <div class="address-box">
                  <strong>Rechnungsanschrift (Fatura Adresi)</strong>
                  ${selectedOrder.customer.fullName}<br>
                  ${selectedOrder.customer.address}<br>
                  ${selectedOrder.customer.zipCode} ${selectedOrder.customer.city}<br>
                  ${selectedOrder.customer.phone}
              </div>
              <div class="invoice-details">
                  <h1>RECHNUNG</h1>
                  <p><strong>Rechnungs-Nr.:</strong> #${selectedOrder.id}</p>
                  <p><strong>Datum:</strong> ${new Date(selectedOrder.date).toLocaleDateString('de-DE')}</p>
              </div>
          </div>
          <table>
              <thead>
                  <tr>
                      <th>Pos.</th>
                      <th>Beschreibung (Açıklama)</th>
                      <th>Menge (Miktar)</th>
                      <th style="text-align:right">Einzelpreis</th>
                      <th style="text-align:right">Gesamtpreis</th>
                  </tr>
              </thead>
              <tbody>
                  ${selectedOrder.items.map((item, index) => `
                      <tr>
                          <td>${index + 1}</td>
                          <td>${item.name}</td>
                          <td>${item.quantity}</td>
                          <td style="text-align:right">${item.price}</td>
                          <td style="text-align:right">€${(getPrice(item.price) * item.quantity).toFixed(2)}</td>
                      </tr>
                  `).join('')}
              </tbody>
          </table>
          <div class="totals">
              <div class="totals-row">
                  <span>Netto (Net):</span>
                  <span>€${netTotal.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                  <span>MwSt. 19% (KDV):</span>
                  <span>€${taxAmount.toFixed(2)}</span>
              </div>
              <div class="totals-row final">
                  <span>Gesamtbetrag (Toplam):</span>
                  <span>€${grossTotal.toFixed(2)}</span>
              </div>
          </div>
          <div class="footer">
              <div>
                  <strong>Bankverbindung</strong><br>
                  ${siteConfig.paymentConfig?.bankName}<br>
                  IBAN: ${siteConfig.paymentConfig?.iban}<br>
                  BIC: ${siteConfig.paymentConfig?.swift}<br>
                  Acc: ${siteConfig.paymentConfig?.accountHolder}
              </div>
              <div>
                  <strong>Rechtliches</strong><br>
                  Steuernummer: ${siteConfig.invoiceConfig?.taxId || '123/456/789'}<br>
                  USt-IdNr.: ${siteConfig.invoiceConfig?.vatId || 'DE 123 456 789'}<br>
                  Gerichtsstand: ${siteConfig.invoiceConfig?.jurisdiction || 'Berlin'}
              </div>
              <div>
                  <strong>Kontakt</strong><br>
                  ${siteConfig.contactEmail}<br>
                  www.shenayileri.com
              </div>
          </div>
          <script>window.print();</script>
      </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
        win.document.write(invoiceHTML);
        win.document.close();
    }
  };
  const handleFactoryReset = () => {
      if (confirm("DİKKAT! Tüm ayarlar silinecek ve fabrika ayarlarına dönülecektir. Onaylıyor musun?")) {
          localStorage.removeItem('shenay_site_config_v9');
          window.location.reload();
      }
  };

  if (!isAuthenticated) {
    return <AdminLogin t={t} onLogin={onLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <aside className={`bg-brand-dark text-white w-full lg:w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:static top-0 z-50 h-full overflow-y-auto`}>
         <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="font-serif text-xl tracking-wide text-brand-gold">Shenay Panel</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400"><X /></button>
         </div>
         <nav className="p-4 space-y-2">
            {[
                { id: 'Genel Bakış', icon: LayoutDashboard, label: 'Genel Bakış' },
                { id: 'Siparişler', icon: ShoppingBag, label: 'Siparişler', badge: siteConfig.orders?.filter(o => o.status === 'pending').length },
                { id: 'Randevular', icon: Calendar, label: 'Randevular', badge: siteConfig.appointments?.filter(a => a.status === 'pending').length },
                { id: 'Hizmetler', icon: Users, label: 'Hizmet Yönetimi' },
                { id: 'Ürünler', icon: Package, label: 'Ürün Yönetimi' },
                { id: 'Blog', icon: FileText, label: 'Blog Yönetimi' },
                { id: 'Ayarlar', icon: Settings, label: 'Ayarlar & Medya' },
            ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === item.id ? 'bg-brand-gold text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                   <item.icon size={18} />
                   <span className="flex-1 text-left">{item.label}</span>
                   {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
                </button>
            ))}
            <div className="pt-8 mt-8 border-t border-gray-800 space-y-2">
               <button 
                  onClick={handlePublishChanges} 
                  disabled={isSaving}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm transition font-bold shadow-lg"
               >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CloudUpload size={18} />} 
                  {isSaving ? 'Yayınlanıyor...' : 'Değişiklikleri Yayınla'}
               </button>
               
               {/* Success Message Below Button */}
               {saveSuccess && (
                  <div className="text-center text-xs font-bold text-green-400 mt-2 animate-pulse bg-green-900/20 py-1 rounded">
                      Değişiklikler buluta kaydedildi ✅
                  </div>
               )}

               <button onClick={handleFactoryReset} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg text-sm transition">
                  <RefreshCw size={18} /> Önbelleği Temizle
               </button>
               <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm transition">
                  <LogOut size={18} /> Çıkış Yap
               </button>
            </div>
         </nav>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto h-screen">
         <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
             <h2 className="font-serif font-bold text-lg">{activeTab}</h2>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg"><Menu /></button>
         </div>
         {activeTab === 'Genel Bakış' && (
           <div className="space-y-8 animate-fade-in">
              <div className="bg-gradient-to-br from-brand-gold to-yellow-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                   <h3 className="font-serif text-3xl mb-2">Hoşgeldin, Shenay</h3>
                   <p className="opacity-90 text-sm mb-8 max-w-lg">Sitenin genel durumu harika görünüyor. Yeni siparişler ve randevular seni bekliyor.</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button onClick={() => setActiveTab('Siparişler')} className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-center hover:bg-white/30 transition transform hover:-translate-y-1">
                         <div className="text-3xl font-bold">{siteConfig.orders?.length || 0}</div>
                         <div className="text-xs opacity-80 uppercase tracking-wider font-bold">Toplam Sipariş</div>
                         <ArrowRight size={12} className="mx-auto mt-2 opacity-50" />
                      </button>
                      <button onClick={() => setActiveTab('Randevular')} className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-center hover:bg-white/30 transition transform hover:-translate-y-1">
                         <div className="text-3xl font-bold">{siteConfig.appointments?.filter(a => a.status === 'pending').length || 0}</div>
                         <div className="text-xs opacity-80 uppercase tracking-wider font-bold">Bekleyen Randevu</div>
                         <ArrowRight size={12} className="mx-auto mt-2 opacity-50" />
                      </button>
                      <button onClick={() => setActiveTab('Ürünler')} className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-center hover:bg-white/30 transition transform hover:-translate-y-1">
                         <div className="text-3xl font-bold">{siteConfig.products?.length || 0}</div>
                         <div className="text-xs opacity-80 uppercase tracking-wider font-bold">Aktif Ürün</div>
                         <ArrowRight size={12} className="mx-auto mt-2 opacity-50" />
                      </button>
                      <button onClick={() => setActiveTab('Blog')} className="bg-white/20 backdrop-blur-md p-4 rounded-xl text-center hover:bg-white/30 transition transform hover:-translate-y-1">
                         <div className="text-3xl font-bold">{siteConfig.blogPosts?.length || 0}</div>
                         <div className="text-xs opacity-80 uppercase tracking-wider font-bold">Blog Yazısı</div>
                         <ArrowRight size={12} className="mx-auto mt-2 opacity-50" />
                      </button>
                   </div>
                 </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                     <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2"><LayoutDashboard size={18} /> Hızlı İşlemler</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveTab('Siparişler')} className="p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition text-left">
                            <ShoppingBag className="mb-3" />
                            <span className="font-bold text-sm block">Siparişleri Yönet</span>
                        </button>
                        <button onClick={() => setActiveTab('Hizmetler')} className="p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition text-left">
                            <Plus className="mb-3" />
                            <span className="font-bold text-sm block">Hizmet Ekle</span>
                        </button>
                        <button onClick={() => setActiveTab('Blog')} className="p-4 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 transition text-left">
                            <FileText className="mb-3" />
                            <span className="font-bold text-sm block">Blog Yazısı Ekle</span>
                        </button>
                        <button onClick={() => setActiveTab('Randevular')} className="p-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition text-left">
                            <Calendar className="mb-3" />
                            <span className="font-bold text-sm block">Randevu Takvimi</span>
                        </button>
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={18} /> Yaklaşan Randevular</h4>
                        <button onClick={() => setActiveTab('Randevular')} className="text-xs font-bold text-brand-gold hover:underline">Tümünü Gör</button>
                    </div>
                    <div className="space-y-4">
                       {siteConfig.appointments?.slice(0, 4).map(apt => (
                          <div key={apt.id} className="flex justify-between items-center text-sm p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                             <div className="flex items-center gap-3">
                                <div className="bg-white p-2 rounded-lg border border-gray-200 text-center min-w-[50px]">
                                    <span className="block text-xs font-bold text-gray-400 uppercase">{new Date(apt.date).toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                                    <span className="block font-bold text-brand-dark">{new Date(apt.date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{apt.name}</div>
                                    <div className="text-xs text-gray-500">{apt.service} • {apt.time}</div>
                                </div>
                             </div>
                             <span className={`font-bold text-xs px-2 py-1 rounded ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {apt.status === 'confirmed' ? 'Onaylı' : 'Bekliyor'}
                             </span>
                          </div>
                       ))}
                       {(!siteConfig.appointments || siteConfig.appointments.length === 0) && (
                           <div className="text-center py-8 text-gray-400">
                               <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                               <p className="text-sm">Henüz kayıtlı randevu yok.</p>
                           </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
         )}
         
         {activeTab === 'Siparişler' && (
             <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-800">Sipariş Listesi</h3>
                        <span className="text-sm text-gray-500">Toplam {siteConfig.orders?.length} sipariş</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Müşteri</th>
                                    <th className="p-4">Tutar</th>
                                    <th className="p-4">Durum</th>
                                    <th className="p-4">Tarih</th>
                                    <th className="p-4">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {siteConfig.orders?.map(order => (
                                    <tr 
                                        key={order.id} 
                                        onClick={() => setSelectedOrder(order)}
                                        className={`hover:bg-blue-50 cursor-pointer transition ${selectedOrder?.id === order.id ? 'bg-blue-50' : ''}`}
                                    >
                                        <td className="p-4 font-mono text-gray-500">#{order.id}</td>
                                        <td className="p-4 font-bold">{order.customer.fullName}</td>
                                        <td className="p-4 text-brand-gold font-bold">{order.totalAmount}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">{order.date}</td>
                                        <td className="p-4">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleOrderDelete(order.id); }}
                                                className="text-gray-400 hover:text-red-500 transition p-2"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    {selectedOrder ? (
                        <div className="animate-fade-in">
                             <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="font-serif text-2xl font-bold mb-1">Sipariş #{selectedOrder.id}</h3>
                                    <p className="text-xs text-gray-500">{selectedOrder.date}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-brand-gold">{selectedOrder.totalAmount}</div>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">Müşteri Bilgileri</h4>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                                        <div className="flex items-center gap-2 font-bold text-gray-800"><User size={14} /> {selectedOrder.customer.fullName}</div>
                                        <div className="flex items-center gap-2 text-gray-600"><Phone size={12} /> {selectedOrder.customer.phone}</div>
                                        <div className="flex items-center gap-2 text-gray-600"><Mail size={14} /> {selectedOrder.customer.email}</div>
                                        <div className="flex items-start gap-2 text-gray-600 mt-2">
                                            <MapPin size={14} className="flex-shrink-0 mt-0.5" /> 
                                            <span>{selectedOrder.customer.address}, {selectedOrder.customer.zipCode} {selectedOrder.customer.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">Ürünler</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs font-bold">{item.quantity}x</span>
                                                    <span>{item.name}</span>
                                                </div>
                                                <span className="font-mono">{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase text-gray-400 mb-3 tracking-wider">Durum Güncelle</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['pending', 'shipped', 'completed', 'cancelled', 'return_requested', 'returned', 'refunded'] as const).map(status => (
                                            <button 
                                                key={status}
                                                onClick={() => handleOrderStatus(selectedOrder.id, status)}
                                                className={`py-2 px-4 rounded-lg text-xs font-bold uppercase transition border ${selectedOrder.status === status ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {ORDER_STATUS_LABELS[status]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                   <button 
                                      onClick={handlePrintInvoice}
                                      className="w-full bg-brand-gold hover:bg-black hover:text-white transition text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm"
                                   >
                                      <Printer size={18} /> Fatura Yazdır (Rechnung)
                                   </button>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Detayları görmek için bir sipariş seçin.</p>
                        </div>
                    )}
                </div>
             </div>
         )}
         
         {activeTab === 'Hizmetler' && (
           <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-gray-800">Hizmet Yönetimi</h3>
                 <button onClick={handleServiceAdd} className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-gold hover:text-black transition"><Plus size={16} /> Yeni Hizmet</button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {siteConfig.services.map((service) => (
                   <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                       <button onClick={() => handleServiceDelete(service.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 z-10 bg-white p-2 rounded-full shadow-sm"><Trash2 size={16} /></button>
                       <div className="flex gap-4 mb-4">
                           <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative group-hover:shadow-md transition">
                               <img src={service.image} className="w-full h-full object-cover" />
                               <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition text-xs font-bold">
                                   Değiştir
                                   <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                       if(e.target.files?.[0]) {
                                           const b64 = await resizeImage(e.target.files[0], 600, 0.8);
                                           handleServiceUpdate(service.id, 'image', b64);
                                       }
                                   }} />
                               </label>
                           </div>
                           <div className="flex-1 space-y-2">
                               <input 
                                   value={service.title} 
                                   onChange={(e) => handleServiceUpdate(service.id, 'title', e.target.value)}
                                   className="w-full font-serif font-bold text-lg border-b border-transparent focus:border-brand-gold outline-none bg-transparent"
                                   placeholder="Hizmet Adı"
                               />
                               <textarea 
                                   value={service.description} 
                                   onChange={(e) => handleServiceUpdate(service.id, 'description', e.target.value)}
                                   className="w-full text-sm text-gray-500 border rounded p-2 focus:border-brand-gold outline-none resize-none h-20"
                                   placeholder="Kısa açıklama..."
                               />
                           </div>
                       </div>
                       <div className="border-t border-gray-100 pt-4">
                           <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Detaylı Açıklama</label>
                           <textarea 
                               value={service.longDescription || ''} 
                               onChange={(e) => handleServiceUpdate(service.id, 'longDescription', e.target.value)}
                               className="w-full text-sm text-gray-600 border rounded p-2 focus:border-brand-gold outline-none resize-none h-24 bg-gray-50"
                               placeholder="Hizmet detayları sayfası için uzun açıklama..."
                           />
                       </div>
                   </div>
                ))}
              </div>
           </div>
         )}
         
         {activeTab === 'Ürünler' && (
           <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-gray-800">Ürün Yönetimi</h3>
                 <button onClick={handleProductAdd} className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-gold hover:text-black transition"><Plus size={16} /> Yeni Ürün</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {siteConfig.products.map(product => (
                     <div 
                        key={product.id} 
                        className={`bg-white p-4 rounded-xl shadow-sm border ${dragOverId === product.id ? 'border-brand-gold ring-2 ring-brand-gold/20' : 'border-gray-100'} transition relative`}
                        onDragOver={(e) => handleDragOver(e, product.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, product.id)}
                     >
                        <button onClick={() => handleProductDelete(product.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 z-10 bg-white p-1 rounded-full"><Trash2 size={14} /></button>
                        <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3 group">
                             <img src={product.image} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                 <p className="text-white text-xs font-bold mb-2">Resmi Değiştir</p>
                                 <label className="bg-white text-black px-3 py-1 rounded text-xs cursor-pointer hover:bg-brand-gold">
                                     Seç
                                     <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                        if(e.target.files?.[0]) {
                                            const b64 = await resizeImage(e.target.files[0], 600, 0.8);
                                            handleProductUpdate(product.id, 'image', b64);
                                        }
                                     }} />
                                 </label>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <input 
                                value={product.name}
                                onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                                className="w-full font-bold text-sm border-b border-transparent focus:border-brand-gold outline-none"
                                placeholder="Ürün Adı"
                            />
                            <div className="flex gap-2">
                                <input 
                                    value={product.price}
                                    onChange={(e) => handleProductUpdate(product.id, 'price', e.target.value)}
                                    className="w-1/2 text-brand-gold font-bold text-sm border-b border-transparent focus:border-brand-gold outline-none"
                                    placeholder="Fiyat (örn: €25.00)"
                                />
                            </div>
                            <textarea 
                                value={product.description}
                                onChange={(e) => handleProductUpdate(product.id, 'description', e.target.value)}
                                className="w-full text-xs text-gray-500 border rounded p-2 h-16 resize-none focus:border-brand-gold outline-none"
                                placeholder="Ürün açıklaması..."
                            />
                        </div>
                     </div>
                 ))}
              </div>
           </div>
         )}
         
         {activeTab === 'Blog' && (
           <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-gray-800">Blog Yazıları</h3>
                 <button onClick={handleBlogAdd} className="bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-gold hover:text-black transition"><Plus size={16} /> Yeni Yazı</button>
             </div>
             <div className="space-y-8">
                 {siteConfig.blogPosts.map(post => (
                     <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                         <button onClick={() => handleBlogDelete(post.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={18} /></button>
                         <div className="grid md:grid-cols-3 gap-6">
                             <div className="md:col-span-1">
                                 <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative group">
                                     <img src={post.image} className="w-full h-full object-cover" />
                                     <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                         <Upload size={24} className="mb-2" />
                                         <span className="text-xs font-bold">Kapak Fotoğrafı</span>
                                         <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                             if(e.target.files?.[0]) {
                                                 const b64 = await resizeImage(e.target.files[0], 800, 0.8);
                                                 handleBlogUpdate(post.id, 'image', b64);
                                             }
                                         }} />
                                     </label>
                                 </div>
                                 <input 
                                     type="date" 
                                     value={post.date}
                                     onChange={(e) => handleBlogUpdate(post.id, 'date', e.target.value)}
                                     className="mt-2 w-full text-xs text-gray-400 border rounded p-2"
                                 />
                             </div>
                             <div className="md:col-span-2 space-y-4">
                                 <input 
                                     value={post.title}
                                     onChange={(e) => handleBlogUpdate(post.id, 'title', e.target.value)}
                                     className="w-full text-2xl font-serif font-bold border-b border-transparent focus:border-brand-gold outline-none p-1"
                                     placeholder="Blog Başlığı"
                                 />
                                 <textarea 
                                     value={post.excerpt}
                                     onChange={(e) => handleBlogUpdate(post.id, 'excerpt', e.target.value)}
                                     className="w-full text-sm text-gray-600 border rounded p-3 h-20 resize-none focus:border-brand-gold outline-none"
                                     placeholder="Kısa Özet (Ana sayfada görünür)"
                                 />
                                 <textarea 
                                     value={post.content || ''}
                                     onChange={(e) => handleBlogUpdate(post.id, 'content', e.target.value)}
                                     className="w-full text-sm text-gray-600 border rounded p-3 h-40 resize-none focus:border-brand-gold outline-none bg-gray-50 font-mono"
                                     placeholder="Detaylı İçerik (Markdown veya Düz Metin)"
                                 />
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
           </div>
         )}
         
         {activeTab === 'Ayarlar' && (
             <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
               <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Type size={18} /> Metin İçerikleri (Manuel)</h3>
                       <div className="space-y-4">
                           <input value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 mt-1" />
                           <textarea value={manualSubtitle} onChange={(e) => setManualSubtitle(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 mt-1 h-24 resize-none" />
                           <textarea value={manualAboutText} onChange={(e) => setManualAboutText(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 mt-1 h-32 resize-none" />
                           <button onClick={() => { handleManualUpdate(); handleAboutTextUpdate(); }} className="w-full bg-brand-dark text-white py-3 rounded-lg font-bold hover:bg-brand-gold hover:text-black transition">Metinleri Güncelle</button>
                       </div>
                   </div>
                   
                   {/* Contact & Footer Settings */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings size={18} /> İletişim & Alt Bilgi</h3>
                       <div className="space-y-3">
                           <div>
                               <label className="text-xs font-bold text-gray-400 flex justify-between">Site Başlığı <span className="text-[9px] text-brand-gold bg-black/5 px-1 rounded">Firestore</span></label>
                               <input value={manualSiteTitle} onChange={(e) => setManualSiteTitle(e.target.value)} className="w-full p-2 bg-gray-50 rounded border border-gray-200" />
                           </div>
                           <div><label className="text-xs font-bold text-gray-400">Telefon</label><input value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} className="w-full p-2 bg-gray-50 rounded border border-gray-200" /></div>
                           <div><label className="text-xs font-bold text-gray-400">Email</label><input value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} className="w-full p-2 bg-gray-50 rounded border border-gray-200" /></div>
                           <div><label className="text-xs font-bold text-gray-400">Adres</label><input value={manualAddress} onChange={(e) => setManualAddress(e.target.value)} className="w-full p-2 bg-gray-50 rounded border border-gray-200" /></div>
                           <div><label className="text-xs font-bold text-gray-400">Footer Bio</label><textarea value={manualFooterBio} onChange={(e) => setManualFooterBio(e.target.value)} className="w-full p-2 bg-gray-50 rounded border border-gray-200 h-20" /></div>
                       </div>
                   </div>
               </div>
               
               <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ImageIcon size={18} /> Medya Yönetimi</h3>
                       {/* Media content */}
                       <div className="space-y-3 mb-6">
                           <label className="text-xs text-gray-400 font-bold uppercase block">Ana Sayfa Arka Plan Görseli</label>
                           <div className="flex items-center gap-4">
                               {manualImage && <img src={manualImage} className="w-16 h-16 object-cover rounded-lg border" />}
                               <div className="flex-1">
                                   <label className="block w-full text-center bg-gray-100 py-2 rounded cursor-pointer hover:bg-gray-200 text-xs font-bold mb-2">Görsel Seç<input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleMediaUpdate('image', e.target.files[0])} /></label>
                                   <div className="flex gap-2"><input placeholder="veya URL" value={manualImage} onChange={(e) => setManualImage(e.target.value)} className="w-full text-xs bg-gray-50 p-2 rounded border border-gray-200" /><button onClick={() => handleMediaUpdate('image', manualImage)} className="text-xs bg-gray-200 px-3 py-1 rounded">Kaydet</button></div>
                               </div>
                           </div>
                       </div>
                       <div className="space-y-3 mb-6">
                           <label className="text-xs text-gray-400 font-bold uppercase block">Hakkında Bölümü Görseli</label>
                           <div className="flex items-center gap-4">
                               {manualAboutImage && <img src={manualAboutImage} className="w-16 h-16 object-cover rounded-lg border" />}
                               <div className="flex-1">
                                   <label className="block w-full text-center bg-gray-100 py-2 rounded cursor-pointer hover:bg-gray-200 text-xs font-bold mb-2">Görsel Seç<input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleMediaUpdate('about', e.target.files[0])} /></label>
                                   <div className="flex gap-2"><input placeholder="veya URL" value={manualAboutImage} onChange={(e) => setManualAboutImage(e.target.value)} className="w-full text-xs bg-gray-50 p-2 rounded border border-gray-200" /><button onClick={() => handleMediaUpdate('about', manualAboutImage)} className="text-xs bg-gray-200 px-3 py-1 rounded">Kaydet</button></div>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Payment & Invoice Settings */}
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Printer size={18} /> Ödeme & Fatura Ayarları</h3>
                       <div className="space-y-4">
                           {/* ... Payment inputs kept same ... */}
                           <div className="bg-gray-50 p-3 rounded-lg">
                               <h5 className="font-bold text-xs text-brand-dark mb-2 uppercase">Banka Bilgileri</h5>
                               <div className="grid grid-cols-2 gap-2">
                                   <input placeholder="Banka Adı" value={manualBank} onChange={(e) => setManualBank(e.target.value)} className="p-2 text-xs border rounded" />
                                   <input placeholder="Hesap Sahibi" value={manualAccount} onChange={(e) => setManualAccount(e.target.value)} className="p-2 text-xs border rounded" />
                                   <input placeholder="IBAN" value={manualIban} onChange={(e) => setManualIban(e.target.value)} className="col-span-2 p-2 text-xs border rounded" />
                                   <input placeholder="SWIFT/BIC" value={manualSwift} onChange={(e) => setManualSwift(e.target.value)} className="col-span-2 p-2 text-xs border rounded" />
                               </div>
                           </div>
                           <div className="bg-gray-50 p-3 rounded-lg">
                               <h5 className="font-bold text-xs text-brand-dark mb-2 uppercase">Fatura Yasal Bilgileri</h5>
                               <div className="space-y-2">
                                   <input placeholder="Vergi No (Tax ID)" value={manualTaxId} onChange={(e) => setManualTaxId(e.target.value)} className="w-full p-2 text-xs border rounded" />
                                   <input placeholder="KDV No (VAT ID)" value={manualVatId} onChange={(e) => setManualVatId(e.target.value)} className="w-full p-2 text-xs border rounded" />
                                   <input placeholder="Mahkeme Yeri (Jurisdiction)" value={manualJurisdiction} onChange={(e) => setManualJurisdiction(e.target.value)} className="w-full p-2 text-xs border rounded" />
                               </div>
                           </div>
                           <button onClick={handleFooterUpdate} className="w-full bg-brand-gold text-black py-2 rounded-lg font-bold text-sm hover:bg-black hover:text-white transition">Tüm Ayarları Kaydet</button>
                       </div>
                   </div>
               </div>
             </div>
         )}
      </main>
    </div>
  );
};