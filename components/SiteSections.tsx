import React, { useState } from 'react';
import { TranslationStructure, Service, Product, BlogPost, ReturnRequest, Appointment, GalleryItem, SiteConfig, Testimonial, TeamMember } from '../types';
import { Star, ShoppingBag, Calendar, Clock, Instagram, Mail, ArrowRight, User, Package, Phone, RefreshCw, ChevronLeft, Image, Share2, ZoomIn, MapPin, X, Quote } from 'lucide-react';

// --- Services Component ---
interface ServicesProps {
  t: TranslationStructure['sections'];
  services: Service[];
  onServiceClick?: (id: number) => void;
}
export const ServicesSection: React.FC<ServicesProps> = ({ t, services, onServiceClick }) => (
  <div className="py-20 max-w-7xl mx-auto px-4 bg-rose-50/30">
    <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow text-brand-dark">{t.servicesTitle}</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service) => (
        <div 
            key={service.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition cursor-pointer transform hover:-translate-y-2 duration-300"
            onClick={() => onServiceClick && onServiceClick(service.id)}
        >
          <div className="h-64 overflow-hidden relative">
             <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white border border-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">{t.readMore}</span>
             </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="font-serif text-xl font-bold mb-2 text-brand-dark">{service.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
            {service.price && <p className="text-brand-gold font-bold font-serif">{service.price}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Testimonials Section ---
interface TestimonialsProps {
    t: TranslationStructure['sections'];
    testimonials: Testimonial[];
}
export const TestimonialsSection: React.FC<TestimonialsProps> = ({ t, testimonials }) => (
    <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-serif text-center mb-16 gold-text-shadow text-brand-dark">{t.testimonialsTitle || "Müşterilerimiz Ne Diyor?"}</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testi) => (
                    <div key={testi.id} className="bg-gray-50 p-8 rounded-2xl relative border border-gray-100 shadow-sm hover:shadow-lg transition">
                        <Quote className="absolute top-6 left-6 text-brand-gold opacity-30" size={40} />
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md mb-4">
                                <img src={testi.image || "https://placehold.co/100"} alt={testi.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-gray-600 italic mb-6 leading-relaxed">"{testi.quote}"</p>
                            <h4 className="font-bold text-brand-dark font-serif">{testi.name}</h4>
                            <div className="flex gap-1 mt-2 justify-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < testi.rating ? "#D4AF37" : "none"} className={i < testi.rating ? "text-brand-gold" : "text-gray-300"} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Team Section ---
interface TeamProps {
    t: TranslationStructure['sections'];
    team: TeamMember[];
}
export const TeamSection: React.FC<TeamProps> = ({ t, team }) => (
    <div className="py-20 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-makeup-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-serif text-center mb-16 text-brand-gold">{t.teamTitle || "Ekibimizle Tanışın"}</h2>
            <div className="grid md:grid-cols-3 gap-10">
                {team.map((member) => (
                    <div key={member.id} className="group text-center">
                        <div className="relative overflow-hidden rounded-xl mb-6 aspect-[3/4] border border-gray-800">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 grayscale group-hover:grayscale-0" />
                            {member.instagram && (
                                <div className="absolute bottom-4 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <a href={member.instagram} target="_blank" rel="noreferrer" className="bg-white/90 text-black p-2 rounded-full hover:bg-brand-gold hover:text-white transition">
                                        <Instagram size={20} />
                                    </a>
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-brand-gold text-sm uppercase tracking-widest mb-3">{member.role}</p>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto line-clamp-3">{member.bio}</p>
                    </div>
                ))}
            </div>
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
                            {service.price && <div className="mt-4 text-2xl font-bold text-brand-gold font-serif">{service.price}</div>}
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
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 sticky top-24 shadow-lg">
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
  <div className="py-20 max-w-7xl mx-auto px-4 bg-white">
    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
      <h2 className="text-4xl font-serif text-center md:text-left gold-text-shadow text-brand-dark">{t.productsTitle}</h2>
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
        <div key={product.id} className="border border-gray-100 rounded-lg p-4 group hover:shadow-xl transition duration-300">
          <div className="aspect-square bg-gray-50 mb-4 rounded-lg overflow-hidden relative">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
             {product.stock === 0 && <div className="absolute inset-0 bg-white/70 flex items-center justify-center font-bold text-gray-500">STOKTA YOK</div>}
             <button 
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0 hover:bg-brand-gold disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
               <ShoppingBag size={20} />
             </button>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-brand-dark">{product.name}</h3>
            <span className="font-serif font-bold text-lg text-brand-gold">{product.price}</span>
          </div>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
          
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
             disabled={product.stock === 0}
             className="w-full bg-gray-900 text-white py-3 rounded text-sm hover:bg-brand-gold hover:text-black transition flex items-center justify-center gap-2 font-bold disabled:bg-gray-300 disabled:text-gray-500"
          >
             <ShoppingBag size={14} />
             {product.stock === 0 ? 'TÜKENDİ' : t.buyBtn}
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- Booking Component ---
interface BookingProps {
  t: TranslationStructure['sections'];
  onBook?: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
}
export const BookingSection: React.FC<BookingProps> = ({ t, onBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '10:00',
    service: t.bookServiceOptions.bridal,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBook) {
      onBook(formData);
      alert(t.bookFormSuccess);
      // Reset form
      setFormData({ ...formData, name: '', phone: '', date: '', notes: '' });
    }
  };

  return (
    <div className="py-20 max-w-3xl mx-auto px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-3xl font-serif text-center mb-8 text-brand-dark">{t.bookTitle}</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormName}</label>
               <input 
                  type="text" 
                  className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:border-brand-gold focus:bg-white transition outline-none" 
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
                    className="w-full p-4 pl-10 bg-gray-50 rounded-xl border-gray-200 focus:border-brand-gold focus:bg-white transition outline-none" 
                    placeholder="+90 ..." 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                 />
                 <Phone className="absolute left-3 top-4 text-gray-400" size={18} />
               </div>
             </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormDate}</label>
               <div className="relative">
                 <input 
                    type="date" 
                    className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:border-brand-gold focus:bg-white transition outline-none" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                 />
                 <Calendar className="absolute right-3 top-4 text-gray-400" size={18} />
               </div>
             </div>
             <div>
               <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormTime}</label>
               <div className="relative">
                 <select 
                    className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 appearance-none focus:border-brand-gold focus:bg-white transition outline-none"
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
                 <Clock className="absolute right-3 top-4 text-gray-400" size={18} />
               </div>
             </div>
          </div>

          <div>
             <label className="block text-xs uppercase font-bold text-gray-500 mb-2">{t.bookFormService}</label>
             <select 
                className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:border-brand-gold focus:bg-white transition outline-none"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
             >
               <option value={t.bookServiceOptions.bridal}>{t.bookServiceOptions.bridal}</option>
               <option value={t.bookServiceOptions.special}>{t.bookServiceOptions.special}</option>
               <option value={t.bookServiceOptions.skincare}>{t.bookServiceOptions.skincare}</option>
               <option value={t.bookServiceOptions.brows}>{t.bookServiceOptions.brows}</option>
             </select>
          </div>
          
          <div>
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2">Notlar (Opsiyonel)</label>
              <textarea 
                 className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 h-24 resize-none focus:border-brand-gold focus:bg-white transition outline-none"
                 placeholder="Eklemek istedikleriniz..."
                 value={formData.notes}
                 onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
          </div>

          <button type="submit" className="w-full bg-brand-gold hover:bg-black hover:text-white transition text-white font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg">
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
  <div className="py-20 max-w-6xl mx-auto px-4">
    <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow text-brand-dark">{t.blogTitle}</h2>
    <div className="grid md:grid-cols-3 gap-8">
       {posts.map(post => (
         <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => onPostClick && onPostClick(post.id)}>
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover hover:scale-105 transition duration-500" />
            <div className="p-6">
               <span className="text-xs text-brand-gold font-bold uppercase tracking-wider">{post.date}</span>
               <h3 className="font-serif text-xl mt-2 mb-3 leading-tight text-brand-dark">{post.title}</h3>
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
  <div className="py-24 max-w-7xl mx-auto px-4 bg-gradient-to-b from-white to-rose-50/50">
     <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative group">
           <div className="absolute top-4 left-4 w-full h-full border-2 border-brand-gold rounded-lg -z-10 transition group-hover:top-3 group-hover:left-3"></div>
           <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-100 rounded-full -z-20 blur-xl"></div>
           <img src={image} alt="Shenay Ileri" className="w-full h-[600px] object-cover rounded-lg shadow-2xl" />
        </div>
        <div>
           <div className="inline-block bg-brand-gold/10 text-brand-gold px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Professional Artist</div>
           <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight text-brand-dark">{t.aboutTitle}</h2>
           <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line text-lg">
             {text}
           </p>
           <ul className="space-y-4 mb-10">
             {t.aboutRoles.map((role, index) => (
               <li key={index} className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                 <span className="font-bold text-brand-dark">{role}</span>
               </li>
             ))}
           </ul>
           <div className="flex gap-4">
              <a href="#" className="p-3 bg-black text-white rounded-full hover:bg-brand-gold hover:text-black transition transform hover:-translate-y-1"><Instagram size={20} /></a>
              <a href="#" className="p-3 bg-black text-white rounded-full hover:bg-brand-gold hover:text-black transition transform hover:-translate-y-1"><Mail size={20} /></a>
           </div>
        </div>
     </div>
  </div>
);

// --- Gallery Section Component ---
interface GalleryProps {
    t: TranslationStructure['sections'];
    items: GalleryItem[];
}
export const GallerySection: React.FC<GalleryProps> = ({ t, items }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');
    
    // Extract unique categories
    const categories = ['All', ...new Set(items.map(i => i.category || 'Other'))];
    const filteredItems = filter === 'All' ? items : items.filter(i => (i.category || 'Other') === filter);

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-serif text-center mb-4 gold-text-shadow text-brand-dark">{t.galleryTitle}</h2>
                <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">Güzelliğin en doğal ve etkileyici hallerine tanıklık edin. İşte çalışmalarımızdan seçkiler.</p>
                
                {/* Category Filter */}
                <div className="flex justify-center gap-2 mb-10 flex-wrap">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition ${filter === cat ? 'bg-brand-gold text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {filteredItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-xl"
                            onClick={() => setSelectedImage(item.image)}
                        >
                            <img src={item.image} alt={item.caption || "Gallery"} className="w-full h-auto object-cover transition duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                <ZoomIn className="text-white" size={32} />
                            </div>
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <p className="text-white font-serif text-lg">{item.caption}</p>
                                    {item.category && <span className="text-brand-gold text-xs uppercase font-bold">{item.category}</span>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white transition">
                        <X size={40} />
                    </button>
                    <img 
                        src={selectedImage} 
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
                        onClick={(e) => e.stopPropagation()} 
                    />
                </div>
            )}
        </div>
    );
};

// --- Contact Section ---
interface ContactProps {
    t: TranslationStructure['contact'];
    config: SiteConfig;
}

export const ContactSection: React.FC<ContactProps> = ({ t, config }) => {
    return (
        <div className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                    <div className="bg-brand-dark text-white p-12 md:w-2/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-makeup-pattern opacity-10"></div>
                        <h2 className="text-3xl font-serif mb-8 relative z-10">{t.title}</h2>
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start gap-4">
                                <Phone className="text-brand-gold mt-1" />
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">{t.phone}</h4>
                                    <p className="text-lg">{config.contactPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Mail className="text-brand-gold mt-1" />
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">{t.email}</h4>
                                    <p className="text-lg">{config.contactEmail}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-brand-gold mt-1" />
                                <div>
                                    <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">{t.address}</h4>
                                    <p className="text-lg">{config.contactAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Follow Us</h4>
                            <div className="flex gap-4">
                                <a href="https://instagram.com" className="bg-white/10 p-2 rounded-full hover:bg-brand-gold hover:text-black transition"><Instagram size={20} /></a>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 md:w-3/5 flex flex-col justify-center items-center text-center">
                         <h3 className="text-2xl font-serif text-brand-dark mb-6">WhatsApp ile Hızlı İletişim</h3>
                         <p className="text-gray-500 mb-8">Randevu almak veya bilgi sormak için WhatsApp üzerinden bize yazabilirsiniz.</p>
                         <a 
                            href={`https://wa.me/${config.contactPhone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-[#128C7E] transition shadow-lg w-full justify-center"
                         >
                             <Phone size={24} /> {t.whatsapp}
                         </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
      <h2 className="text-4xl font-serif text-center mb-12 gold-text-shadow text-brand-dark">{t.title}</h2>
      
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
