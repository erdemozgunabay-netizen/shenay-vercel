import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, MOCK_ADS, HERO_IMAGE, ABOUT_IMAGE, DEFAULT_ABOUT_TEXT, INSTAGRAM_LINK, PHONE_NUMBER, SERVICES, PRODUCTS, BLOG_POSTS, RETURN_POLICIES, SERVICE_CATALOG, PRODUCT_CATALOG, BLOG_CATALOG } from './constants';
import { LanguageCode, SiteConfig, Order, CartItem, Product, CustomerDetails, ReturnRequest, Appointment, FirestoreSettings } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { ServicesSection, ProductsSection, BookingSection, BlogSection, AboutSection, ReturnsSection, ServiceDetail, BlogDetail } from './components/SiteSections';
import { MakeupAnalyzer } from './components/MakeupAnalyzer';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { storageService, subscribeToSettings, subscribeToOrders, saveOrderToFirestore } from './services/storageService';
import { authService } from './services/authService';
import { Menu, Globe, Instagram, Mail, Lock, ArrowRight, MapPin, Phone, ShoppingBag, CheckCircle, Video, RefreshCw } from 'lucide-react';

// Initial mocks used if storage is empty
const INITIAL_CONFIG: SiteConfig = {
  siteTitle: "", 
  heroTitle: TRANSLATIONS['tr'].hero.title,
  heroSubtitle: TRANSLATIONS['tr'].hero.subtitle,
  heroImage: HERO_IMAGE,
  heroVideo: null,
  aboutImage: ABOUT_IMAGE, 
  aboutText: DEFAULT_ABOUT_TEXT,
  footerBio: "Bridal Room & Academy.\nProfessional Makeup Artist.\nSkin Care Expert.",
  contactEmail: "contact@shenayileri.com",
  contactPhone: PHONE_NUMBER,
  contactAddress: "Germany",
  newsletterTitle: "Newsletter",
  newsletterText: "Subscribe for beauty tips and updates.",
  ads: MOCK_ADS,
  themeColor: 'gold',
  services: SERVICES,
  products: PRODUCTS,
  blogPosts: BLOG_POSTS,
  orders: [],
  appointments: [],
  paymentConfig: {
    accountHolder: "Shenay Ileri Beauty",
    bankName: "Sparkasse Germany",
    iban: "DE89 3705 0198 0000 1234 56",
    swift: "SPARKDE33XXX"
  },
  invoiceConfig: {
    taxId: "123/456/789",
    vatId: "DE 123 456 789",
    jurisdiction: "Berlin"
  }
};

