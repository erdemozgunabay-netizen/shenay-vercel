import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, MOCK_ADS, HERO_IMAGE, ABOUT_IMAGE, DEFAULT_ABOUT_TEXT, INSTAGRAM_LINK, PHONE_NUMBER, SERVICES, PRODUCTS, BLOG_POSTS, RETURN_POLICIES, GALLERY_ITEMS } from './constants';
import { LanguageCode, SiteConfig, Order, CartItem, Product, CustomerDetails, ReturnRequest, Appointment } from './types';
import { AdminDashboard } from './components/AdminDashboard';
import { ServicesSection, ProductsSection, BookingSection, BlogSection, AboutSection, ReturnsSection, ServiceDetail, BlogDetail, GallerySection, ContactSection, TestimonialsSection, TeamSection } from './components/SiteSections';
import { MakeupAnalyzer } from './components/MakeupAnalyzer';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { Menu, Instagram, Mail, Lock, ArrowRight, MapPin, Phone, ShoppingBag, CheckCircle, Sparkles } from 'lucide-react';

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
  gallery: GALLERY_ITEMS,
  testimonials: [],
  team: [],
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
    jurisdiction: "Berlin",
    companyName: "Shenay Ileri Beauty",
    companyAddress: "Example Street, Berlin"
  }
};

