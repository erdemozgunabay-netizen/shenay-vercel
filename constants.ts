

import { Translations, AdBanner, Service, Product, BlogPost, GalleryItem } from './types';

export const INSTAGRAM_LINK = "https://instagram.com/shenayileri";
export const PHONE_NUMBER = "017663195289";

export const HERO_IMAGE = "https://images.unsplash.com/photo-1596436570226-f78a87383637?q=80&w=2074&auto=format&fit=crop"; 
// Changed to placeholder as requested
export const ABOUT_IMAGE = "https://placehold.co/600x800/png?text=Fotograf+Yok";

export const DEFAULT_ABOUT_TEXT = "Shenay İleri, güzellik ve estetik dünyasında yıllara dayanan tecrübesiyle, her kadının içindeki eşsiz ışıltıyı ortaya çıkarmayı hedefler. Fames Face Akademie mezunu olan Shenay, sadece bir makyaj sanatçısı değil, aynı zamanda bir güzellik koçudur.";

export const TRANSLATIONS: Translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      products: "Shop",
      booking: "Book Now",
      blog: "Blog",
      about: "About",
      app: "AI Beauty",
      gallery: "Gallery",
      contact: "Contact",
      admin: "Admin"
    },
    hero: {
      title: "Reveal Your True Beauty",
      subtitle: "Professional artistry meets Artificial Intelligence. Discover the perfect makeup for your unique face shape with Shenay Ileri.",
      cta: "Book Appointment",
      aiBtn: "Try AI Analysis",
      instagramBtn: "Follow on Instagram",
      instagram: "Follow on Instagram"
    },
    contact: {
        title: "Contact & Booking",
        phone: "Phone",
        email: "Email",
        address: "Address",
        whatsapp: "WhatsApp"
    },
    payment: {
      title: "Bank Transfer Payment",
      description: "To unlock the full premium analysis and product guide, please proceed via bank transfer.",
      payButton: "Proceed to Transfer",
      secure: "Secure Bank Transfer",
      cardHolder: "ACCOUNT HOLDER",
      expires: "VALID THRU",
      bankTransferTitle: "Bank Transfer Details",
      bankTransferDesc: "Please transfer the amount to the account below to unlock your report.",
      sentButton: "I Have Sent the Payment"
    },
    admin: {
      title: "Shenay Admin Dashboard",
      adsTitle: "Manage Campaign Ads",
      uploadAd: "Upload New Banner",
      loginTitle: "Admin Login",
      username: "Username",
      password: "Password",
      loginBtn: "Login",
      forgotPassword: "Forgot Password?",
      recoveryTitle: "Account Recovery",
      recoveryDesc: "For security reasons, please contact the system developer to reset your credentials.",
      lockedMessage: "Too many failed attempts. Login locked for security."
    },
    sections: {
      servicesTitle: "Exclusive Services",
      productsTitle: "Signature Products",
      blogTitle: "Beauty Trends & Tips",
      bookTitle: "Book an Appointment",
      aboutTitle: "About Shenay Ileri",
      aboutText: "With years of experience in the beauty and aesthetics world, Shenay Ileri aims to reveal the unique sparkle within every woman. A graduate of Fames Face Academy, Shenay is not just a makeup artist but also a beauty coach.",
      aboutRoles: [
          "Founder of Bridal Room & Academy",
          "Professional Makeup & Hair Design",
          "Medical Skin Care Expert (Aquafacial)"
      ],
      bookBtn: "Confirm Booking",
      buyBtn: "Add to Cart",
      readMore: "Read More",
      returnBtn: "Create Return Request",
      bookFormName: "Full Name",
      bookFormNamePlaceholder: "Enter Full Name",
      bookFormPhone: "Phone Number",
      bookFormDate: "Date",
      bookFormTime: "Time",
      bookFormService: "Service",
      bookFormSuccess: "Reservation request received!",
      bookServiceOptions: {
        bridal: "Bridal Makeup",
        special: "Special Event Makeup",
        skincare: "Skin Care",
        brows: "Brow Design"
      },
      galleryTitle: "Portfolio & Gallery",
      contactTitle: "Get in Touch",
      testimonialsTitle: "Client Testimonials",
      teamTitle: "Meet Our Team"
    },
    cart: {
      title: "My Shopping Bag",
      empty: "Your bag is empty.",
      total: "Total",
      checkout: "Confirm Order",
      shippingTitle: "Shipping Details",
      shippingDesc: "Please provide your details to proceed.",
      formName: "Full Name",
      formPhone: "Phone Number",
      formEmail: "Email Address",
      formAddress: "Address",
      formCity: "City",
      formZip: "Zip Code",
      back: "Back",
      proceed: "Proceed to Payment",
      orderSuccessTitle: "Order Received!",
      orderSuccessMsg: "Thank you! Your order has been successfully recorded in our system.",
      continueShop: "Continue Shopping"
    },
    returns: {
      title: "Returns & Refunds",
      policyTitle: "Return Policy",
      formTitle: "Return Request Form",
      orderId: "Order Number",
      email: "Email Address",
      reason: "Reason for Return",
      submitBtn: "Submit Request",
      placeholderId: "e.g. 1001",
      placeholderEmail: "Email used for order",
      placeholderReason: "Please briefly describe why you are returning the item..."
    },
    app: {
      title: "AI Makeup Consultant",
      subtitle: "Upload your photo for a personalized professional makeup analysis.",
      upload: "Upload Photo",
      analyzing: "Analyzing...",
      freeSummary: "Free Face Profile",
      summaryTitle: "Your Face Profile",
      faceShape: "Face Shape",
      skinTone: "Skin Tone",
      premiumRequired: "Premium Content (Locked)",
      unlockPremium: "Unlock via Bank Transfer",
      premiumPrice: "€5.00",
      suggestions: "Detailed Application Guide",
      paletteTitle: "Your Color Palette",
      stepsTitle: "Step-by-Step Guide",
      productsTitle: "Recommended Products",
      dayNightTitle: "Day & Night Look",
      proFixes: "Pro Fixes",
      time: "Duration",
      minutes: "Min",
      day: "DAY",
      night: "NIGHT",
      technique: "Technique",
      symmetry: "Symmetry",
      eyeShape: "Eye Shape",
      option: "Option",
      emptyProducts: "No specific products required for this look.",
      defaultFixes: "Your facial features are quite balanced. You can highlight your natural beauty with minimal touches."
    }
  },
  tr: {
    nav: {
      home: "Ana Sayfa",
      services: "Hizmetler",
      products: "Ürünler",
      booking: "Randevu",
      blog: "Blog",
      about: "Hakkımda",
      app: "AI Analiz",
      gallery: "Galeri",
      contact: "İletişim",
      admin: "Yönetim"
    },
    hero: {
      title: "Gerçek Güzelliğinizi Ortaya Çıkarın",
      subtitle: "Profesyonel sanat Yapay Zeka ile buluşuyor. Shenay İleri ile yüz şeklinize en uygun makyajı keşfedin.",
      cta: "Randevu Al",
      aiBtn: "AI Analizini Dene",
      instagramBtn: "Instagram'da Takip Et",
      instagram: "Instagram'da Takip Et"
    },
    contact: {
        title: "İletişim & Randevu",
        phone: "Tel",
        email: "E-posta",
        address: "Adres",
        whatsapp: "WhatsApp"
    },
    payment: {
      title: "Ödeme Yöntemi: Banka Havalesi",
      description: "Premium analize ve detaylı rapora erişmek için lütfen ödemeyi banka havalesi ile yapınız.",
      payButton: "Havaleye Geç",
      secure: "Güvenli Banka Havalesi",
      cardHolder: "HESAP SAHİBİ",
      expires: "GEÇERLİLİK",
      bankTransferTitle: "Banka Hesap Bilgileri",
      bankTransferDesc: "Raporun kilidini açmak için lütfen tutarı aşağıdaki hesaba gönderiniz.",
      sentButton: "Ödemeyi Gönderdim"
    },
    admin: {
      title: "Shenay Yönetim Paneli",
      adsTitle: "Kampanya Reklamlarını Yönet",
      uploadAd: "Yeni Banner Yükle",
      loginTitle: "Yönetici Girişi",
      username: "Kullanıcı Adı",
      password: "Şifre",
      loginBtn: "Giriş Yap",
      forgotPassword: "Şifremi Unuttum",
      recoveryTitle: "Hesap Kurtarma",
      recoveryDesc: "Güvenlik nedeniyle şifre sıfırlama işlemi için lütfen sistem geliştiricisi ile iletişime geçiniz.",
      lockedMessage: "Çok fazla başarısız deneme. Güvenlik için giriş kilitlendi."
    },
    sections: {
      servicesTitle: "Hizmetlerimiz",
      productsTitle: "Öne Çıkan Ürünler",
      blogTitle: "Güzellik İpuçları & Blog",
      bookTitle: "Randevu Oluştur",
      aboutTitle: "Shenay İleri Hakkında",
      aboutText: "Shenay İleri, güzellik ve estetik dünyasında yıllara dayanan tecrübesiyle, her kadının içindeki eşsiz ışıltıyı ortaya çıkarmayı hedefler. Fames Face Akademie mezunu olan Shenay, sadece bir makyaj sanatçısı değil, aynı zamanda bir güzellik koçudur.",
      aboutRoles: [
          "Bridal Room & Academy Kurucusu",
          "Profesyonel Makyaj & Saç Tasarımı",
          "Medikal Cilt Bakımı Uzmanı (Aquafacial)"
      ],
      bookBtn: "Randevuyu Onayla",
      buyBtn: "Sepete Ekle",
      readMore: "Devamını Oku",
      returnBtn: "İade Talebi Oluştur",
      bookFormName: "Ad Soyad",
      bookFormNamePlaceholder: "İsim Giriniz",
      bookFormPhone: "Telefon",
      bookFormDate: "Tarih",
      bookFormTime: "Saat",
      bookFormService: "Hizmet",
      bookFormSuccess: "Rezervasyon talebiniz alındı!",
      bookServiceOptions: {
        bridal: "Gelin Makyajı",
        special: "Özel Gün Makyajı",
        skincare: "Cilt Bakımı",
        brows: "Kaş Tasarım"
      },
      galleryTitle: "Portföy & Galeri",
      contactTitle: "Bize Ulaşın",
      testimonialsTitle: "Müşterilerimiz Ne Diyor?",
      teamTitle: "Ekibimizle Tanışın"
    },
    cart: {
      title: "Sepetim",
      empty: "Sepetiniz şu an boş.",
      total: "Toplam",
      checkout: "Siparişi Tamamla",
      shippingTitle: "Teslimat Bilgileri",
      shippingDesc: "Siparişinizin size ulaşması için lütfen bilgileri doldurun.",
      formName: "Ad Soyad",
      formPhone: "Telefon Numarası",
      formEmail: "E-posta Adresi",
      formAddress: "Açık Adres",
      formCity: "Şehir / İlçe",
      formZip: "Posta Kodu",
      back: "Geri",
      proceed: "Ödemeye Geç",
      orderSuccessTitle: "Siparişiniz Alındı!",
      orderSuccessMsg: "Teşekkürler! Siparişiniz başarıyla sistemimize kaydedildi.",
      continueShop: "Alışverişe Devam Et"
    },
    returns: {
      title: "İade & Geri Ödeme",
      policyTitle: "İade Koşulları",
      formTitle: "İade Talep Formu",
      orderId: "Sipariş Numarası",
      email: "E-Posta Adresi",
      reason: "İade Nedeni",
      submitBtn: "Talebi Gönder",
      placeholderId: "Örn: 1001",
      placeholderEmail: "Sipariş verirken kullandığınız email",
      placeholderReason: "Lütfen iade nedeninizi kısaca açıklayınız..."
    },
    app: {
      title: "AI Makyaj Danışmanı",
      subtitle: "Kişiselleştirilmiş profesyonel makyaj analizi için fotoğrafınızı yükleyin.",
      upload: "Fotoğraf Yükle",
      analyzing: "Analiz Ediliyor...",
      freeSummary: "Ücretsiz Yüz Profili",
      summaryTitle: "Yüz Profiliniz",
      faceShape: "Yüz Şekli",
      skinTone: "Cilt Tonu",
      premiumRequired: "Premium İçerik (Kilitli)",
      unlockPremium: "Havale ile Kilidi Aç",
      premiumPrice: "€5.00",
      suggestions: "Adım Adım Uygulama Rehberi",
      paletteTitle: "Size Özel Renk Paleti",
      stepsTitle: "Uygulama Adımları",
      productsTitle: "Önerilen Ürünler",
      dayNightTitle: "Gece & Gündüz Alternatifleri",
      proFixes: "Pro Düzeltmeler",
      time: "Süre",
      minutes: "Dk",
      day: "GÜNDÜZ",
      night: "GECE",
      technique: "Teknik",
      symmetry: "Simetri",
      eyeShape: "Göz Yapısı",
      option: "Seçenek",
      emptyProducts: "Bu görünüm için özel bir ürün gerekmiyor.",
      defaultFixes: "Yüz hatlarınız oldukça dengeli. Minimal dokunuşlarla doğal güzelliğinizi ön plana çıkarabilirsiniz."
    }
  },
  de: {
    nav: {
      home: "Startseite",
      services: "Dienstleistungen",
      products: "Produkte",
      booking: "Termine",
      blog: "Blog",
      about: "Über Uns",
      app: "AI Analyse",
      gallery: "Galerie",
      contact: "Kontakt",
      admin: "Admin"
    },
    hero: {
      title: "Entfalten Sie Ihre Wahre Schönheit",
      subtitle: "Professionelle Kunst trifft auf künstliche Intelligenz. Entdecken Sie mit Shenay Ileri das perfekte Make-up.",
      cta: "Termin buchen",
      aiBtn: "AI-Analyse testen",
      instagramBtn: "Auf Instagram folgen",
      instagram: "Folgen Sie auf Instagram"
    },
    contact: {
        title: "Kontakt & Buchung",
        phone: "Telefon",
        email: "E-Mail",
        address: "Adresse",
        whatsapp: "WhatsApp"
    },
    payment: {
      title: "Zahlung per Banküberweisung",
      description: "Bitte überweisen Sie den Betrag, um die vollständige Premium-Analyse freizuschalten.",
      payButton: "Zur Überweisung",
      secure: "Sichere Banküberweisung",
      cardHolder: "KONTOLNHABER",
      expires: "GÜLTIG BIS",
      bankTransferTitle: "Bankverbindung",
      bankTransferDesc: "Bitte überweisen Sie den Gesamtbetrag auf das untenstehende Konto.",
      sentButton: "Ich habe die Zahlung gesendet"
    },
    admin: {
      title: "Shenay Admin Dashboard",
      adsTitle: "Werbekampagnen verwalten",
      uploadAd: "Neues Banner hochladen",
      loginTitle: "Admin Login",
      username: "Benutzername",
      password: "Password",
      loginBtn: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      recoveryTitle: "Kontowiederherstellung",
      recoveryDesc: "Aus Sicherheitsgründen wenden Sie sich bitte an den Systementwickler.",
      lockedMessage: "Zu viele Fehlversuche. Anmeldung gesperrt."
    },
    sections: {
      servicesTitle: "Dienstleistungen",
      productsTitle: "Produkte",
      blogTitle: "Blog & Tipps",
      bookTitle: "Termin buchen",
      aboutTitle: "Über Shenay Ileri",
      aboutText: "Shenay Ileri kombiniert jahrelange Erfahrung in der Schönheits- und Ästhetikbranche mit dem Ziel, das einzigartige Strahlen jeder Frau zum Vorschein zu bringen. Als Absolventin der Fames Face Akademie ist Shenay nicht nur Visagistin, sondern auch Schönheitscoach.",
      aboutRoles: [
          "Gründerin von Bridal Room & Academy",
          "Professionelles Make-up & Haarstyling",
          "Expertin für medizinische Hautpflege (Aquafacial)"
      ],
      bookBtn: "Bestätigen",
      buyBtn: "In den Warenkorb",
      readMore: "Mehr lesen",
      returnBtn: "Rücksendeantrag erstellen",
      bookFormName: "Name",
      bookFormNamePlaceholder: "Namen eingeben",
      bookFormPhone: "Telefon",
      bookFormDate: "Datum",
      bookFormTime: "Uhrzeit",
      bookFormService: "Dienstleistung",
      bookFormSuccess: "Reservierungsanfrage erhalten!",
      bookServiceOptions: {
        bridal: "Braut Make-up",
        special: "Besonderes Event Make-up",
        skincare: "Hautpflege",
        brows: "Augenbrauendesign"
      },
      galleryTitle: "Portfolio & Galerie",
      contactTitle: "Kontaktieren Sie uns",
      testimonialsTitle: "Kundenbewertungen",
      teamTitle: "Unser Team"
    },
    cart: {
      title: "Warenkorb",
      empty: "Ihr Warenkorb ist leer.",
      total: "Gesamt",
      checkout: "Bestellung bestätigen",
      shippingTitle: "Versanddetails",
      shippingDesc: "Bitte geben Sie Ihre Daten ein, um fortzufahren.",
      formName: "Vollständiger Name",
      formPhone: "Telefonnummer",
      formEmail: "E-Mail-Adresse",
      formAddress: "Adresse",
      formCity: "Stadt",
      formZip: "Postleitzahl",
      back: "Zurück",
      proceed: "Zur Zahlung",
      orderSuccessTitle: "Bestellung erhalten!",
      orderSuccessMsg: "Vielen Dank! Ihre Bestellung wurde erfolgreich in unserem System erfasst.",
      continueShop: "Weiter einkaufen"
    },
    returns: {
      title: "Rückgabe & Erstattung",
      policyTitle: "Widerrufsbelehrung",
      formTitle: "Rücksendeformular",
      orderId: "Bestellnummer",
      email: "E-Mail-Adresse",
      reason: "Grund für die Rücksendung",
      submitBtn: "Anfrage Senden",
      placeholderId: "z.B. 1001",
      placeholderEmail: "E-Mail der Bestellung",
      placeholderReason: "Bitte beschreiben Sie kurz den Grund..."
    },
    app: {
      title: "AI Make-up Berater",
      subtitle: "Laden Sie Ihr Foto hoch für eine personalisierte professionelle Make-up-Analyse.",
      upload: "Foto hochladen",
      analyzing: "Analysieren...",
      freeSummary: "Kostenloses Gesichtsprofil",
      summaryTitle: "Ihr Gesichtsprofil",
      faceShape: "Gesichtsform",
      skinTone: "Hautton",
      premiumRequired: "Premium-Inhalt (Gesperrt)",
      unlockPremium: "Freischalten (Überweisung)",
      premiumPrice: "€5.00",
      suggestions: "Schritt-für-Schritt-Anleitung",
      paletteTitle: "Ihre Farbpalette",
      stepsTitle: "Anwendungsschritte",
      productsTitle: "Empfohlene Produkte",
      dayNightTitle: "Tag & Nacht Look",
      proFixes: "Pro Korrekturen",
      time: "Dauer",
      minutes: "Min",
      day: "TAG",
      night: "NACHT",
      technique: "Technik",
      symmetry: "Symmetrie",
      eyeShape: "Augenform",
      option: "Seçenek",
      emptyProducts: "Keine speziellen Produkte erforderlich.",
      defaultFixes: "Ihre Gesichtszüge sind sehr ausgeglichen. Mit minimalen Akzenten können Sie Ihre natürliche Schönheit unterstreichen."
    }
  }
};