const App = () => {
  const [lang, setLang] = useState<LanguageCode>('tr'); 
  const [view, setView] = useState<'home' | 'services' | 'products' | 'booking' | 'blog' | 'about' | 'app' | 'admin' | 'returns' | 'service-detail' | 'blog-detail' | 'portfolio'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartPaymentOpen, setIsCartPaymentOpen] = useState(false);
  const [tempCustomerDetails, setTempCustomerDetails] = useState<CustomerDetails | null>(null);
  
  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Site Configuration
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [isTitleLoaded, setIsTitleLoaded] = useState(false);
  
  // Connection Refresh State for Mobile
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = authService.observeAuth(async (status, user) => {
        setIsAuthenticated(status);
    });
    return () => unsubscribe();
  }, []);

  // --- MOBILE VISIBILITY LISTENER ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setLastRefresh(Date.now());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // --- REAL-TIME LISTENERS ---

  // 1. Listen for Site Settings (Firestore - ALL Content)
  // This runs for EVERYONE (including anonymous users)
  useEffect(() => {
    const unsubscribe = subscribeToSettings(
        (settings) => {
            const currentT = TRANSLATIONS[lang];
            // Use defaults if Firestore is empty for a field
            const db = settings || {};

            setSiteConfig(prev => ({ 
                ...prev, 
                rawSettings: settings || prev.rawSettings,
                // Map generic fields first, allow lang overrides if implemented later
                siteTitle: db.siteTitle || prev.siteTitle,
                heroTitle: db.heroTitle || currentT.hero.title,
                heroSubtitle: db.heroSubtitle || currentT.hero.subtitle,
                heroImage: db.heroImage || prev.heroImage,
                heroVideo: db.heroVideo || prev.heroVideo,
                aboutImage: db.aboutImage || prev.aboutImage,
                aboutText: db.aboutText || currentT.sections.aboutText,
                footerBio: db.footerText || prev.footerBio,
                contactEmail: db.contactEmail || prev.contactEmail,
                contactPhone: db.contactPhone || prev.contactPhone,
                contactAddress: db.contactAddress || prev.contactAddress,
                newsletterTitle: db.newsletterTitle || prev.newsletterTitle,
                newsletterText: db.newsletterText || prev.newsletterText
            }));
            setIsTitleLoaded(true);
        },
        (error) => {
            if (error.code !== 'permission-denied') {
                console.warn("App Settings Listener Error:", error);
            }
        }
    );
    return () => unsubscribe();
  }, [lang, lastRefresh]); 

  // 2. Listen for Orders (Firestore) - ADMIN ONLY
  useEffect(() => {
      if (!isAuthenticated) return; // Only listen if logged in

      const unsubscribe = subscribeToOrders((orders) => {
          setSiteConfig(prev => ({ ...prev, orders: orders }));
      });
      return () => { if(unsubscribe) unsubscribe(); };
  }, [isAuthenticated, lastRefresh]);

  // 3. Listen for Legacy Realtime DB (Products/Services fallback/init)
  useEffect(() => {
    const unsubscribe = storageService.subscribe((data) => {
      if (data) {
        setSiteConfig(prev => ({
          ...INITIAL_CONFIG, 
          ...data,
          // Firestore overrides take precedence for content fields
          siteTitle: prev.siteTitle,
          heroTitle: prev.heroTitle, 
          heroSubtitle: prev.heroSubtitle,
          heroImage: prev.heroImage,
          aboutImage: prev.aboutImage,
          aboutText: prev.aboutText,
          footerBio: prev.footerBio,
          contactEmail: prev.contactEmail,
          // Merge arrays
          orders: prev.orders.length > 0 ? prev.orders : (data.orders || []),
          appointments: data.appointments || []
        }));
      }
      setIsConfigLoaded(true);
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') unsubscribe();
    };
  }, [lastRefresh]);

  // Logout Wrapper
  const handleLogout = async () => {
      await authService.logout();
      setIsAuthenticated(false);
      setView('home'); 
  };

  const t = TRANSLATIONS[lang];

  // ... (Cart and other handlers kept same for brevity, unchanged)
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  const removeFromCart = (id: number) => { setCart(prev => prev.filter(item => item.id !== id)); };
  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) { return { ...item, quantity: Math.max(1, item.quantity + delta) }; }
      return item;
    }));
  };
  const calculateCartTotal = () => {
    const parsePrice = (priceStr: string) => parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    return cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);
  };
  const handleCartCheckout = (details: CustomerDetails) => { setTempCustomerDetails(details); setIsCartOpen(false); setIsCartPaymentOpen(true); };
  const handleCartPaymentSuccess = async () => {
      if (!tempCustomerDetails) return;
      const totalAmount = "€" + calculateCartTotal().toFixed(2);
      const newOrder: Order = {
          id: 1000 + Math.floor(Math.random() * 9000), 
          customer: tempCustomerDetails,
          items: cart.map(item => ({ productId: item.id, name: item.name, quantity: item.quantity, price: item.price })),
          totalAmount: totalAmount,
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
      };
      
      // Save order to Firestore Collection
      await saveOrderToFirestore(newOrder);

      // Note: We rely on the Admin listener to update the 'orders' list in siteConfig if authenticated.
      // For public users, we just clear the cart and show success.
      setShowSuccessModal(true); setCart([]); setIsCartPaymentOpen(false); setTempCustomerDetails(null);
  };
  const handleRateProduct = (id: number, rating: number) => {
    const newConfigUpdater = (prev: SiteConfig) => ({
      ...prev, products: prev.products.map(p => {
        if (p.id === id) {
            const newCount = p.voteCount + 1;
            const newRating = ((p.rating * p.voteCount) + rating) / newCount;
            return { ...p, rating: newRating, voteCount: newCount };
        }
        return p;
      })
    });
    const newConfig = newConfigUpdater(siteConfig);
    setSiteConfig(newConfig); 
    storageService.save(newConfig); 
  };
  const handleReturnRequest = (request: ReturnRequest) => {
      // Logic for return request (typically requires finding order first, simplified here)
      alert("İade talebiniz başarıyla alındı.");
  };
  const handleBooking = (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newAppointment: Appointment = { ...appointmentData, id: Date.now(), status: 'pending', createdAt: new Date().toISOString().split('T')[0] };
    const newConfigUpdater = (prev: SiteConfig) => ({ ...prev, appointments: [newAppointment, ...(prev.appointments || [])] });
    const newConfig = newConfigUpdater(siteConfig);
    setSiteConfig(newConfig); 
    storageService.save(newConfig);
    return true; 
  };
  const handleServiceClick = (id: number) => { setSelectedServiceId(id); setView('service-detail'); window.scrollTo(0, 0); };
  const handlePostClick = (id: number) => { setSelectedPostId(id); setView('blog-detail'); window.scrollTo(0, 0); };
  const NavButton = ({ targetView, label }: { targetView: typeof view, label: string }) => (
    <button onClick={() => { setView(targetView); setMobileMenuOpen(false); }} className={`hover:text-brand-gold transition duration-300 uppercase tracking-widest text-xs font-bold py-2 ${view === targetView ? 'text-brand-dark border-b-2 border-brand-gold' : 'text-gray-500'}`}>{label}</button>
  );

  const renderView = () => {
    switch(view) {
      case 'app': return <MakeupAnalyzer t={t.app} paymentT={t.payment} lang={lang} paymentConfig={siteConfig.paymentConfig} />;
      case 'admin': return <AdminDashboard t={t.admin} siteConfig={siteConfig} setSiteConfig={setSiteConfig} isAuthenticated={isAuthenticated} onLogin={() => setIsAuthenticated(true)} onLogout={handleLogout} />;
      case 'services': return <ServicesSection t={t.sections} services={siteConfig.services} onServiceClick={handleServiceClick} />;
      case 'products': return <ProductsSection t={t.sections} products={siteConfig.products} addToCart={addToCart} onRate={handleRateProduct} onReturnClick={() => setView('returns')} />;
      case 'booking': return <BookingSection t={t.sections} onBook={handleBooking} />;
      case 'blog': return <BlogSection t={t.sections} posts={siteConfig.blogPosts} onPostClick={handlePostClick} />;
      case 'about': return <AboutSection t={t.sections} image={siteConfig.aboutImage} text={siteConfig.aboutText} />;
      case 'returns': return <ReturnsSection t={t.returns} policyText={RETURN_POLICIES[lang]} onRequestSubmit={handleReturnRequest} />;
      case 'service-detail': {
          const service = siteConfig.services.find(s => s.id === selectedServiceId);
          if (!service) return <ServicesSection t={t.sections} services={siteConfig.services} onServiceClick={handleServiceClick} />;
          return <ServiceDetail service={service} onBack={() => setView('services')} onBookNow={() => setView('booking')} />;
      }
      case 'blog-detail': {
          const post = siteConfig.blogPosts.find(p => p.id === selectedPostId);
          if (!post) return <BlogSection t={t.sections} posts={siteConfig.blogPosts} onPostClick={handlePostClick} />;
          return <BlogDetail post={post} onBack={() => setView('blog')} />;
      }
      case 'portfolio':
        return (
          <div className="py-20 text-center">
             <h2 className="text-4xl font-serif mb-6 gold-text-shadow">Portfolio</h2>
             <p className="text-gray-500">Gallery coming soon...</p>
             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
                 {siteConfig.services.slice(0, 4).map(s => (<div key={s.id} className="aspect-square rounded-lg overflow-hidden"><img src={s.image} className="w-full h-full object-cover hover:scale-110 transition duration-700" /></div>))}
             </div>
          </div>
        );
      case 'home':
      default:
        return (
          <>
            <div className="relative h-[85vh] w-full bg-black overflow-hidden">
              {siteConfig.heroVideo ? (
                <video src={siteConfig.heroVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
              ) : (
                <img src={siteConfig.heroImage} alt="Shenay Ileri" className="absolute inset-0 w-full h-full object-cover opacity-80 animate-fade-in" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="max-w-2xl text-white">
                    <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight animate-fade-in-up gold-text-shadow">
                      {siteConfig.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 font-light tracking-wide max-w-lg">
                      {siteConfig.heroSubtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => setView('app')} className="bg-brand-gold hover:bg-white hover:text-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">{t.hero.cta}</button>
                      <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="border-2 border-white hover:bg-white hover:text-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"><Instagram size={20} />{t.hero.instagram}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-20 bg-white text-center px-4">
              <div className="max-w-4xl mx-auto">
                 <h2 className="text-3xl md:text-4xl font-serif mb-6">{t.sections.aboutTitle}</h2>
                 <p className="text-gray-600 leading-relaxed mb-8 text-lg whitespace-pre-line">{siteConfig.aboutText}</p>
                 <button onClick={() => setView('about')} className="text-brand-gold font-bold uppercase tracking-widest text-xs border-b border-brand-gold pb-1 hover:text-black transition">{t.sections.readMore}</button>
              </div>
            </div>
            <div className="py-16 bg-[#FDFBF7]">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="flex justify-between items-end mb-10">
                     <h2 className="text-3xl font-serif">{t.sections.servicesTitle}</h2>
                     <button onClick={() => setView('services')} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-dark transition">{t.sections.readMore} <ArrowRight size={16} /></button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                     {siteConfig.services.slice(0, 3).map(service => (
                       <div key={service.id} className="group relative h-64 overflow-hidden rounded-xl cursor-pointer" onClick={() => handleServiceClick(service.id)}>
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-end p-6">
                             <h3 className="text-white font-serif text-xl font-bold">{service.title}</h3>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </>
        );
    }
  };

  // Wait for Firestore Title before rendering
  if (!isTitleLoaded && !isConfigLoaded) {
      return (
          <div className="h-screen flex flex-col items-center justify-center bg-brand-light">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mb-4"></div>
              <p className="text-gray-500 animate-pulse font-serif">Loading Beauty...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen font-sans text-brand-dark flex flex-col">
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl scale-100">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} strokeWidth={2.5} />
               </div>
               <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">{t.cart.orderSuccessTitle}</h2>
               <p className="text-gray-500 text-sm mb-6 leading-relaxed">{t.cart.orderSuccessMsg}</p>
               <button onClick={() => setShowSuccessModal(false)} className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition shadow-lg">{t.cart.continueShop}</button>
           </div>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={handleCartCheckout} t={t.cart} />
      
      {isCartPaymentOpen && (
          <PaymentModal 
             t={t.payment}
             onClose={() => setIsCartPaymentOpen(false)}
             onSuccess={handleCartPaymentSuccess}
             config={siteConfig.paymentConfig}
             amount={`€${calculateCartTotal().toFixed(2)}`}
             customTitle="Ödemeyi Tamamla"
             customDescription="Banka havalesi ile güvenli ödeme."
          />
      )}

      <div className="bg-brand-dark text-brand-light text-xs py-2 px-4 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-4">
           <a href={`tel:${siteConfig.contactPhone}`} className="hover:text-brand-gold flex items-center gap-1"><Phone size={12} /> {siteConfig.contactPhone}</a>
           <span className="hidden md:inline hover:text-brand-gold cursor-pointer flex items-center gap-1"><Mail size={12} /> {siteConfig.contactEmail}</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang('tr')} className={`hover:text-brand-gold ${lang === 'tr' ? 'text-brand-gold font-bold' : ''}`}>TR</button>
          <button onClick={() => setLang('en')} className={`hover:text-brand-gold ${lang === 'en' ? 'text-brand-gold font-bold' : ''}`}>EN</button>
          <button onClick={() => setLang('de')} className={`hover:text-brand-gold ${lang === 'de' ? 'text-brand-gold font-bold' : ''}`}>DE</button>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border-2 border-brand-gold group-hover:shadow-[0_0_15px_#D4AF37] transition duration-500">
                <div className="text-[8px] text-brand-gold font-bold text-center leading-none">SHENAY<br/>AI</div>
              </div>
              <span className="text-2xl font-serif font-bold tracking-wider text-brand-gold">{siteConfig.siteTitle}</span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <NavButton targetView="home" label={t.nav.home} />
              <NavButton targetView="portfolio" label={t.nav.portfolio} /> 
              <NavButton targetView="services" label={t.nav.services} />
              <NavButton targetView="products" label={t.nav.products} />
              <NavButton targetView="blog" label={t.nav.blog} />
              <NavButton targetView="booking" label={t.nav.booking} />
              <NavButton targetView="about" label={t.nav.about} />
              <button onClick={() => setView('app')} className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition-all duration-300">{t.nav.app}</button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-500 hover:text-brand-gold transition"><ShoppingBag size={22} />{cart.length > 0 && <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}</button>
            </div>
            <div className="flex items-center gap-4 lg:hidden">
               <button onClick={() => setIsCartOpen(true)} className="relative text-gray-800"><ShoppingBag size={24} />{cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cart.length}</span>}</button>
               <button className="text-brand-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu size={28} /></button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
            <div className="flex flex-col p-6 space-y-4">
              <NavButton targetView="home" label={t.nav.home} />
              <NavButton targetView="portfolio" label={t.nav.portfolio} />
              <NavButton targetView="services" label={t.nav.services} />
              <NavButton targetView="products" label={t.nav.products} />
              <NavButton targetView="blog" label={t.nav.blog} />
              <NavButton targetView="booking" label={t.nav.booking} />
              <NavButton targetView="about" label={t.nav.about} />
              <NavButton targetView="app" label={t.nav.app} />
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">{renderView()}</main>

      <footer className="bg-[#111] text-white pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-serif text-2xl mb-6 text-brand-gold uppercase">{siteConfig.siteTitle}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 whitespace-pre-line">{siteConfig.footerBio}</p>
              <div className="flex gap-4">
                <a href={INSTAGRAM_LINK} className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Mail size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">{t.nav.services}</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                {siteConfig.services.slice(0, 4).map(service => (<li key={service.id} className="hover:text-brand-gold cursor-pointer transition" onClick={() => handleServiceClick(service.id)}>{service.title}</li>))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">{t.contact.title}</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center gap-2"><MapPin size={16} /> {siteConfig.contactAddress}</li>
                <li className="flex items-center gap-2"><Phone size={16} /> {siteConfig.contactPhone}</li>
                <li className="flex items-center gap-2"><Mail size={16} /> {siteConfig.contactEmail}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-gray-300">{siteConfig.newsletterTitle}</h4>
              <p className="text-gray-500 text-xs mb-4">{siteConfig.newsletterText}</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-gray-800 text-white px-4 py-2 rounded-l-md outline-none text-sm w-full focus:ring-1 focus:ring-brand-gold" />
                <button className="bg-brand-gold text-black px-4 py-2 rounded-r-md font-bold text-xs hover:bg-white transition">OK</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; 2025 {siteConfig.siteTitle}. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <button onClick={() => setView('returns')} className="hover:text-brand-gold transition">{t.returns.title}</button>
               <button onClick={() => setView('admin')} className="hover:text-brand-gold flex items-center gap-1 transition"><Lock size={10} /> {t.nav.admin}</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;