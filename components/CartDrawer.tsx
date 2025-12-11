import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, User, Phone, MapPin, Mail, ChevronLeft } from 'lucide-react';
import { CartItem, TranslationStructure, CustomerDetails } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onCheckout: (details: CustomerDetails) => void;
  t: TranslationStructure['cart'];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQuantity,
  onCheckout,
  t 
}) => {
  
  // Checkout Form State
  const [step, setStep] = useState<'cart' | 'details'>('cart');
  const [details, setDetails] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const [attemptedCheckout, setAttemptedCheckout] = useState(false);

  // Helper to parse price string like "€25.00" to number
  const parsePrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  const total = items.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = details.fullName && details.phone && details.address && details.city;

  const handleProceed = () => {
    setAttemptedCheckout(true);
    if(isFormValid) {
        onCheckout(details);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            {step === 'details' && (
                <button onClick={() => setStep('cart')} className="mr-2 text-gray-500 hover:text-black">
                    <ChevronLeft size={24} />
                </button>
            )}
            <h2 className="text-xl md:text-2xl font-serif font-bold flex items-center gap-2">
                {step === 'cart' && <ShoppingBag className="text-brand-gold" />}
                {step === 'cart' ? t.title : t.shippingTitle}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content based on Step */}
        {step === 'cart' ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-70">
                <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
                <p className="text-lg font-serif">{t.empty}</p>
                </div>
            ) : (
                items.map(item => (
                <div key={item.id} className="flex gap-4 items-center animate-fade-in bg-white p-2 rounded-lg border border-transparent hover:border-gray-100 transition">
                    <div className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-brand-dark text-sm leading-tight mb-1">{item.name}</h3>
                        <p className="text-brand-gold font-bold text-sm">{item.price}</p>
                        <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md">
                            <button 
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-500"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-500"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        </div>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition p-2">
                        <Trash2 size={18} />
                    </button>
                </div>
                ))
            )}
            </div>
        ) : (
            // Customer Details Form
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {t.shippingDesc}
                </p>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className={`border rounded-lg p-3 flex items-center gap-3 transition ${attemptedCheckout && !details.fullName ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold'}`}>
                        <User size={18} className="text-gray-400" />
                        <input 
                            name="fullName" 
                            placeholder={t.formName} 
                            value={details.fullName} 
                            onChange={handleDetailsChange} 
                            className="w-full outline-none text-sm bg-transparent" 
                            autoComplete="name"
                        />
                    </div>
                    <div className={`border rounded-lg p-3 flex items-center gap-3 transition ${attemptedCheckout && !details.phone ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold'}`}>
                        <Phone size={18} className="text-gray-400" />
                        <input 
                            name="phone" 
                            placeholder={t.formPhone} 
                            value={details.phone} 
                            onChange={handleDetailsChange} 
                            className="w-full outline-none text-sm bg-transparent" 
                            autoComplete="tel"
                            type="tel"
                        />
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold transition">
                        <Mail size={18} className="text-gray-400" />
                        <input 
                            name="email" 
                            placeholder={t.formEmail} 
                            value={details.email} 
                            onChange={handleDetailsChange} 
                            className="w-full outline-none text-sm bg-transparent" 
                            autoComplete="email"
                            type="email"
                        />
                    </div>
                    <div className={`border rounded-lg p-3 flex items-center gap-3 transition ${attemptedCheckout && !details.address ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200 focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold'}`}>
                        <MapPin size={18} className="text-gray-400" />
                        <input 
                            name="address" 
                            placeholder={t.formAddress} 
                            value={details.address} 
                            onChange={handleDetailsChange} 
                            className="w-full outline-none text-sm bg-transparent" 
                            autoComplete="street-address"
                        />
                    </div>
                    <div className="flex gap-4">
                        <input 
                            name="city" 
                            placeholder={t.formCity} 
                            value={details.city} 
                            onChange={handleDetailsChange} 
                            className={`w-1/2 border rounded-lg p-3 outline-none text-sm transition ${attemptedCheckout && !details.city ? 'border-red-400' : 'border-gray-200 focus:border-brand-gold'}`} 
                        />
                        <input 
                            name="zipCode" 
                            placeholder={t.formZip} 
                            value={details.zipCode} 
                            onChange={handleDetailsChange} 
                            className="w-1/2 border border-gray-200 rounded-lg p-3 outline-none text-sm focus:border-brand-gold transition" 
                        />
                    </div>
                </form>
            </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
             <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">{t.total}</span>
                <span className="text-2xl font-serif font-bold text-brand-dark">€{total.toFixed(2)}</span>
             </div>
             
             {step === 'cart' ? (
                <button 
                    onClick={() => setStep('details')}
                    className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-black transition shadow-lg flex items-center justify-center gap-2 group"
                >
                    {t.proceed} <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </button>
             ) : (
                <div className="flex gap-3">
                    <button 
                        onClick={handleProceed}
                        className={`w-full flex-1 py-4 rounded-xl font-bold uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 group ${isFormValid ? 'bg-brand-gold text-white hover:bg-black' : 'bg-gray-300 text-gray-500 hover:bg-gray-400'}`}
                    >
                        {t.checkout} <ArrowRight size={18} />
                    </button>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};