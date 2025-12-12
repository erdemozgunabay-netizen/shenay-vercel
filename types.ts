
export type LanguageCode = 'tr' | 'en' | 'de';

export interface TranslationStructure {
  nav: {
    home: string;
    services: string;
    products: string;
    booking: string;
    blog: string;
    about: string;
    app: string;
    admin: string;
    portfolio: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    instagram: string;
  };
  contact: {
      title: string;
      phone: string;
  };
  payment: {
    title: string;
    description: string;
    payButton: string;
    secure: string;
    cardHolder: string;
    expires: string;
    bankTransferTitle: string;
    bankTransferDesc: string;
    sentButton: string;
  };
  admin: {
    title: string;
    adsTitle: string;
    uploadAd: string;
    loginTitle: string;
    username: string;
    password: string;
    loginBtn: string;
    forgotPassword: string; 
    recoveryTitle: string; 
    recoveryDesc: string; 
    lockedMessage: string; 
  };
  sections: {
    servicesTitle: string;
    productsTitle: string;
    blogTitle: string;
    bookTitle: string;
    aboutTitle: string;
    aboutText: string; 
    aboutRoles: [string, string, string]; 
    bookBtn: string;
    buyBtn: string;
    readMore: string;
    returnBtn: string; 
    bookFormName: string;
    bookFormNamePlaceholder: string;
    bookFormPhone: string;
    bookFormDate: string;
    bookFormTime: string;
    bookFormService: string;
    bookFormSuccess: string;
    bookServiceOptions: {
      bridal: string;
      special: string;
      skincare: string;
      brows: string;
    };
  };
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    shippingTitle: string;
    shippingDesc: string;
    formName: string;
    formPhone: string;
    formEmail: string;
    formAddress: string;
    formCity: string;
    formZip: string;
    back: string;
    proceed: string;
    orderSuccessTitle: string; 
    orderSuccessMsg: string; 
    continueShop: string; 
  };
  returns: {
    title: string;
    policyTitle: string;
    formTitle: string;
    orderId: string;
    email: string;
    reason: string;
    submitBtn: string;
    placeholderId: string;
    placeholderEmail: string;
    placeholderReason: string;
  };
  app: {
    title: string;
    subtitle: string;
    upload: string;
    analyzing: string;
    freeSummary: string;
    summaryTitle: string;
    faceShape: string;
    skinTone: string;
    premiumRequired: string;
    unlockPremium: string;
    premiumPrice: string;
    suggestions: string;
    paletteTitle: string;
    stepsTitle: string;
    productsTitle: string;
    dayNightTitle: string;
    proFixes: string;
    time: string;
    minutes: string;
    day: string;
    night: string;
    technique: string;
    symmetry: string;
    eyeShape: string;
    option: string;
    emptyProducts: string;
    defaultFixes: string;
  };
}

export type Translations = Record<string, TranslationStructure>;

// --- Advanced Analysis Result Interface ---

export interface PaletteOption {
  style_name: string;
  colors: {
    role: string;
    hex: string;
    reason: string;
  }[];
}

export interface AnalysisResult {
  summary: string;
  
  numeric_metrics?: {
    face_shape: string;
    skin_undertone: string;
    skin_tone_lab: string; 
    eye_opening_ratio: string; 
    face_symmetry_score: number;
    other_metrics: { name: string, value: string, unit: string }[];
  };

  debug_info?: {
    image_quality_score: number;
    lighting_condition: string;
    warnings: string[];
  };

  features: {
    feature: string;
    description: string;
    confidence: number;
  }[];

  palette?: {
    option_a: PaletteOption;
    option_b: PaletteOption;
  };

  steps: {
    step: number;
    title: string;
    product: string;
    tool: string;
    technique: string;
    intensity: string;
  }[];

  variants: {
    day: string;
    night: string;
  };

  fix_tips: string[];
  products: string[];
  estimated_time_minutes: number;
  error?: string | null;
}

export interface AdBanner {
  id: number;
  imageUrl: string;
  title: string;
  link: string;
  orderCount?: number; 
  voteCount?: number; 
}

export interface Service {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  gallery?: string[];
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  rating: number;
  orderCount: number; 
  voteCount: number;  
}

export interface CartItem extends Product {
  quantity: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  image: string;
  gallery?: string[];
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  note?: string;
}

export interface Order {
  id: number;
  customer: CustomerDetails;
  items: { productId: number; name: string; quantity: number; price: string }[];
  totalAmount: string;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled' | 'return_requested' | 'returned' | 'refunded';
  date: string;
}

export interface Appointment {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface PaymentConfig {
  accountHolder: string;
  bankName: string;
  iban: string;
  swift: string;
}

export interface InvoiceConfig {
  taxId: string; 
  vatId: string; 
  jurisdiction: string; 
}

export interface FirestoreSettings {
  // Global (Shared) Content Fields - Allow null/undefined for flexibility but sanitized before save
  siteTitle?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: string | null;
  heroVideo?: string | null;
  aboutImage?: string | null;
  aboutText?: string | null;
  footerText?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactAddress?: string | null;
  newsletterTitle?: string | null;
  newsletterText?: string | null;

  // Language Specific Overrides
  siteTitle_tr?: string | null;
  heroTitle_tr?: string | null;
  siteSubtitle_tr?: string | null;
  siteContent_tr?: string | null;
  
  siteTitle_en?: string | null;
  heroTitle_en?: string | null;
  siteSubtitle_en?: string | null;
  siteContent_en?: string | null;

  siteTitle_de?: string | null;
  heroTitle_de?: string | null;
  siteSubtitle_de?: string | null;
  siteContent_de?: string | null;
}

export interface SiteConfig {
  siteTitle: string; 
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideo: string | null; 
  aboutImage: string; 
  aboutText: string; 
  footerBio: string; 
  contactEmail: string; 
  contactPhone: string; 
  contactAddress: string; 
  
  newsletterTitle: string; 
  newsletterText: string; 
  
  ads: AdBanner[];
  themeColor: string;
  
  services: Service[];
  products: Product[];
  blogPosts: BlogPost[];
  orders: Order[];
  appointments: Appointment[]; 
  
  paymentConfig: PaymentConfig;
  invoiceConfig?: InvoiceConfig;

  rawSettings?: FirestoreSettings; 
}

export interface AdminTask {
  id: number;
  task: string;
  status: 'pending' | 'completed' | 'scheduled';
  time?: string;
}

export interface ReturnRequest {
  orderId: number;
  email: string;
  reason: string;
}