const App = () => {
  const [lang, setLang] = useState<LanguageCode>('tr'); 
  const [view, setView] = useState<'home' | 'services' | 'products' | 'booking' | 'blog' | 'about' | 'app' | 'admin' | 'returns' | 'service-detail' | 'blog-detail' | 'portfolio' | 'gallery' | 'contact'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartPaymentOpen, setIsCartPaymentOpen] = useState(false);
  const [tempCustomerDetails, setTempCustomerDetails] = useState<CustomerDetails | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_CONFIG);

  useEffect(() => {
    authService.observeAuth((status) => setIsAuthenticated(status));
  }, []);

  // CMS LISTENERS
  useEffect(() => {
    // 1. Settings
    const unsubSettings = storageService.subscribeToSettings((settings) => {
        const db = settings || {};
        const currentT = TRANSLATIONS[lang];
        setSiteConfig(prev => ({ 
            ...prev, 
            rawSettings: settings || prev.rawSettings,
            siteTitle: db.siteTitle || prev.siteTitle,
            heroTitle: db.heroTitle || currentT.hero.title,
            heroImage: db.heroImage || prev.heroImage,
            aboutText: db.aboutText || currentT.sections.aboutText,
            aboutImage: db.aboutImage || prev.aboutImage,
            contactPhone: db.contactPhone || prev.contactPhone,
            contactEmail: db.contactEmail || prev.contactEmail,
            contactAddress: db.contactAddress || prev.contactAddress
        }));
    });

    // 2. Collections (Public Read)
    const unsubServices = storageService.subscribeToServices((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, services: data }));
    });
    const unsubProducts = storageService.subscribeToProducts((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, products: data }));
    });
    const unsubBlog = storageService.subscribeToBlog((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, blogPosts: data }));
    });
    const unsubGallery = storageService.subscribeToGallery((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, gallery: data }));
    });
    const unsubTestimonials = storageService.subscribeToTestimonials((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, testimonials: data }));
    });
    const unsubTeam = storageService.subscribeToTeam((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, team: data }));
    });
    const unsubBanners = storageService.subscribeToBanners((data) => {
        if(data?.length) setSiteConfig(prev => ({ ...prev, ads: data }));
    });

    // 3. Admin Only Collections
    let unsubOrders: any;
    let unsubAppointments: any;
    
    if (isAuthenticated) {
        unsubOrders = storageService.subscribeToOrders((data) => {
            setSiteConfig(prev => ({ ...prev, orders: data }));
        });
        unsubAppointments = storageService.subscribeToAppointments((data) => {
            setSiteConfig(prev => ({ ...prev, appointments: data }));
        });
    }

    return () => {
        unsubSettings();
        unsubServices();
        unsubProducts();
        unsubBlog();
        unsubGallery();
        unsubTestimonials();
        unsubTeam();
        unsubBanners();
        if(unsubOrders) unsubOrders();
        if(unsubAppointments) unsubAppointments();
    };
  }, [lang, isAuthenticated]);

  const handleLogout = async () => {
      await authService.logout();
      setIsAuthenticated(false);
      setView('home'); 
  };

  const t = TRANSLATIONS[lang];

  // Cart & Logic Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      return existing 
        ? prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const calculateCartTotal = () => cart.reduce((sum, item) => sum + ((parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0) * item.quantity), 0);
  
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
      await storageService.saveOrderToFirestore(newOrder);
      setShowSuccessModal(true); setCart([]); setIsCartPaymentOpen(false); setTempCustomerDetails(null);
  };

  const handleBookAppointment = async (appt: any) => {
      const newAppt: Appointment = {
          id: Date.now(),
          ...appt,
          status: 'pending',
          createdAt: new Date().toISOString()
      };
      await storageService.addAppointment(newAppt);
  };

  const handleServiceClick = (id: number) => { setSelectedServiceId(id); setView('service-detail'); window.scrollTo(0,0); };
  const handlePostClick = (id: number) => { setSelectedPostId(id); setView('blog-detail'); window.scrollTo(0,0); };

  const NavButton = ({ targetView, label }: any) => (
    <button 
      onClick={() => { setView(targetView); setMobileMenuOpen(false); }} 
      className={`
        transition-all duration-300
        text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded border
        ${view === targetView 
          ? 'bg-brand-gold text-white border-brand-gold shadow-sm' 
          : 'text-brand-dark border-brand-gold hover:bg-brand-gold hover:text-white'
        }
      `}
    >
      {label}
    </button>
  );

  const renderView = () => {
    switch(view) {
      case 'app': return <MakeupAnalyzer t={t.app} paymentT={t.payment} lang={lang} paymentConfig={siteConfig.paymentConfig} />;
      case 'admin': return <AdminDashboard t={t.admin} siteConfig={siteConfig} setSiteConfig={setSiteConfig} isAuthenticated={isAuthenticated} onLogin={() => setIsAuthenticated(true)} onLogout={handleLogout} />;
      case 'services': return <ServicesSection t={t.sections} services={siteConfig.services} onServiceClick={handleServiceClick} />;
      case 'products': return <ProductsSection t={t.sections} products={siteConfig.products} addToCart={addToCart} onRate={()=>{}} onReturnClick={() => setView('returns')} />;
      case 'booking': return <BookingSection t={t.sections} onBook={handleBookAppointment} />;
      case 'blog': return <BlogSection t={t.sections} posts={siteConfig.blogPosts} onPostClick={handlePostClick} />;
      case 'about': return <AboutSection t={t.sections} image={siteConfig.aboutImage} text={siteConfig.aboutText} />;
      case 'gallery': return <GallerySection t={t.sections} items={siteConfig.gallery} />;
      case 'contact': return <ContactSection t={t.contact} config={siteConfig} />;
      case 'returns': return <ReturnsSection t={t.returns} policyText={RETURN_POLICIES[lang]} onRequestSubmit={()=>{alert("Talep alındı")}} />;
      case 'service-detail': return <ServiceDetail service={siteConfig.services.find(s=>s.id===selectedServiceId)!} onBack={()=>setView('services')} onBookNow={()=>setView('booking')} />;
      case 'blog-detail': return <BlogDetail post={siteConfig.blogPosts.find(p=>p.id===selectedPostId)!} onBack={()=>setView('blog')} />;
      default: return (
          <>
            <div className="relative h-[85vh] bg-black">
              {siteConfig.heroVideo ? <video src={siteConfig.heroVideo} autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-80" /> : <img src={siteConfig.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-80" />}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
                  <div className="max-w-3xl text-white">
                      <h1 className="text-5xl md:text-7xl font-serif mb-6 gold-text-shadow">{siteConfig.heroTitle}</h1>
                      <p className="text-xl mb-8 font-light">{siteConfig.heroSubtitle}</p>
                      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
                          {/* Book */}
                          <button onClick={()=>setView('booking')} className="bg-brand-gold text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition shadow-lg">{t.hero.cta}</button>
                          
                          {/* AI */}
                          <button onClick={()=>setView('app')} className="bg-white text-brand-dark border border-brand-gold px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-brand-gold hover:text-white transition shadow-lg">{t.hero.aiBtn}</button>
                          
                          {/* Insta */}
                          <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-transparent text-white border border-white/50 px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition shadow-lg backdrop-blur-sm">
                              <Instagram size={18} /> {t.hero.instagramBtn}
                          </a>
                      </div>
                  </div>
              </div>
            </div>
            
            {/* AI Makeup Analyzer Section - Integrated */}
            <div className="bg-gradient-to-r from-rose-50 to-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl -z-10"></div>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-brand-dark text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                <Sparkles size={14} className="text-brand-gold" /> AI Powered Beauty
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-brand-dark">Sanal Güzellik Danışmanınız</h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Yapay zeka destekli analiz aracımızla yüz şeklinizi, cilt tonunuzu ve size en çok yakışan renkleri keşfedin. Fotoğrafınızı yükleyin, profesyonel öneriler anında cebinize gelsin.
                            </p>
                            <button onClick={()=>setView('app')} className="bg-brand-dark text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition shadow-lg flex items-center gap-3 mx-auto md:mx-0">
                                <Sparkles size={20} /> Ücretsiz Analiz Başlat
                            </button>
                        </div>
                        <div className="md:w-1/2">
                            {/* Mockup / Teaser Visual */}
                            <div className="relative">
                                <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop" className="rounded-2xl shadow-2xl border-4 border-white" alt="AI Analysis" />
                                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-brand-dark">Kişisel Rapor</div>
                                        <div className="text-xs text-gray-500">%98 Eşleşme Başarısı</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 bg-white text-center px-4">
                <h2 className="text-3xl font-serif mb-6 text-brand-dark">{t.sections.aboutTitle}</h2>
                <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg whitespace-pre-line">{siteConfig.aboutText}</p>
            </div>
            
            <ServicesSection t={t.sections} services={siteConfig.services} onServiceClick={handleServiceClick} />
            
            <ProductsSection t={t.sections} products={siteConfig.products} addToCart={addToCart} onRate={()=>{}} onReturnClick={() => setView('returns')} />
            
            <TestimonialsSection t={t.sections} testimonials={siteConfig.testimonials} />

            <TeamSection t={t.sections} team={siteConfig.team} />

            <BlogSection t={t.sections} posts={siteConfig.blogPosts} onPostClick={handlePostClick} />
          </>
      );
    }
  };

  return (
    <div className="min-h-screen font-sans text-brand-dark flex flex-col bg-[#FAFAFA]">
       {showSuccessModal && <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"><div className="bg-white p-8 rounded-3xl text-center max-w-sm"><CheckCircle size={48} className="text-green-500 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">{t.cart.orderSuccessTitle}</h2><button onClick={()=>setShowSuccessModal(false)} className="w-full bg-black text-white py-3 rounded-lg font-bold mt-4">OK</button></div></div>}
       <CartDrawer isOpen={isCartOpen} onClose={()=>setIsCartOpen(false)} items={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onCheckout={(d)=>{setTempCustomerDetails(d); setIsCartOpen(false); setIsCartPaymentOpen(true);}} t={t.cart} />
       {isCartPaymentOpen && <PaymentModal t={t.payment} onClose={()=>setIsCartPaymentOpen(false)} onSuccess={handleCartPaymentSuccess} config={siteConfig.paymentConfig} amount={`€${calculateCartTotal().toFixed(2)}`} />}
       
       <div className="bg-brand-dark text-white text-xs py-1 px-6 flex justify-between z-50">
           <div className="flex gap-4"><span className="flex items-center gap-1"><Phone size={10}/> {siteConfig.contactPhone}</span><span className="hidden md:flex items-center gap-1"><Mail size={10}/> {siteConfig.contactEmail}</span></div>
           <div className="flex gap-4 font-bold"><button onClick={()=>setLang('tr')} className={lang==='tr'?'text-brand-gold':''}>TR</button><button onClick={()=>setLang('en')} className={lang==='en'?'text-brand-gold':''}>EN</button><button onClick={()=>setLang('de')} className={lang==='de'?'text-brand-gold':''}>DE</button></div>
       </div>

       <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-brand-gold/10">
           <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
               <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setView('home')}>
                   <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center border border-brand-gold group-hover:shadow-[0_0_15px_#D4AF37] transition duration-500">
                     <div className="text-[6px] text-brand-gold font-bold text-center leading-none">SHENAY<br/>AI</div>
                   </div>
                   <span className="text-lg font-serif font-extrabold tracking-widest text-brand-gold drop-shadow-sm">{siteConfig.siteTitle || 'SHENAY ILERI'}</span>
               </div>
               <div className="hidden lg:flex gap-2 items-center">
                   <NavButton targetView="home" label={t.nav.home} />
                   <NavButton targetView="about" label={t.nav.about} />
                   <NavButton targetView="services" label={t.nav.services} />
                   <NavButton targetView="products" label={t.nav.products} />
                   <NavButton targetView="blog" label={t.nav.blog} />
                   <NavButton targetView="gallery" label={t.nav.gallery} />
                   <NavButton targetView="contact" label={t.nav.contact} />
                   
                   <button onClick={()=>setIsCartOpen(true)} className="relative p-1 ml-2 text-brand-dark hover:text-brand-gold transition"><ShoppingBag size={20}/>{cart.length>0&&<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">{cart.length}</span>}</button>
               </div>
               <button className="lg:hidden" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}><Menu size={20}/></button>
           </div>
           {mobileMenuOpen && <div className="lg:hidden bg-white border-t p-4 flex flex-col space-y-4 shadow-xl"><NavButton targetView="home" label={t.nav.home}/><NavButton targetView="about" label={t.nav.about} /><NavButton targetView="services" label={t.nav.services}/><NavButton targetView="products" label={t.nav.products}/><NavButton targetView="gallery" label={t.nav.gallery} /><NavButton targetView="contact" label={t.nav.contact} /></div>}
       </nav>

       <main className="flex-grow">{renderView()}</main>

       <footer className="bg-[#111] text-white py-12 border-t border-gray-800">
           <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
               <div><h3 className="text-xl font-serif text-brand-gold mb-4">{siteConfig.siteTitle}</h3><p className="text-gray-400 whitespace-pre-line">{siteConfig.footerBio}</p></div>
               <div><h4 className="font-bold mb-4 uppercase text-gray-400">Menu</h4><ul className="space-y-2 text-gray-500"><li><button onClick={()=>setView('services')}>Hizmetler</button></li><li><button onClick={()=>setView('products')}>Ürünler</button></li><li><button onClick={()=>setView('gallery')}>Galeri</button></li></ul></div>
               <div><h4 className="font-bold mb-4 uppercase text-gray-400">İletişim</h4><ul className="space-y-2 text-gray-500"><li>{siteConfig.contactAddress}</li><li>{siteConfig.contactPhone}</li><li>{siteConfig.contactEmail}</li></ul></div>
               <div><h4 className="font-bold mb-4 uppercase text-gray-400">Yönetim</h4><button onClick={()=>setView('admin')} className="flex items-center gap-2 text-gray-500 hover:text-white"><Lock size={14}/> Admin Girişi</button></div>
           </div>
       </footer>
    </div>
  );
};

export default App;