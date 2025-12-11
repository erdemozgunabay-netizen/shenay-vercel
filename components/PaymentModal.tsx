
import React, { useState } from 'react';
import { X, CheckCircle, Building2, Copy, ShieldCheck } from 'lucide-react';
import { TranslationStructure, PaymentConfig } from '../types';

interface PaymentModalProps {
  t: TranslationStructure['payment'];
  onClose: () => void;
  onSuccess: () => void;
  config?: PaymentConfig;
  amount?: string;
  customTitle?: string;
  customDescription?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  t, 
  onClose, 
  onSuccess, 
  config, 
  amount = "€5.00", 
  customTitle,
  customDescription 
}) => {
  const [copied, setCopied] = useState(false);

  const copyIban = () => {
    if (config?.iban) {
        navigator.clipboard.writeText(config.iban);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition z-10 bg-gray-100 p-2 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-brand-dark text-white p-8 text-center relative overflow-hidden flex-shrink-0">
           <div className="absolute top-0 left-0 w-full h-full bg-makeup-pattern opacity-10"></div>
           <div className="relative z-10">
             <h3 className="font-serif text-3xl mb-2 gold-text-shadow">{customTitle || t.title}</h3>
             <p className="text-gray-300 text-sm max-w-xs mx-auto">{customDescription || t.description}</p>
             <div className="mt-4 text-2xl font-bold text-brand-gold">{amount}</div>
           </div>
        </div>

        <div className="p-8 overflow-y-auto">
            <div className="space-y-6 animate-fade-in text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Building2 size={32} />
                </div>
                <h4 className="font-bold text-lg">{t.bankTransferTitle}</h4>
                <p className="text-sm text-gray-500 px-4">{t.bankTransferDesc}</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-3 relative group">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase">Bank Name</span>
                        <span className="font-bold text-brand-dark">{config?.bankName || 'Sparkasse Germany'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase">Account Holder</span>
                        <span className="font-bold text-brand-dark">{config?.accountHolder || 'Shenay Ileri Beauty'}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                        <span className="text-xs font-bold text-gray-400 uppercase block mb-1">IBAN</span>
                        <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-lg text-brand-dark break-all">{config?.iban || 'DE89 3705 0198 0000 1234 56'}</span>
                            <button onClick={copyIban} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500 flex-shrink-0">
                            {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase">SWIFT/BIC</span>
                        <span className="font-mono text-gray-600">{config?.swift || 'SPARKDE33XXX'}</span>
                    </div>
                </div>

                <button
                    onClick={onSuccess} 
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-4"
                >
                    {t.sentButton}
                </button>
            </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition">
             <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                <ShieldCheck size={12} /> {t.secure}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