export const MOCK_ADS: AdBanner[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop",
    title: "Bridal Collection 2025",
    link: "#"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
    title: "Masterclass: Contour like a Pro",
    link: "#"
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
    { id: 1, image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=2036&auto=format&fit=crop", caption: "Gelin Makyajı" },
    { id: 2, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop", caption: "Soft Glam" },
    { id: 3, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop", caption: "Editorial" },
    { id: 4, image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop", caption: "Cilt Bakımı" },
    { id: 5, image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop", caption: "Workshop" }
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Gelin Makyajı & Saç",
    description: "En özel gününüzde kusursuz görünüm. Prova ve yüz analizi dahil.",
    longDescription: "Düğün gününüzde hayal ettiğiniz o eşsiz görünüme kavuşmanız için profesyonel gelin makyajı ve saç tasarımı hizmetimizle yanınızdayız. Yüz hatlarınıza, gelinliğinizin tarzına ve düğün konseptinize en uygun makyajı, deneme provalarıyla birlikte belirliyoruz. Dünyaca ünlü kozmetik markalarını kullanarak, gece boyu kalıcı, fotoğraflarda kusursuz çıkan ve en önemlisi sizin doğal güzelliğinizi ön plana çıkaran bir çalışma sunuyoruz.",
    gallery: [
       "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=2036&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=2036&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Aquafacial Cilt Bakımı",
    description: "Derinlemesine temizlik ve nemlendirme ile ışıldayan bir cilt.",
    longDescription: "Aquafacial, cildi derinlemesine temizleyen, soyan, ekstraksiyon yapan ve nemlendiren medikal bir cilt bakımı uygulamasıdır. Özel başlıkları sayesinde cildinizdeki ölü hücreleri arındırırken, aynı zamanda cildin alt katmanlarına vitamin, mineral ve hyaluronik asit pompalar. Sonuç: Anında daha parlak, temiz ve canlı bir cilt.",
    gallery: [
       "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Lash & Brow Lifting",
    description: "Daha dolgun kaşlar ve kıvrık kirpikler için profesyonel dokunuş.",
    longDescription: "Bakışlarınızı daha etkileyici kılmak için Lash Lifting (Kirpik Kaldırma) ve Brow Lamination (Kaş Laminasyonu) hizmetlerimizle tanışın. Kirpikleriniz dipten uca kıvrılarak daha uzun ve hacimli görünürken, kaşlarınız yukarı doğru taranmış, sabitlenmiş ve daha dolgun bir forma kavuşur. İşlem ortalama 6-8 hafta kalıcılık sağlar.",
    gallery: [
       "https://images.unsplash.com/photo-1588510002166-5121287130eb?q=80&w=1974&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1596436570226-f78a87383637?q=80&w=2074&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1588510002166-5121287130eb?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Makyaj Workshop",
    description: "Kendi yüzünüze en uygun makyajı yapmayı öğrenin.",
    longDescription: "Birebir veya grup halinde düzenlenen makyaj atölyelerimizde, kendi yüz tipinizi, cilt alt tonunuzu ve size en çok yakışan renkleri keşfedeceksiniz. Doğru fırça kullanımı, fondöten seçimi, eyeliner çekme teknikleri ve günlükten geceye makyaj dönüşümü gibi konuları uygulamalı olarak öğretiyoruz.",
    gallery: [
       "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=2070&auto=format&fit=crop"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Shenay Signature Red",
    description: "Mat bitişli, uzun süre kalıcı kırmızı ruj.",
    price: "€25.00",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2030&auto=format&fit=crop",
    rating: 5,
    orderCount: 142,
    voteCount: 89
  },
  {
    id: 2,
    name: "Glow Serum",
    description: "Makyaj öncesi aydınlatıcı baz.",
    price: "€45.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
    rating: 4.8,
    orderCount: 230,
    voteCount: 156
  },
  {
    id: 3,
    name: "Contour Palette",
    description: "Her cilt tonuna uygun 3 renkli kontür paleti.",
    price: "€35.00",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    orderCount: 86,
    voteCount: 42
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "2025 Gelin Makyajı Trendleri",
    excerpt: "Bu sezonun öne çıkan doğal ışıltılar ve pastel tonları hakkında bilmeniz gerekenler.",
    content: "2025 gelin makyajı trendlerinde doğallık ve ışıltı bir araya geliyor. Geçmiş yılların yoğun kontür uygulamaları ve mat bitişli fondötenleri yerini 'Glass Skin' görünümüne bırakıyor. Bu sezon gelinlerde en çok tercih edilecek stil, cildin kendi ışıltısını ortaya çıkaran ince yapılı ürünler ve krem allıklar olacak.\n\nGöz makyajında ise şeftali, pembe ve şampanya tonları hakimiyetini sürdürüyor. Abartılı takma kirpikler yerine, tekli kirpiklerle daha doğal ama etkileyici bakışlar hedefleniyor. Dudaklarda ise 'Glossy' bitişli nude rujlar ve hafif renkli parlatıcılar geri dönüyor.\n\nSaç trendlerinde ise sıkı topuzlar yerini dağınık, bohem örgülere ve doğal dalgalara bırakıyor. Aksesuar olarak inciler ve taze çiçekler ön planda.",
    date: "10 Mart 2025",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
    gallery: [
        "https://images.unsplash.com/photo-1596436570226-f78a87383637?q=80&w=2074&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Kış Aylarında Cilt Bakımı",
    excerpt: "Soğuk havalarda cildinizi korumanın 5 altın kuralı.",
    content: "Kış ayları, soğuk hava ve rüzgarın etkisiyle cildin kurumasına, çatlamasına ve hassaslaşmasına neden olabilir. Bu dönemde cilt bakım rutininizi mevsime göre güncellemek hayati önem taşır.\n\n1. Nemlendirmeyi İhmal Etmeyin: Yazın kullandığınız su bazlı nemlendiriciler kışın yetersiz kalabilir. Daha yoğun, seramid ve hyaluronik asit içeren kremlere geçiş yapın.\n2. Güneş Koruyucu Kullanın: Kış güneşi de cilde zarar verir. Özellikle karlı havalarda UV ışınlarının yansıması cildi yakabilir. SPF 30+ koruyucu kullanmaya devam edin.\n3. Sıcak Sudan Kaçının: Çok sıcak suyla yüz yıkamak cildin doğal yağlarını yok eder. Ilık su tercih edin.\n4. Dudak Bakımı: Kuruyan dudaklar için yoğun onarıcı balmlar kullanın ve haftada bir peeling yapın.\n5. Bol Su İçin: Cildin nem dengesini korumak için içeriden de desteklemek gerekir. Günde en az 2 litre su tüketmeye özen gösterin.",
    date: "15 Şubat 2025",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    gallery: [
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop"
    ]
  },
  {
    id: 3,
    title: "Doğru Fondöten Seçimi",
    excerpt: "Cilt alt tonunuza göre en doğru fondöteni nasıl seçersiniz?",
    content: "Makyajın en önemli adımı kusursuz bir ten makyajıdır. Ancak yanlış fondöten seçimi tüm makyajı bozabilir. Doğru fondöteni seçmek için öncelikle cilt alt tonunuzu belirlemelisiniz.\n\n- Soğuk (Cool) Alt Ton: Damarlarınız mavi veya mor görünüyorsa, pembe alt tonlu fondötenler size uygundur.\n- Sıcak (Warm) Alt Ton: Damarlarınız yeşil görünüyorsa, sarı veya altın alt tonlu fondötenleri tercih etmelisiniz.\n- Nötr (Neutral) Alt Ton: Damarlarınız hem yeşil hem mavi görünüyorsa şanslısınız, bej tonları size çok yakışacaktır.\n\nAyrıca fondöten denerken el bileğinizde değil, boynunuz ile çene hattınızın birleştiği noktada deneme yapmalısınız. Doğru renk, cildinizde kaybolup giden renktir.",
    date: "20 Ocak 2025",
    image: "https://images.unsplash.com/photo-1631730486784-5456119f69ae?q=80&w=2075&auto=format&fit=crop",
    gallery: [
         "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop"
    ]
  }
];

export const RETURN_POLICIES = {
  tr: `**İade ve Geri Ödeme Politikası (Widerrufsrecht)**
Almanya Tüketici Yasaları ve Hijyen Yönetmeliğine (BGB) Uygundur.

**1. Cayma Hakkı (Widerrufsrecht)**
Siparişinizi teslim aldığınız tarihten itibaren **14 gün** içinde, herhangi bir gerekçe göstermeksizin sözleşmeden cayma hakkına sahipsiniz.

**2. Kozmetik Ürünlerinde Hijyen İstisnası (§ 312g Abs. 2 Nr. 3 BGB)**
Lütfen dikkat ediniz: Sağlık koruması ve hijyen nedenleriyle, **mühürlü/ambalajlı teslim edilen ve teslimattan sonra mührü/ambalajı açılmış kozmetik ürünler (ruj, krem, serum vb.) iade edilemez.**
Ürünün orijinal jelatini, koruma bandı veya kapağı açılmış ise, yasa gereği iade hakkı geçersiz olur.

**3. İade Süreci**
- İade etmek istediğiniz ürün, **açılmamış ve orijinal ambalajında** olmalıdır.
- Yandaki formu doldurarak veya müşteri hizmetlerimizle iletişime geçerek iade talebi oluşturunuz.
- Onaylanan iadeler için size bir iade adresi iletilecektir.
- Yasal düzenlemeler gereği, ürün kusurlu (defolu) olmadığı sürece **iade kargo ücreti müşteriye aittir.**

**4. Geri Ödeme**
İade edilen ürün depomuza ulaşıp "açılmamış" olduğu doğrulandıktan sonra, ödemeniz 14 gün içinde orijinal ödeme yönteminizle (Banka Havalesi vb.) iade edilecektir.`,

  de: `**Widerrufsbelehrung & Rückgaberichtlinien**
Gemäß BGB und Hygienevorschriften (§ 312g Abs. 2 Nr. 3 BGB).

**1. Widerrufsrecht**
Sie haben das Recht, binnen **14 Tagen** ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.

**2. Ausschluss des Widerrufsrechts (Hygiene)**
Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre **Versiegelung nach der Lieferung entfernt wurde** (z.B. Lippenstifte, Cremes, Seren).

**3. Rücksendung**
- Die Ware muss **ungeöffnet und originalverpackt** sein.
- Bitte füllen Sie das nebenstehende Formular aus.
- Die unmittelbaren Kosten der Rücksendung der Waren tragen Sie, sofern die Ware nicht defekt geliefert wurde.

**4. Rückerstattung**
Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.`,

  en: `**Return & Refund Policy (Right of Withdrawal)**
Compliant with German Consumer Laws (BGB) and Hygiene Regulations.

**1. Right of Withdrawal**
You have the right to withdraw from this contract within **14 days** without giving any reason.

**2. Hygiene Exception (§ 312g Abs. 2 Nr. 3 BGB)**
Please note: For reasons of health protection and hygiene, **sealed cosmetic products (lipsticks, creams, etc.) cannot be returned if the seal or packaging has been opened after delivery.**
If the original seal/wrapping is broken, the right of return is void.

**3. Return Process**
- The item must be **unopened and in original packaging**.
- Fill out the form to request a return.
- The customer bears the direct cost of returning the goods unless the item was defective.

**4. Refund**
Once we receive and verify the returned item (unopened), we will refund the payment within 14 days using the original payment method.`
};