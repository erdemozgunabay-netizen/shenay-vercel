import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Video, Type, 
  Users, ShoppingBag, Package, Settings, RefreshCw, 
  Trash2, LogOut, CheckCircle, X, Plus, Printer, 
  Phone, Mail, MapPin, Menu, Calendar, User, Clock,
  ArrowRight, ExternalLink, CloudUpload, Loader2, Upload, Wifi, WifiOff, Lock, Globe, FileSpreadsheet, Edit2, Save, Info,
  Quote, Megaphone, Flag, CalendarCheck
} from 'lucide-react';
import { TranslationStructure, SiteConfig, Service, Product, BlogPost, Order, FirestoreSettings, LanguageCode, Invoice, GalleryItem, TeamMember, Testimonial, AdBanner, Appointment } from '../types';
import { AdminLogin } from './AdminLogin';
import { storageService, saveSettingsToFirestore } from '../services/storageService';
import { auth } from '../firebase'; 

interface AdminDashboardProps {
  t: TranslationStructure['admin'];
  siteConfig: SiteConfig;
  setSiteConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

// Helper Components
const getOrderStatusLabels = (t: TranslationStructure['admin']) => ({
  pending: t.orderStatus.pending,
  shipped: t.orderStatus.shipped,
  completed: t.orderStatus.completed,
  cancelled: t.orderStatus.cancelled,
  return_requested: t.orderStatus.return_requested,
  returned: t.orderStatus.returned,
  refunded: t.orderStatus.refunded
});

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
  const [activeTab, setActiveTab] = useState('settings'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const ORDER_STATUS_LABELS = getOrderStatusLabels(t);
  
  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'service' | 'product' | 'blog' | 'gallery' | 'testimonial' | 'team' | 'banner' | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [localSettings, setLocalSettings] = useState<FirestoreSettings>({});
  const [paymentConfig, setPaymentConfig] = useState(siteConfig.paymentConfig);
  const [invoiceConfig, setInvoiceConfig] = useState(siteConfig.invoiceConfig || { taxId: '', vatId: '', jurisdiction: '', companyName: 'Shenay Ileri Beauty', companyAddress: 'Example Str. 1, 10115 Berlin' });

  // Modal Component
  const Modal = ({ title, onClose, onSave, children, isSaving }: any) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-lg font-serif">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-black" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-200 rounded-lg">{t.cancel}</button>
          <button onClick={onSave} disabled={isSaving} className="px-6 py-2 bg-brand-dark text-white font-bold text-sm rounded-lg hover:bg-brand-gold hover:text-black transition flex items-center gap-2">
            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} {t.saveAndPublish}
          </button>
        </div>
      </div>
    </div>
  );

  // Invoice State
  const [newInvoice, setNewInvoice] = useState<Invoice>({
      id: `RE-${new Date().getFullYear()}-${Math.floor(Math.random()*1000)}`, 
      date: new Date().toISOString().split('T')[0],
      customerName: '', customerAddress: '',
      items: [{ desc: t.service, price: 150, vat: 19 }],
      totalNet: 0, totalVat: 0, totalGross: 0,
      taxId: '', vatId: ''
  });

  useEffect(() => {
      if (siteConfig.rawSettings) setLocalSettings(siteConfig.rawSettings);
      if (siteConfig.paymentConfig) setPaymentConfig(siteConfig.paymentConfig);
      if (siteConfig.invoiceConfig) setInvoiceConfig(siteConfig.invoiceConfig);
  }, [siteConfig]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1200; // Increased resolution for hero images
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
                canvas.height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
        };
    });
  };

  const handleImageUpload = async (file: File) => {
      const b64 = await resizeImage(file);
      setEditingItem({ ...editingItem, image: b64 });
  };
  
  const handleProfileImageUpload = async (file: File) => {
      const b64 = await resizeImage(file);
      setLocalSettings({...localSettings, aboutImage: b64});
  };

  const handleHeroImageUpload = async (file: File) => {
      const b64 = await resizeImage(file);
      setLocalSettings({...localSettings, heroImage: b64});
  };

  const handleGalleryMediaUpload = async (file: File, type: 'image' | 'video') => {
    if (type === 'image') {
      const b64 = await resizeImage(file);
      const newGallery = [...(editingItem.gallery || []), { url: b64, type: 'image' }];
      setEditingItem({ ...editingItem, gallery: newGallery });
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const b64 = e.target?.result as string;
        const newGallery = [...(editingItem.gallery || []), { url: b64, type: 'video' }];
        setEditingItem({ ...editingItem, gallery: newGallery });
      };
    }
  };

  const removeGalleryItem = (index: number) => {
    const newGallery = [...(editingItem.gallery || [])];
    newGallery.splice(index, 1);
    setEditingItem({ ...editingItem, gallery: newGallery });
  };

  const openEditModal = (type: 'service' | 'product' | 'blog' | 'gallery' | 'testimonial' | 'team' | 'banner', item?: any) => {
      setEditType(type);
      if (item) {
          setEditingItem(item);
      } else {
          // Defaults for new items
          const defaults = {
             service: { id: Date.now(), title: '', description: '', image: 'https://via.placeholder.com/400', price: `${t.currencySymbol}100`, gallery: [] },
             product: { id: Date.now(), name: '', price: `${t.currencySymbol}0.00`, description: '', image: 'https://via.placeholder.com/400', rating: 5, orderCount: 0, voteCount: 0, stock: 10 },
             blog: { id: Date.now(), title: '', excerpt: '', date: new Date().toISOString().split('T')[0], image: 'https://via.placeholder.com/600x400' },
             gallery: { id: Date.now(), image: 'https://via.placeholder.com/600x600', caption: '', category: 'General' },
             testimonial: { id: Date.now(), name: '', quote: '', rating: 5, image: 'https://via.placeholder.com/100' },
             team: { id: Date.now(), name: '', role: '', bio: '', image: 'https://via.placeholder.com/300x400', instagram: '' },
             banner: { id: Date.now(), imageUrl: 'https://via.placeholder.com/1200x600', title: 'New Campaign' }
          };
          setEditingItem(defaults[type]);
      }
  };

  const saveItem = async () => {
      if (!editingItem || !editType) return;
      setIsSaving(true);
      try {
          if (editType === 'service') await storageService.addService(editingItem);
          if (editType === 'product') await storageService.addProduct(editingItem);
          if (editType === 'blog') await storageService.addBlogPost(editingItem);
          if (editType === 'gallery') await storageService.addGalleryItem(editingItem);
          if (editType === 'testimonial') await storageService.addTestimonial(editingItem);
          if (editType === 'team') await storageService.addTeamMember(editingItem);
          if (editType === 'banner') await storageService.addBanner(editingItem);
          setEditingItem(null);
          setEditType(null);
      } catch (e) {
          alert(t.saveError + ": " + e);
      } finally {
          setIsSaving(false);
      }
  };

  const deleteItem = async (type: 'service' | 'product' | 'blog' | 'gallery' | 'testimonial' | 'team' | 'banner' | 'appointment', id: number) => {
      if (!confirm(t.deleteConfirm)) return;
      try {
          if (type === 'service') await storageService.deleteService(id);
          if (type === 'product') await storageService.deleteProduct(id);
          if (type === 'blog') await storageService.deleteBlogPost(id);
          if (type === 'gallery') await storageService.deleteGalleryItem(id);
          if (type === 'testimonial') await storageService.deleteTestimonial(id);
          if (type === 'team') await storageService.deleteTeamMember(id);
          if (type === 'banner') await storageService.deleteBanner(id);
          if (type === 'appointment') await storageService.deleteAppointment(id);
      } catch (e) {
          alert(t.deleteError + ": " + e);
      }
  };

  const handleGlobalPublish = async () => {
      setIsSaving(true);
      try {
          await saveSettingsToFirestore(localSettings);
          // In a real app, payment/invoice config should also be saved
          alert(t.saveSuccess);
      } catch (e) {
          alert(t.saveError + ": " + e);
      } finally {
          setIsSaving(false);
      }
  };
  
  const handlePrintInvoice = () => {
      const totalNet = newInvoice.items.reduce((sum, item) => sum + item.price, 0);
      const totalVat = newInvoice.items.reduce((sum, item) => sum + (item.price * (item.vat/100)), 0);
      const totalGross = totalNet + totalVat;
      
      const win = window.open('', '_blank');
      win?.document.write(`
        <html>
        <head><title>${t.invoiceHeader} ${newInvoice.id}</title><style>body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:40px;max-width:800px;margin:auto;color:#333;line-height:1.5;} .header{display:flex;justify-content:space-between;margin-bottom:60px;border-bottom:1px solid #ddd;padding-bottom:20px;} .company-details{font-size:0.9em;color:#555;} table{width:100%;border-collapse:collapse;margin:30px 0;} th,td{padding:12px;border-bottom:1px solid #eee;text-align:left;} th{background:#f9f9f9;font-weight:bold;} .right{text-align:right;} .totals{margin-top:30px;text-align:right;} .totals p{margin:5px 0;} .footer{margin-top:80px;font-size:11px;color:#777;border-top:1px solid #eee;padding-top:20px;text-align:center;}</style></head>
        <body>
            <div class="header">
                <div>
                    <h1 style="color:#D4AF37;margin:0;font-size:24px;">${siteConfig.siteTitle || 'SHENAY ILERI'}</h1>
                    <div class="company-details">
                        ${invoiceConfig.companyName}<br>
                        ${invoiceConfig.companyAddress}
                    </div>
                </div>
                <div style="text-align:right;">
                    <h2 style="margin:0;font-size:20px;">${t.invoiceHeader}</h2>
                    <p style="margin:5px 0;">${t.invoiceNoLabel}: <strong>${newInvoice.id}</strong></p>
                    <p style="margin:0;">${t.invoiceDate}: ${newInvoice.date}</p>
                </div>
            </div>
            
            <div style="margin-bottom:40px;">
                <strong>${t.invoiceRecipient}:</strong><br>
                ${newInvoice.customerName}<br>
                ${newInvoice.customerAddress.replace(/\n/g, '<br>')}
            </div>
            
            <table>
                <thead><tr><th>${t.invoiceDesc}</th><th class="right">${t.invoicePriceNet}</th><th class="right">${t.invoiceVat}</th><th class="right">${t.invoiceTotal}</th></tr></thead>
                <tbody>
                    ${newInvoice.items.map(item => `
                        <tr>
                            <td>${item.desc}</td>
                            <td class="right">${t.currencySymbol}${item.price.toFixed(2)}</td>
                            <td class="right">${item.vat}${t.vatSymbol}</td>
                            <td class="right">${t.currencySymbol}${(item.price * (1 + item.vat/100)).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="totals">
                <p>${t.invoiceSumNet}: ${t.currencySymbol}${totalNet.toFixed(2)}</p>
                <p>${t.invoicePlusVat}: ${t.currencySymbol}${totalVat.toFixed(2)}</p>
                <h3 style="border-top:2px solid #333;padding-top:10px;display:inline-block;margin-top:10px;">${t.invoiceTotalAmount}: ${t.currencySymbol}${totalGross.toFixed(2)}</h3>
            </div>
            
            <div class="footer">
                <p><strong>${t.invoiceBank}:</strong> ${paymentConfig.bankName} | IBAN: ${paymentConfig.iban} | BIC: ${paymentConfig.swift} | ${t.accountHolder}: ${paymentConfig.accountHolder}</p>
                <p><strong>${t.taxId}:</strong> ${invoiceConfig.taxId} | <strong>${t.vatId}:</strong> ${invoiceConfig.vatId}</p>
                <p>${t.jurisdiction}: ${invoiceConfig.jurisdiction}</p>
                <p>${t.invoiceThanks}</p>
            </div>
            <script>window.print();</script>
        </body></html>
      `);
      win?.document.close();
  };

  const handleUpdateAppointment = (appt: Appointment, newStatus: Appointment['status']) => {
      const updated = { ...appt, status: newStatus };
      storageService.updateAppointment(updated);
  };

  if (!isAuthenticated) return <AdminLogin t={t} onLogin={onLogin} />;

  const tabs = [
    { id: 'settings', label: t.tabs.settings, icon: Settings },
    { id: 'appointments', label: t.tabs.appointments, icon: CalendarCheck },
    { id: 'services', label: t.tabs.services, icon: Users },
    { id: 'products', label: t.tabs.products, icon: Package },
    { id: 'blog', label: t.tabs.blog, icon: FileText },
    { id: 'gallery', label: t.tabs.gallery, icon: ImageIcon },
    { id: 'testimonials', label: t.tabs.testimonials, icon: Quote },
    { id: 'team', label: t.tabs.team, icon: User },
    { id: 'banners', label: t.tabs.banners, icon: Megaphone },
    { id: 'invoices', label: t.tabs.invoices, icon: FileSpreadsheet },
    { id: 'orders', label: t.tabs.orders, icon: ShoppingBag },
  ];

  const editTypeLabels: Record<string, string> = {
    service: t.tabs.services,
    product: t.tabs.products,
    blog: t.tabs.blog,
    gallery: t.tabs.gallery,
    testimonial: t.tabs.testimonials,
    team: t.tabs.team,
    banner: t.tabs.banners
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans text-brand-dark">
      
      {/* Edit Modal */}
      {editingItem && (
        <Modal 
          title={`${t.modalTitle}: ${editType ? editTypeLabels[editType] : ''}`}
          onClose={() => setEditingItem(null)} 
          onSave={saveItem}
          isSaving={isSaving}
        >
          <div className="space-y-4">
              <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200 group">
                      <img src={editingItem.image || editingItem.imageUrl} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition">
                          <Upload size={20} />
                          <input type="file" className="hidden" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
                      </label>
                  </div>
              </div>

              {editType === 'service' && (
                  <>
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.service} value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={`${t.amount} (${t.other})`} value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                      <textarea className="w-full p-3 border rounded-lg h-32 bg-white text-gray-900 border-gray-300" placeholder={t.description} value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                      
                      <div className="pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">{t.mediaGallery}</h4>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                              {editingItem.gallery?.map((media: any, idx: number) => (
                                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
                                      {media.type === 'image' ? (
                                          <img src={media.url} className="w-full h-full object-cover" />
                                      ) : (
                                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                              <Video className="text-gray-400" />
                                          </div>
                                      )}
                                      <button 
                                          onClick={() => removeGalleryItem(idx)}
                                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                      >
                                          <X size={12} />
                                      </button>
                                  </div>
                              ))}
                          </div>
                          <div className="flex gap-2">
                              <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg cursor-pointer transition text-xs font-bold">
                                  <ImageIcon size={16} /> {t.addPhoto}
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleGalleryMediaUpload(e.target.files[0], 'image')} />
                              </label>
                              <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg cursor-pointer transition text-xs font-bold">
                                  <Video size={16} /> {t.addVideo}
                                  <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files && handleGalleryMediaUpload(e.target.files[0], 'video')} />
                              </label>
                          </div>
                      </div>
                  </>
              )}
              {editType === 'product' && (
                  <>
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.tabs.products} value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={`${t.amount} (${t.pricePlaceholder})`} value={editingItem.price} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                      <input type="number" className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.stock} value={editingItem.stock} onChange={e => setEditingItem({...editingItem, stock: parseInt(e.target.value)})} />
                      <textarea className="w-full p-3 border rounded-lg h-32 bg-white text-gray-900 border-gray-300" placeholder={t.description} value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  </>
              )}
              {editType === 'blog' && (
                  <>
                      <input type="date" className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" value={editingItem.date} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.titleLabel} value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                      <textarea className="w-full p-3 border rounded-lg h-32 bg-white text-gray-900 border-gray-300" placeholder={t.excerpt} value={editingItem.excerpt} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} />
                  </>
              )}
              {editType === 'gallery' && (
                  <>
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.category} value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                      <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={`${t.titleLabel} / ${t.description} (${t.other})`} value={editingItem.caption} onChange={e => setEditingItem({...editingItem, caption: e.target.value})} />
                  </>
              )}
              {editType === 'testimonial' && (
                  <>
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.customer} value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                       <input type="number" max="5" min="1" className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={`${t.rating} ${t.ratingPlaceholder}`} value={editingItem.rating} onChange={e => setEditingItem({...editingItem, rating: parseInt(e.target.value)})} />
                       <textarea className="w-full p-3 border rounded-lg h-24 bg-white text-gray-900 border-gray-300" placeholder={t.comment} value={editingItem.quote} onChange={e => setEditingItem({...editingItem, quote: e.target.value})} />
                  </>
              )}
              {editType === 'team' && (
                  <>
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.customer} value={editingItem.name} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.role} value={editingItem.role} onChange={e => setEditingItem({...editingItem, role: e.target.value})} />
                       <textarea className="w-full p-3 border rounded-lg h-24 bg-white text-gray-900 border-gray-300" placeholder={t.bio} value={editingItem.bio} onChange={e => setEditingItem({...editingItem, bio: e.target.value})} />
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.instagramLink} value={editingItem.instagram} onChange={e => setEditingItem({...editingItem, instagram: e.target.value})} />
                  </>
              )}
              {editType === 'banner' && (
                  <>
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={t.titleLabel} value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                       <input className="w-full p-3 border rounded-lg bg-white text-gray-900 border-gray-300" placeholder={`${t.link} (${t.other})`} value={editingItem.link} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  </>
              )}
          </div>
        </Modal>
      )}

      {/* Sidebar */}
      <aside className={`bg-brand-dark text-white w-full lg:w-64 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:static top-0 z-50 h-full overflow-y-auto shadow-2xl`}>
         <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
            <h2 className="font-serif text-xl tracking-wide text-brand-gold">{t.management}</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400"><X /></button>
         </div>
         <nav className="p-4 space-y-2">
            {tabs.map(item => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === item.id ? 'bg-brand-gold text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                   <item.icon size={18} />
                   <span>{item.label}</span>
                </button>
            ))}
            <div className="pt-8 mt-8 border-t border-gray-800 space-y-2">
               <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-900/20 rounded-lg text-sm transition">
                  <LogOut size={18} /> {t.logout}
               </button>
            </div>
         </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen">
         <div className="lg:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
             <h2 className="font-serif font-bold text-lg">{tabs.find(t => t.id === activeTab)?.label}</h2>
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-100 rounded-lg"><Menu /></button>
         </div>

         {/* Content Management Generic Logic */}
         {(['services', 'products', 'blog', 'team', 'testimonials', 'banners'].includes(activeTab)) && (
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-serif font-bold">{tabs.find(t => t.id === activeTab)?.label} {t.management}</h3>
                     <button 
                        onClick={() => openEditModal(
                            activeTab === 'services' ? 'service' : 
                            activeTab === 'products' ? 'product' : 
                            activeTab === 'blog' ? 'blog' : 
                            activeTab === 'team' ? 'team' :
                            activeTab === 'testimonials' ? 'testimonial' : 'banner'
                        )} 
                        className="bg-brand-gold text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black hover:text-white transition shadow-lg"
                     >
                         <Plus size={18} /> {t.newAdd}
                     </button>
                 </div>
                 
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {(
                        activeTab === 'services' ? siteConfig.services : 
                        activeTab === 'products' ? siteConfig.products : 
                        activeTab === 'blog' ? siteConfig.blogPosts :
                        activeTab === 'team' ? siteConfig.team :
                        activeTab === 'testimonials' ? siteConfig.testimonials :
                        siteConfig.ads // Banners
                     ).map((item: any) => (
                         <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                             <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                                 <img src={item.image || item.imageUrl} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                     <button onClick={() => openEditModal(
                                        activeTab === 'services' ? 'service' : 
                                        activeTab === 'products' ? 'product' : 
                                        activeTab === 'blog' ? 'blog' : 
                                        activeTab === 'team' ? 'team' :
                                        activeTab === 'testimonials' ? 'testimonial' : 'banner', 
                                        item)} className="bg-white text-black p-2 rounded-full hover:bg-brand-gold"><Edit2 size={16} /></button>
                                     <button onClick={() => deleteItem(
                                        activeTab === 'services' ? 'service' : 
                                        activeTab === 'products' ? 'product' : 
                                        activeTab === 'blog' ? 'blog' : 
                                        activeTab === 'team' ? 'team' :
                                        activeTab === 'testimonials' ? 'testimonial' : 'banner', 
                                        item.id)} className="bg-white text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                                 </div>
                             </div>
                             <h4 className="font-bold text-lg mb-1 line-clamp-1">{item.title || item.name}</h4>
                             <p className="text-sm text-gray-500 line-clamp-2">{item.description || item.excerpt || item.quote || item.role}</p>
                         </div>
                     ))}
                 </div>
             </div>
         )}

         {activeTab === 'appointments' && (
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                 <h3 className="font-serif font-bold text-xl mb-6">{t.appointmentRequests}</h3>
                 <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead>
                         <tr className="border-b text-gray-400 text-xs uppercase"><th className="pb-3">{t.customer}</th><th className="pb-3">{t.service}</th><th className="pb-3">{t.date}</th><th className="pb-3">{t.status}</th><th className="pb-3">{t.action}</th></tr>
                     </thead>
                     <tbody className="divide-y">
                         {siteConfig.appointments?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(appt => (
                             <tr key={appt.id} className="hover:bg-gray-50">
                                 <td className="py-4">
                                     <div className="font-bold">{appt.name}</div>
                                     <div className="text-gray-400 text-xs">{appt.phone}</div>
                                 </td>
                                 <td className="py-4">{appt.service}</td>
                                 <td className="py-4">
                                     <div>{appt.date}</div>
                                     <div className="text-xs text-gray-400">{appt.time}</div>
                                 </td>
                                 <td className="py-4">
                                     <span className={`px-2 py-1 rounded text-xs font-bold ${
                                         appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                         appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                         'bg-yellow-100 text-yellow-700'
                                     }`}>
                                         {appt.status === 'confirmed' ? t.confirmed : appt.status === 'cancelled' ? t.cancelled : t.waiting}
                                     </span>
                                 </td>
                                 <td className="py-4 flex gap-2">
                                     <button onClick={() => handleUpdateAppointment(appt, 'confirmed')} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"><CheckCircle size={16}/></button>
                                     <button onClick={() => handleUpdateAppointment(appt, 'cancelled')} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><X size={16}/></button>
                                     <button onClick={() => deleteItem('appointment', appt.id)} className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"><Trash2 size={16}/></button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
                 </div>
             </div>
         )}

         {activeTab === 'invoices' && (
             <div className="grid lg:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2"><FileSpreadsheet className="text-brand-gold" /> {t.invoiceTitle}</h3>
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                             <div><label className="text-xs font-bold text-gray-400 uppercase">{t.invoiceNo}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 rounded-lg border transition focus:border-brand-gold" value={newInvoice.id} onChange={e => setNewInvoice({...newInvoice, id: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-gray-400 uppercase">{t.date}</label><input type="date" className="w-full p-3 bg-white text-gray-900 border-gray-300 rounded-lg border transition focus:border-brand-gold" value={newInvoice.date} onChange={e => setNewInvoice({...newInvoice, date: e.target.value})} /></div>
                         </div>
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.customerName}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 rounded-lg border transition focus:border-brand-gold" value={newInvoice.customerName} onChange={e => setNewInvoice({...newInvoice, customerName: e.target.value})} /></div>
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.address}</label><textarea className="w-full p-3 bg-white text-gray-900 border-gray-300 rounded-lg border transition focus:border-brand-gold h-24 resize-none" value={newInvoice.customerAddress} onChange={e => setNewInvoice({...newInvoice, customerAddress: e.target.value})} /></div>
                         
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                             <h4 className="font-bold text-sm mb-3">{t.items}</h4>
                             {newInvoice.items.map((item, idx) => (
                                 <div key={idx} className="flex gap-2 mb-2">
                                     <input className="flex-1 p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" value={item.desc} onChange={e => { const items = [...newInvoice.items]; items[idx].desc = e.target.value; setNewInvoice({...newInvoice, items}); }} placeholder={t.description} />
                                     <input className="w-20 p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" type="number" value={item.price} onChange={e => { const items = [...newInvoice.items]; items[idx].price = parseFloat(e.target.value); setNewInvoice({...newInvoice, items}); }} placeholder={t.currencySymbol} />
                                     <input className="w-16 p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" type="number" value={item.vat} onChange={e => { const items = [...newInvoice.items]; items[idx].vat = parseFloat(e.target.value); setNewInvoice({...newInvoice, items}); }} placeholder={t.vatSymbol} />
                                 </div>
                             ))}
                             <button onClick={() => setNewInvoice({...newInvoice, items: [...newInvoice.items, {desc: '', price: 0, vat: 19}]})} className="text-xs font-bold text-brand-gold hover:text-black mt-2">{t.addItem}</button>
                         </div>
                         
                         <button onClick={handlePrintInvoice} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold shadow-lg hover:bg-brand-gold hover:text-black transition flex items-center justify-center gap-2"><Printer size={20} /> {t.printDownload}</button>
                     </div>
                 </div>
                 
                 <div className="space-y-8">
                     <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                         <h3 className="font-serif font-bold text-xl mb-6">{t.legalCompanyInfo}</h3>
                         <div className="space-y-4">
                             <div><label className="text-xs font-bold text-gray-400 uppercase">{t.companyName}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={invoiceConfig.companyName} onChange={e => setInvoiceConfig({...invoiceConfig, companyName: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-gray-400 uppercase">{t.companyAddress}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={invoiceConfig.companyAddress} onChange={e => setInvoiceConfig({...invoiceConfig, companyAddress: e.target.value})} /></div>
                             <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-gray-400 uppercase">{t.taxId}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={invoiceConfig.taxId} onChange={e => setInvoiceConfig({...invoiceConfig, taxId: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-gray-400 uppercase">{t.vatId}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={invoiceConfig.vatId} onChange={e => setInvoiceConfig({...invoiceConfig, vatId: e.target.value})} /></div>
                             </div>
                             <div><label className="text-xs font-bold text-gray-400 uppercase">{t.jurisdiction}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={invoiceConfig.jurisdiction} onChange={e => setInvoiceConfig({...invoiceConfig, jurisdiction: e.target.value})} /></div>
                             
                             <div className="pt-4 border-t">
                                <h4 className="font-bold text-sm mb-2 text-gray-400 uppercase">{t.bankInfo}</h4>
                                <div className="space-y-2">
                                    <input className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" placeholder={t.bankName} value={paymentConfig.bankName} onChange={e => setPaymentConfig({...paymentConfig, bankName: e.target.value})} />
                                    <input className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" placeholder={t.iban} value={paymentConfig.iban} onChange={e => setPaymentConfig({...paymentConfig, iban: e.target.value})} />
                                    <input className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" placeholder={t.swift} value={paymentConfig.swift} onChange={e => setPaymentConfig({...paymentConfig, swift: e.target.value})} />
                                    <input className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm" placeholder={t.accountHolder} value={paymentConfig.accountHolder} onChange={e => setPaymentConfig({...paymentConfig, accountHolder: e.target.value})} />
                                </div>
                             </div>
                             <button onClick={handleGlobalPublish} disabled={isSaving} className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition mt-2">
                                {isSaving ? t.saving : t.saveCompanyInfo}
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {activeTab === 'settings' && (
             <div className="max-w-4xl mx-auto space-y-6">
                 <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                     <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2"><Globe className="text-brand-gold" /> {t.generalSiteSettings}</h3>
                     <div className="space-y-4">
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.siteTitle}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={localSettings.siteTitle || ''} onChange={e => setLocalSettings({...localSettings, siteTitle: e.target.value})} /></div>
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.heroSlogan}</label><textarea className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg h-24" value={localSettings.heroTitle || ''} onChange={e => setLocalSettings({...localSettings, heroTitle: e.target.value})} /></div>
                     </div>

                     <h3 className="font-serif font-bold text-xl mb-6 mt-10 flex items-center gap-2"><ImageIcon className="text-brand-gold" /> {t.homeBackground}</h3>
                     <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                        <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden relative group border-2 border-dashed border-gray-300 flex items-center justify-center">
                            {(localSettings.heroImage || siteConfig.heroImage) ? (
                                <img src={localSettings.heroImage || siteConfig.heroImage} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-400" />
                            )}
                            <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition">
                                <Upload size={24} className="mb-1" />
                                <span className="text-[10px] font-bold uppercase tracking-wide">{t.change}</span>
                                <input type="file" className="hidden" onChange={(e) => e.target.files && handleHeroImageUpload(e.target.files[0])} />
                            </label>
                        </div>
                        <div className="text-sm text-gray-500">
                            <p className="font-bold text-gray-700 mb-1">{t.heroImage}</p>
                            <p>{t.heroDesc}</p>
                        </div>
                     </div>
                     
                     <h3 className="font-serif font-bold text-xl mb-6 mt-10 flex items-center gap-2"><Phone className="text-brand-gold" /> {t.contactInfo}</h3>
                     <div className="space-y-4">
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.phone}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={localSettings.contactPhone || ''} onChange={e => setLocalSettings({...localSettings, contactPhone: e.target.value})} /></div>
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.email}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={localSettings.contactEmail || ''} onChange={e => setLocalSettings({...localSettings, contactEmail: e.target.value})} /></div>
                         <div><label className="text-xs font-bold text-gray-400 uppercase">{t.address}</label><input className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg" value={localSettings.contactAddress || ''} onChange={e => setLocalSettings({...localSettings, contactAddress: e.target.value})} /></div>
                     </div>

                     <h3 className="font-serif font-bold text-xl mb-6 mt-10 flex items-center gap-2"><User className="text-brand-gold" /> {t.aboutMe}</h3>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                                <img src={localSettings.aboutImage || siteConfig.aboutImage} className="w-full h-full object-cover" />
                            </div>
                            <label className="bg-white border border-gray-300 px-4 py-2 rounded cursor-pointer hover:bg-gray-50 text-sm font-bold text-gray-700">
                                {t.changePhoto}
                                <input type="file" className="hidden" onChange={(e) => e.target.files && handleProfileImageUpload(e.target.files[0])} />
                            </label>
                        </div>
                        <textarea className="w-full p-3 bg-white text-gray-900 border-gray-300 border rounded-lg h-32" value={localSettings.aboutText || ''} onChange={e => setLocalSettings({...localSettings, aboutText: e.target.value})} />
                     </div>
                 </div>

                 <button onClick={handleGlobalPublish} disabled={isSaving} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                     {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} {t.saveAllSettings}
                 </button>
             </div>
         )}

         {activeTab === 'gallery' && (
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-serif font-bold">{t.galleryManagement}</h3>
                     <button onClick={() => openEditModal('gallery')} className="bg-brand-gold text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black hover:text-white transition shadow-lg">
                         <Plus size={18} /> {t.addNewPhoto}
                     </button>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {siteConfig.gallery?.map((item: GalleryItem) => (
                         <div key={item.id} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                             <img src={item.image} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2 text-center">
                                 <p className="text-white text-xs font-bold truncate w-full">{item.caption}</p>
                                 <button onClick={() => deleteItem('gallery', item.id)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition"><Trash2 size={16} /></button>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         )}

         {activeTab === 'orders' && (
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                 <h3 className="font-serif font-bold text-xl mb-6">{t.incomingOrders}</h3>
                 {siteConfig.orders?.length === 0 ? <p className="text-gray-500 italic">{t.noOrdersYet}</p> : (
                     <table className="w-full text-left text-sm">
                         <thead>
                             <tr className="border-b text-gray-400 text-xs uppercase"><th className="pb-3">{t.id}</th><th className="pb-3">{t.customer}</th><th className="pb-3">{t.amount}</th><th className="pb-3">{t.status}</th><th className="pb-3">{t.date}</th></tr>
                         </thead>
                         <tbody className="divide-y">
                             {siteConfig.orders?.map(order => (
                                 <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                                     <td className="py-4 font-mono">#{order.id}</td>
                                     <td className="py-4 font-bold">{order.customer.fullName}</td>
                                     <td className="py-4 text-brand-gold font-bold">{order.totalAmount}</td>
                                     <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>{ORDER_STATUS_LABELS[order.status]}</span></td>
                                     <td className="py-4 text-gray-400">{order.date}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 )}
             </div>
         )}

      </main>
    </div>
  );
};