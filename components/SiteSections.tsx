







import React, { useState } from 'react';
import { TranslationStructure, Service, Product, BlogPost, ReturnRequest, Appointment } from '../types';
import { Star, ShoppingBag, Calendar, Clock, Instagram, Mail, ArrowRight, User, Package, Phone, RefreshCw, ChevronLeft, Image, Share2 } from 'lucide-react';

// --- Services Component ---
interface ServicesProps {
  t: TranslationStructure['sections'];
  services: Service[];
  onServiceClick?: (id: number) => void;
}
export const ServicesSection: React.FC<ServicesProps> = ({ t, services, onServiceClick }) => (
  <div className="py-16 max-w-7xl mx-auto px-4">
    <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow">{t.servicesTitle}</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service) => (
        <div 
            key={service.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition cursor-pointer"
            onClick={() => onServiceClick && onServiceClick(service.id)}
        >
          <div className="h-48 overflow-hidden">
             <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
          </div>
          <div className="p-6">
            <h3 className="font-serif text-xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
            <button className="text-brand-dark font-bold text-sm border-b border-brand-gold pb-1 hover:text-brand-gold transition">{t.readMore}</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Service Detail Component ---
interface ServiceDetailProps {
    service: Service;
    onBack: () => void;
    onBookNow: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onBookNow }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header / Hero */}
            <div className="relative h-[50vh]">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6">
                    <button 
                        onClick={onBack}
                        className="self-start bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white hover:text-black transition"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <div className="max-w-7xl mx-auto w-full">
                        <h1 className="text-4xl md:text-6xl font-serif text-white gold-text-shadow mb-4">{service.title}</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Description Column */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold mb-4 text-brand-dark">Hizmet Detayları</h2>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                {service.longDescription || service.description}
                            </p>
                        </div>

                        {/* Gallery Grid */}
                        {service.gallery && service.gallery.length > 0 && (
                            <div>
                                <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                    <Image className="text-brand-gold" /> Galeri
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {service.gallery.map((img, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition aspect-square bg-gray-100">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24">
                            <h3 className="font-serif text-xl font-bold mb-4">Randevu Al</h3>
                            <p className="text-gray-500 text-sm mb-6">Bu hizmet için hemen yerinizi ayırtın. Profesyonel dokunuşlarla güzelliğinizi ortaya çıkarın.</p>
                            <button 
                                onClick={onBookNow}
                                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition shadow-lg"
                            >
                                Rezervasyon Yap
                            </button>
                            <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-400">
                                <p className="mb-2 flex items-center gap-2"><Clock size={14} /> 7/24 Online Randevu</p>
                                <p className="flex items-center gap-2"><Phone size={14} /> Destek için bize ulaşın</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Products Component ---
interface ProductsProps {
  t: TranslationStructure['sections'];
  products: Product[];
  addToCart: (product: Product) => void;
  onRate: (productId: number, rating: number) => void;
  onReturnClick: () => void;
}
export const ProductsSection: React.FC<ProductsProps> = ({ t, products, addToCart, onRate, onReturnClick }) => (
  <div className="py-16 max-w-7xl mx-auto px-4 bg-white">
    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
      <h2 className="text-4xl font-serif text-center md:text-left gold-text-shadow">{t.productsTitle}</h2>
      <button 
        onClick={onReturnClick}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:text-brand-dark hover:border-brand-gold transition"
      >
        <RefreshCw size={16} />
        {t.returnBtn}
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-10">
      {products.map((product) => (
        <div key={product.id} className="border border-gray-100 rounded-lg p-4 group">
          <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden relative">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             <button 
                onClick={() => addToCart(product)}
                className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0 hover:bg-brand-gold"
             >
               <ShoppingBag size={20} />
             </button>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <span className="font-serif font-bold text-lg text-brand-gold">{product.price}</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">{product.description}</p>
          
          {/* Order & Review Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 border-b border-gray-50 pb-2">
             <span className="flex items-center gap-1" title="Total Orders">
               <Package size={14} className="text-gray-300" /> {product.orderCount}
             </span>
             <span className="flex items-center gap-1" title="Total Ratings">
               <User size={14} className="text-gray-300" /> {product.voteCount}
             </span>
          </div>

          {/* Interactive Rating System */}
          <div className="flex items-center gap-1 mb-4">
             {[1, 2, 3, 4, 5].map((star) => (
               <button
                 key={star}
                 onClick={() => onRate(product.id, star)}
                 className="focus:outline-none transition transform hover:scale-110 active:scale-90"
               >
                 <Star 
                    size={16} 
                    fill={star <= Math.round(product.rating) ? "#FACC15" : "none"} 
                    strokeWidth={1.5}
                    className={star <= Math.round(product.rating) ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}
                 />
               </button>
             ))}
             <span className="text-gray-400 text-xs ml-2">({product.rating.toFixed(1)})</span>
          </div>

          <button 
             onClick={() => addToCart(product)}
             className="w-full bg-gray-900 text-white py-2 rounded text-sm hover:bg-brand-gold transition flex items-center justify-center gap-2"
          >
             <ShoppingBag size={14} />
             {t.buyBtn}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- Booking Component ---
interface BookingProps {
  t: TranslationStructure['sections'];
  onBook?: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => boolean;
}
export const BookingSection: React.FC<BookingProps> = ({ t, onBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '10:00',
    service: t.bookServiceOptions.bridal // Default service
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBook) {
      onBook(formData);
      alert(t.bookFormSuccess);
      // Reset form
      setFormData({ ...formData, name: '', phone: '', date: '' });
    }
  };

  return (
    <div className="py-16 max-w-3xl mx-auto px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-serif text-center mb-8">{t.bookTitle}</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormName}</label>
               <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 rounded border-gray-200" 
                  placeholder={t.bookFormNamePlaceholder} 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
             </div>
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormPhone}</label>
               <div className="relative">
                 <input 
                    type="tel" 
                    className="w-full p-3 pl-10 bg-gray-50 rounded border-gray-200" 
                    placeholder="+90 ..." 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
                 <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
               </div>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormDate}</label>
               <div className="relative">
                 <input 
                    type="date" 
                    className="w-full p-3 bg-gray-50 rounded border-gray-200" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                 />
                 <Calendar className="absolute right-3 top-3 text-gray-400" size={18} />
               </div>
             </div>
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormTime}</label>
               <div className="relative">
                 <select 
                    className="w-full p-3 bg-gray-50 rounded border-gray-200 appearance-none"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                 >
                   <option>10:00</option>
                   <option>11:00</option>
                   <option>12:00</option>
                   <option>13:00</option>
                   <option>14:00</option>
                   <option>15:00</option>
                   <option>16:00</option>
                   <option>17:00</option>
                 </select>
                 <Clock className="absolute right-3 top-3 text-gray-400" size={18} />
               </div>
             </div>
          </div>

          <div>
             <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormService}</label>
             <select 
                className="w-full p-3 bg-gray-50 rounded border-gray-200"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
             >
               <option value={t.bookServiceOptions.bridal}>{t.bookServiceOptions.bridal}</option>
               <option value={t.bookServiceOptions.special}>{t.bookServiceOptions.special}</option>
               <option value={t.bookServiceOptions.skincare}>{t.bookServiceOptions.skincare}</option>
               <option value={t.bookServiceOptions.brows}>{t.bookServiceOptions.brows}</option>
             </select>
          </div>

          <button type="submit" className="w-full bg-brand-gold hover:bg-black hover:text-white transition text-white font-bold py-4 rounded-lg uppercase tracking-widest">
            {t.bookBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Blog Component ---
interface BlogProps {
  t: TranslationStructure['sections'];
  posts: BlogPost[];
  onPostClick?: (id: number) => void;
}
export const BlogSection: React.FC<BlogProps> = ({ t, posts, onPostClick }) => (
  <div className="py-16 max-w-6xl mx-auto px-4">
    <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow">{t.blogTitle}</h2>
    <div className="grid md:grid-cols-3 gap-8">
       {posts.map(post => (
         <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => onPostClick && onPostClick(post.id)}>
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover hover:scale-105 transition duration-500" />
            <div className="p-6">
               <span className="text-xs text-brand-gold font-bold uppercase tracking-wider">{post.date}</span>
               <h3 className="font-serif text-xl mt-2 mb-3 leading-tight">{post.title}</h3>
               <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
               <button className="flex items-center gap-2 text-sm font-bold hover:text-brand-gold transition">
                 {t.readMore} <ArrowRight size={14} />
               </button>
            </div>
         </div>
       ))}
    </div>
  </div>
);

// --- Blog Detail Component ---
interface BlogDetailProps {
    post: BlogPost;
    onBack: () => void;
}
export const BlogDetail: React.FC<BlogDetailProps> = ({ post, onBack }) => {
    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="relative h-[40vh] md:h-[50vh]">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6 md:p-12">
                   <div className="max-w-4xl mx-auto w-full">
                       <button onClick={onBack} className="text-white/80 hover:text-white mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full w-fit">
                           <ChevronLeft size={16} /> Geri Dön
                       </button>
                       <span className="text-brand-gold font-bold uppercase tracking-wider text-sm bg-black/50 px-3 py-1 rounded mb-2 inline-block">{post.date}</span>
                       <h1 className="text-3xl md:text-5xl font-serif text-white leading-tight">{post.title}</h1>
                   </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="prose prose-lg prose-slate mx-auto">
                    <p className="text-xl text-gray-500 font-serif italic mb-8 border-l-4 border-brand-gold pl-4">
                        {post.excerpt}
                    </p>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                        {post.content || post.excerpt}
                    </div>
                </div>
                
                {/* Gallery */}
                {post.gallery && post.gallery.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                             <Image size={24} className="text-brand-gold" /> Galeri
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {post.gallery.map((img, idx) => (
                                <div key={idx} className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-auto object-cover hover:scale-105 transition duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-12 flex justify-center">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-brand-dark transition text-sm font-bold uppercase tracking-widest">
                        <Share2 size={16} /> Paylaş
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- About Component ---
interface AboutProps {
  t: TranslationStructure['sections'];
  image: string;
  text: string;
}
export const AboutSection: React.FC<AboutProps> = ({ t, image, text }) => (
  <div className="py-16 max-w-7xl mx-auto px-4">
     <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
           <div className="absolute top-4 left-4 w-full h-full border-2 border-brand-gold rounded-lg -z-10"></div>
           <img src={image} alt={image} className="w-full h-auto rounded-lg shadow-xl" />
        </div>
        <div>
           <h2 className="text-4xl font-serif mb-6">{t.aboutTitle}</h2>
           <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
             {text}
           </p>
           <ul className="space-y-4 mb-8">
             {t.aboutRoles.map((role, index) => (
               <li key={index} className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                 <span className="font-bold">{role}</span>
               </li>
             ))}
           </ul>
           <div className="flex gap-4">
              <a href="#" className="p-3 bg-black text-white rounded-full hover:bg-brand-gold transition"><Instagram size={20} /></a>
              <a href="#" className="p-3 bg-black text-white rounded-full hover:bg-brand-gold transition"><Mail size={20} /></a>
           </div>
        </div>
     </div>
  </div>
);

// --- Returns Component ---
interface ReturnsProps {
  t: TranslationStructure['returns'];
  policyText: string;
  onRequestSubmit: (request: ReturnRequest) => void;
}
export const ReturnsSection: React.FC<ReturnsProps> = ({ t, policyText, onRequestSubmit }) => {
  const [orderId, setOrderId] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [reason, setReason] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSubmit({
      orderId: parseInt(orderId),
      email,
      reason
    });
  };

  return (
    <div className="py-16 max-w-4xl mx-auto px-4">
      <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow">{t.title}</h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <RefreshCw className="text-brand-gold" /> {t.policyTitle}
          </h3>
          <div className="prose prose-sm text-gray-600 whitespace-pre-line">
            {policyText}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
           <h3 className="font-bold text-xl mb-6">{t.formTitle}</h3>
           <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.orderId}</label>
                <input 
                  type="number" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-brand-gold outline-none" 
                  placeholder={t.placeholderId}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.email}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-brand-gold outline-none" 
                  placeholder={t.placeholderEmail}
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.reason}</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:border-brand-gold outline-none h-32 resize-none" 
                  placeholder={t.placeholderReason}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition"
              >
                {t.submitBtn}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
};