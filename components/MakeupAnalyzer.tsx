


import React, { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, Sparkles, Check, Lock, Unlock, CheckCircle, ShoppingBag, Clock, Sun, Moon, Palette, Wrench, Activity, AlertTriangle, Layers, Scale, Eye } from 'lucide-react';
import { TranslationStructure, AnalysisResult, LanguageCode, PaymentConfig } from '../types';
import { analyzeFace } from '../services/geminiService';
import { PaymentModal } from './PaymentModal';

interface MakeupAnalyzerProps {
  t: TranslationStructure['app'];
  paymentT: TranslationStructure['payment'];
  lang: LanguageCode;
  paymentConfig: PaymentConfig;
}

export const MakeupAnalyzer: React.FC<MakeupAnalyzerProps> = ({ t, paymentT, lang, paymentConfig }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Cache results by language to avoid re-fetching when switching back and forth
  const [resultsCache, setResultsCache] = useState<Record<string, AnalysisResult>>({});
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const [paletteVariant, setPaletteVariant] = useState<'a' | 'b'>('a');
  
  const [isPremium, setIsPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paid = localStorage.getItem('shenay_premium');
    if (paid) setIsPremium(true);
  }, []);

  // Language Synchronization Effect
  useEffect(() => {
    // Only proceed if we have an image and have successfully analyzed at least once
    if (!image || !hasAnalyzed) return;

    // If we already have the result for the selected language in cache, use it
    if (resultsCache[lang]) {
        if (result !== resultsCache[lang]) {
            setResult(resultsCache[lang]);
        }
    } else {
        // Otherwise, fetch translation/analysis for the new language
        const fetchTranslation = async () => {
            setLoading(true);
            try {
                const data = await analyzeFace(image, lang);
                if (!data.error) {
                    setResult(data);
                    setResultsCache(prev => ({ ...prev, [lang]: data }));
                }
            } catch (e) {
                console.error("Language sync error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTranslation();
    }
  }, [lang, image, hasAnalyzed, resultsCache, result]);

  const resizeImage = (file: File, maxWidth: number = 800): Promise<string> => {
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
                if (!ctx) { reject(new Error("Canvas error")); return; }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const resizedBase64 = await resizeImage(e.target.files[0]);
        setImage(resizedBase64);
        setResult(null);
        setResultsCache({}); // Clear cache on new image
        setHasAnalyzed(false);
        setError(null);
      } catch (err) {
        setError("Error processing image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    
    // Check cache first
    if (resultsCache[lang]) {
        setResult(resultsCache[lang]);
        setHasAnalyzed(true);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFace(image, lang);
      if (data.error) {
          setError(data.error);
      } else {
          setResult(data);
          setResultsCache(prev => ({ ...prev, [lang]: data }));
          setHasAnalyzed(true);
          setTimeout(() => {
              resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
      }
    } catch (err) {
      setError("Analiz hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    localStorage.setItem('shenay_premium', 'true');
    setIsPremium(true);
    setShowPayment(false);
  };

  // Safe access with optional chaining to prevent undefined error
  const activePalette = paletteVariant === 'a' ? result?.palette?.option_a : result?.palette?.option_b;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {showPayment && (
        <PaymentModal 
          t={paymentT} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
          config={paymentConfig}
          customTitle={t.premiumRequired}
          customDescription={paymentT.description}
        />
      )}

      <div className="text-center mb-10">
        <h2 className="text-5xl font-serif mb-4 text-brand-dark gold-text-shadow">{t.title}</h2>
        <p className="text-gray-600 max-w-lg mx-auto italic">{t.subtitle}</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-rose/20 rounded-full text-brand-dark text-sm font-semibold">
          {isPremium ? <span className="flex items-center gap-1 text-green-700"><Check size={16} /> Premium Access</span> : <span className="text-brand-dark flex items-center gap-1"><Sparkles size={14} className="text-brand-gold" /> Free Preview</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Upload Area */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
            {image ? (
              <>
                <img src={image} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="reupload" />
              </>
            ) : (
              <div className="text-center p-6 pointer-events-none">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Camera size={32} />
                </div>
                <p className="text-gray-500 mb-4">{t.upload}</p>
              </div>
            )}
            {!image && <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />}
          </div>
          <div className="mt-6 flex gap-3">
             {image && <label htmlFor="reupload" className="flex-1 py-4 border border-gray-200 rounded-lg text-gray-500 font-bold text-center cursor-pointer hover:bg-gray-50 transition">Change Photo</label>}
            <button
              onClick={startAnalysis}
              disabled={!image || loading}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${!image || loading ? 'bg-gray-200 text-gray-400' : 'bg-brand-dark text-white hover:bg-brand-gold hover:text-black shadow-lg hover:shadow-xl'}`}
            >
              {loading ? <><Loader2 className="animate-spin" /> {t.analyzing}</> : <><Sparkles size={20} /> Analyze</>}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
        </div>

        {/* Results Area */}
        <div className="space-y-6" ref={resultsRef}>
          {result ? (
            <div className="animate-fade-in space-y-6">
              
              {/* FREE SECTION: Your Face Profile */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">{t.freeSummary}</div>
                 <h3 className="font-serif text-2xl mb-4 text-brand-dark flex items-center gap-2"><CheckCircle size={24} className="text-green-600" /> {t.summaryTitle}</h3>
                 
                 {/* Face Profile Content */}
                 <div className="bg-white/70 rounded-xl p-4 mb-4 border border-green-100 shadow-sm">
                    <p className="text-lg text-gray-800 leading-relaxed italic">"{result.summary}"</p>
                 </div>
                 
                 {/* Technical Analysis Grid (Free) */}
                 <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-white/60 p-3 rounded-xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">{t.faceShape}</div>
                        <div className="font-serif font-bold text-brand-dark text-lg flex items-center gap-1">
                            <Activity size={16} className="text-blue-500" />
                            {result.numeric_metrics?.face_shape || "Oval"}
                        </div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">{t.skinTone}</div>
                        <div className="font-serif font-bold text-brand-dark text-lg flex items-center gap-1">
                            <Layers size={16} className="text-brand-rose" />
                            {result.numeric_metrics?.skin_undertone || "Neutral"}
                        </div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">{t.symmetry}</div>
                        <div className="font-serif font-bold text-brand-dark text-lg flex items-center gap-1">
                            <Scale size={16} className="text-green-600" />
                            {result.numeric_metrics?.face_symmetry_score ? `%${Math.round(result.numeric_metrics.face_symmetry_score * 100)}` : "%98"}
                        </div>
                    </div>
                    <div className="bg-white/60 p-3 rounded-xl border border-white shadow-sm flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-wider">{t.eyeShape}</div>
                        <div className="font-serif font-bold text-brand-dark text-lg flex items-center gap-1">
                            <Eye size={16} className="text-purple-500" />
                            {result.numeric_metrics?.eye_opening_ratio ? (parseFloat(result.numeric_metrics.eye_opening_ratio) > 0.35 ? "Large" : "Almond") : "Standard"}
                        </div>
                    </div>
                 </div>

                 {result.debug_info?.warnings && result.debug_info.warnings.length > 0 && (
                     <div className="mt-4 flex flex-wrap gap-2">
                        {result.debug_info.warnings.map((w, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded">
                                <AlertTriangle size={12} /> {w}
                            </div>
                        ))}
                     </div>
                 )}
              </div>

              {/* PREMIUM SECTION (LOCKED) */}
              <div className="relative mt-8 group min-h-[400px]">
                 {!isPremium && (
                   <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center rounded-2xl border-2 border-brand-gold/20 shadow-lg animate-fade-in">
                      <div className="text-center p-6 bg-white/95 rounded-2xl shadow-2xl max-w-sm border border-gray-100">
                        <div className="w-16 h-16 bg-brand-gold/20 text-brand-dark rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={32} /></div>
                        <h4 className="text-2xl font-serif mb-2 font-bold">{t.premiumRequired}</h4>
                        <p className="text-sm text-gray-500 mb-6 px-2">{paymentT.description}</p>
                        <button onClick={() => setShowPayment(true)} className="w-full bg-brand-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-brand-gold hover:text-black transition transform hover:-translate-y-1">
                            <Unlock size={20} /> {t.unlockPremium}
                        </button>
                        <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t.premiumPrice} • {paymentT.secure}</div>
                      </div>
                   </div>
                 )}

                 <div className={`space-y-6 transition-all duration-700 ${!isPremium ? 'opacity-30 select-none filter blur-[5px] grayscale' : 'opacity-100'}`}>
                    
                    {/* Palette A/B Switcher */}
                    {activePalette && (
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="font-serif text-xl flex items-center gap-2"><Palette size={20} className="text-brand-gold" /> {t.paletteTitle}</h4>
                              {result?.palette?.option_b && (
                                  <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                                      <button onClick={() => setPaletteVariant('a')} className={`px-3 py-1 rounded transition ${paletteVariant === 'a' ? 'bg-white shadow font-bold text-brand-dark' : 'text-gray-500'}`}>{t.option} A</button>
                                      <button onClick={() => setPaletteVariant('b')} className={`px-3 py-1 rounded transition ${paletteVariant === 'b' ? 'bg-white shadow font-bold text-brand-dark' : 'text-gray-500'}`}>{t.option} B</button>
                                  </div>
                              )}
                          </div>
                          <div className="mb-2 text-sm text-gray-500 font-bold">{activePalette.style_name}</div>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                              {activePalette.colors.map((p, i) => (
                                  <div key={i} className="flex flex-col items-center text-center">
                                      <div className="w-12 h-12 rounded-full shadow-md border-2 border-white mb-2" style={{ backgroundColor: p.hex }}></div>
                                      <span className="text-[10px] font-bold uppercase text-gray-800">{p.role}</span>
                                      <span className="text-[9px] text-gray-500 leading-tight mt-1 hidden md:block">{p.reason}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                    )}

                    {/* Step by Step */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-serif text-xl mb-6 flex items-center gap-2"><CheckCircle size={20} className="text-brand-gold" /> {t.stepsTitle}</h4>
                        <div className="space-y-8 relative border-l-2 border-brand-gold/20 ml-3 pl-8">
                            {result?.steps?.map((step, i) => (
                                <div key={i} className="relative">
                                    <span className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-brand-dark text-brand-gold flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">{step.step}</span>
                                    <h5 className="font-bold text-lg mb-1">{step.title}</h5>
                                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold flex items-center gap-1"><ShoppingBag size={10} /> {step.product}</span>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Wrench size={10} /> {step.tool}</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">{step.intensity}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{t.technique}: {step.technique}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day / Night & Fixes */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-brand-dark text-white p-6 rounded-xl">
                            <h4 className="font-serif text-xl mb-4 text-brand-gold">{t.dayNightTitle}</h4>
                            <div className="space-y-4">
                                <div><div className="flex items-center gap-2 font-bold text-sm text-brand-gold mb-1"><Sun size={14} /> {t.day}</div><p className="text-gray-300 text-sm">{result?.variants?.day}</p></div>
                                <div className="border-t border-gray-700 pt-4"><div className="flex items-center gap-2 font-bold text-sm text-brand-gold mb-1"><Moon size={14} /> {t.night}</div><p className="text-gray-300 text-sm">{result?.variants?.night}</p></div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col">
                            <h4 className="font-serif text-xl mb-4">{t.proFixes}</h4>
                            {result?.fix_tips && result.fix_tips.length > 0 ? (
                                <ul className="space-y-3 flex-1">
                                    {result.fix_tips.map((tip, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600"><Sparkles size={14} className="text-brand-gold mt-1 flex-shrink-0" /> {tip}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-6 bg-gray-50 rounded-lg text-sm text-gray-500 italic flex-1 flex items-center justify-center text-center">
                                    <p className="flex items-center gap-2"><Sparkles size={16} className="text-brand-gold" /> {t.defaultFixes}</p>
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400 font-bold uppercase"><Clock size={12} /> {t.time}: {result?.estimated_time_minutes} {t.minutes}</div>
                        </div>
                    </div>
                    
                    {/* Products */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-serif text-xl mb-4">{t.productsTitle}</h4>
                        {result?.products && result.products.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                              {result?.products?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded shadow-sm border border-gray-100">
                                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                                      <span className="text-sm text-gray-600 font-medium">{item}</span>
                                  </div>
                              ))}
                          </div>
                        ) : (
                           <div className="text-center p-8 text-gray-400 italic bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                              <ShoppingBag size={32} className="mx-auto mb-3 opacity-30 text-gray-400" />
                              <p className="text-sm font-medium">{t.emptyProducts}</p>
                           </div>
                        )}
                    </div>

                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-2xl bg-white/50 min-h-[400px]">
              <Sparkles size={48} className="mb-4 text-brand-rose mx-auto animate-pulse" />
              <p className="text-center font-light font-serif text-xl text-gray-500 max-w-md mx-auto">"Advanced AI Analysis requires a clear, well-lit photo."</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};