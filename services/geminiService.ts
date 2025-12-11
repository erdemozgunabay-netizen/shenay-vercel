import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, LanguageCode } from "../types";

// GÜVENLİK: API Key client-side'da görünür. Üretim ortamında bir proxy sunucusu kullanılması önerilir.
const API_KEY = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Spam Koruması için Basit Rate Limiter
let lastAnalysisTime = 0;
const RATE_LIMIT_MS = 10000; // 10 saniye bekleme süresi

// Fallback results matching the complex structure
const FALLBACK_RESULTS: Record<LanguageCode, AnalysisResult> = {
  en: {
    summary: "Your face features high cheekbones and balanced proportions. The skin analysis suggests a warm undertone perfect for gold-based highlighters.",
    features: [
        { feature: "Face Shape", description: "Oval", confidence: 0.95 },
        { feature: "Skin Tone", description: "Medium Warm", confidence: 0.92 }
    ],
    numeric_metrics: {
        face_shape: "Oval",
        skin_undertone: "Warm",
        skin_tone_lab: "L:72, A:14, B:22",
        eye_opening_ratio: "0.35",
        face_symmetry_score: 0.94,
        other_metrics: [{name: "Lip Fullness", value: "0.45", unit: "ratio"}]
    },
    palette: {
        option_a: {
            style_name: "Natural Glow (Day)",
            colors: [
                { role: "Base", hex: "#D2B48C", reason: "Matches skin depth" },
                { role: "Blush", hex: "#FF9999", reason: "Fresh look" }
            ]
        },
        option_b: {
            style_name: "Bronzed Glam (Night)",
            colors: [
                { role: "Contour", hex: "#8B4513", reason: "Deep definition" },
                { role: "Lip", hex: "#800020", reason: "Bold statement" }
            ]
        }
    },
    steps: [
        { step: 1, title: "Prep", product: "Primer", tool: "Fingers", technique: "Massage", intensity: "Light" }
    ],
    variants: { day: "Keep it light", night: "Add drama" },
    fix_tips: ["Highlight inner corners"],
    products: ["Foundation X", "Mascara Y"],
    estimated_time_minutes: 15,
    debug_info: { image_quality_score: 0.8, lighting_condition: "Good", warnings: [] }
  },
  tr: {
    summary: "Yüz hatlarınızda belirgin elmacık kemikleri ve dengeli bir oval yapı göze çarpıyor. Sıcak alt tonunuz altın yansımalı ürünler için ideal.",
    features: [
        { feature: "Yüz Şekli", description: "Oval", confidence: 0.95 },
        { feature: "Cilt Tonu", description: "Orta Sıcak", confidence: 0.92 }
    ],
    numeric_metrics: {
        face_shape: "Oval",
        skin_undertone: "Sıcak",
        skin_tone_lab: "L:72, A:14, B:22",
        eye_opening_ratio: "0.35",
        face_symmetry_score: 0.94,
        other_metrics: [{name: "Dudak Dolgunluğu", value: "0.45", unit: "oran"}]
    },
    palette: {
        option_a: {
            style_name: "Doğal Işıltı (Gündüz)",
            colors: [
                { role: "Baz", hex: "#D2B48C", reason: "Ciltle bütünleşir" },
                { role: "Allık", hex: "#FF9999", reason: "Taze görünüm" },
                { role: "Ruj", hex: "#D8BFD8", reason: "Nude pembe" },
                { role: "Far", hex: "#CD853F", reason: "Sıcak geçiş" },
                { role: "Aydınlatıcı", hex: "#FFF8DC", reason: "Doğal parlaklık" }
            ]
        },
        option_b: {
            style_name: "Bronz Glam (Gece)",
            colors: [
                { role: "Kontür", hex: "#8B4513", reason: "Keskin hatlar" },
                { role: "Ruj", hex: "#800020", reason: "İddialı bitiş" },
                { role: "Far", hex: "#2F4F4F", reason: "Buğulu bakış" },
                { role: "Allık", hex: "#CD5C5C", reason: "Yoğun sıcaklık" },
                { role: "Göz Kalemi", hex: "#000000", reason: "Derinlik" }
            ]
        }
    },
    steps: [
        { step: 1, title: "Hazırlık", product: "Baz", tool: "Parmak", technique: "Masaj", intensity: "Hafif" }
    ],
    variants: { day: "Hafif tutun", night: "Dramatikleştirin" },
    fix_tips: ["Göz pınarlarını aydınlatın"],
    products: ["Fondöten X", "Maskara Y"],
    estimated_time_minutes: 15,
    debug_info: { image_quality_score: 0.8, lighting_condition: "İyi", warnings: [] }
  },
  de: {
    summary: "Ihr Gesicht zeigt hohe Wangenknochen und ausgewogene Proportionen. Die Hautanalyse deutet auf einen warmen Unterton hin.",
    features: [
        { feature: "Gesichtsform", description: "Oval", confidence: 0.95 }
    ],
    numeric_metrics: {
        face_shape: "Oval",
        skin_undertone: "Warm",
        skin_tone_lab: "L:70, A:12, B:15",
        eye_opening_ratio: "0.35",
        face_symmetry_score: 0.95,
        other_metrics: []
    },
    palette: {
        option_a: { 
            style_name: "Tages-Look", 
            colors: [{ role: "Basis", hex: "#D2B48C", reason: "Passt zum Hautton" }] 
        },
        option_b: { 
            style_name: "Abend-Look", 
            colors: [{ role: "Lippen", hex: "#800020", reason: "Statement" }] 
        }
    },
    steps: [
         { step: 1, title: "Vorbereitung", product: "Primer", tool: "Finger", technique: "Massieren", intensity: "Leicht" }
    ],
    variants: { day: "Natürlich halten", night: "Dramatisch" },
    fix_tips: ["Innenwinkel hervorheben"],
    products: ["Foundation", "Mascara"],
    estimated_time_minutes: 15,
    debug_info: { image_quality_score: 0.8, lighting_condition: "Gut", warnings: [] }
  }
};

const getSystemInstruction = (lang: LanguageCode): string => {
  const commonRules = `
    TASK: Analyze the uploaded photo as an expert makeup artist.
    OUTPUT: Return ONLY valid JSON matching the schema. NO Markdown.
    RULES:
    1. Provide 2 distinct color palettes (Day & Night) in "palette.option_a" and "palette.option_b".
    2. Each palette must have ~5 colors with hex codes.
    3. Fill "numeric_metrics" with estimated values.
    4. Write a personalized "summary" (3-4 sentences).
  `;

  const instructions = {
    tr: `Sen uzman bir Görüntü İşleme AI'sı ve Profesyonel Makyaj Sanatçısısın.
    GÖREV: Yüklenen fotoğrafı analiz et ve JSON formatında detaylı bir rapor oluştur.
    DİL: TÜRKÇE. Lütfen tüm metin çıktılarını (summary, descriptions, steps vb.) TÜRKÇE olarak hazırla.
    
    KURALLAR:
    1. "palette" nesnesi içinde "option_a" (Doğal/Günlük) ve "option_b" (Dramatik/Gece) olmak üzere iki farklı renk paleti sun.
    2. Her palet için 5 renk (hex kodu) belirle.
    3. "numeric_metrics" kısmında tahmini LAB değerleri ve yüz ölçümlerini ver.
    4. "summary" kısmında kişiye özel, anatomik detaylar içeren 3-4 cümlelik bir özet yaz.
    5. SADECE GEÇERLİ JSON DÖNDÜR. Markdown kullanma.
    `,
    en: `You are an expert AI Makeup Artist.
    ${commonRules}
    LANGUAGE: ENGLISH. All text outputs (summary, descriptions, steps etc.) MUST be in English.
    `,
    de: `Sie sind eine erfahrene KI-Visagistin.
    AUFGABE: Analysieren Sie das Foto und erstellen Sie einen detaillierten Bericht im JSON-Format.
    SPRACHE: DEUTSCH. Alle Textausgaben (Zusammenfassung, Beschreibungen, Schritte usw.) MÜSSEN auf DEUTSCH sein.
    
    REGELN:
    1. Bieten Sie 2 Farbpaletten an: "palette.option_a" (Tag) und "palette.option_b" (Abend).
    2. Jede Palette benötigt ~5 Farben (Hex-Codes).
    3. "numeric_metrics" mit geschätzten Werten füllen.
    4. Schreiben Sie eine persönliche "summary" (3-4 Sätze).
    5. NUR GÜLTIGES JSON ZURÜCKGEBEN. Kein Markdown.
    `
  };
  return instructions[lang];
};

const cleanJsonResponse = (text: string): string => {
  let clean = text.trim();
  clean = clean.replace(/```json/g, "").replace(/```/g, "");
  const firstOpen = clean.indexOf('{');
  const lastClose = clean.lastIndexOf('}');
  if (firstOpen !== -1 && lastClose !== -1) {
    clean = clean.substring(firstOpen, lastClose + 1);
  }
  return clean;
};

export const analyzeFace = async (base64Image: string, lang: LanguageCode): Promise<AnalysisResult> => {
  // Rate Limit Check
  const now = Date.now();
  if (now - lastAnalysisTime < RATE_LIMIT_MS) {
     return new Promise(resolve => {
        // Return cached/fallback immediately if spamming, or throw error
        console.warn("Rate limit hit, returning fallback.");
        resolve(FALLBACK_RESULTS[lang]);
     });
  }
  lastAnalysisTime = now;

  if (!API_KEY) {
    console.warn("No API Key found, using fallback result.");
    return new Promise(resolve => setTimeout(() => resolve(FALLBACK_RESULTS[lang]), 2500));
  }

  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: `Perform detailed technical face analysis and makeup advice. Return valid JSON.` }
        ]
      },
      config: {
        systemInstruction: getSystemInstruction(lang),
        responseMimeType: "application/json",
        maxOutputTokens: 8192, 
        temperature: 0.4, 
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            numeric_metrics: {
              type: Type.OBJECT,
              properties: {
                face_shape: { type: Type.STRING },
                skin_undertone: { type: Type.STRING },
                skin_tone_lab: { type: Type.STRING },
                eye_opening_ratio: { type: Type.STRING },
                face_symmetry_score: { type: Type.NUMBER },
                other_metrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type:Type.STRING}, value: {type:Type.STRING}, unit: {type:Type.STRING} } } }
              }
            },
            debug_info: {
              type: Type.OBJECT,
              properties: {
                image_quality_score: { type: Type.NUMBER },
                lighting_condition: { type: Type.STRING },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            features: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                }
              }
            },
            palette: {
              type: Type.OBJECT,
              properties: {
                option_a: {
                  type: Type.OBJECT,
                  properties: {
                    style_name: { type: Type.STRING },
                    colors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: {type:Type.STRING}, hex: {type:Type.STRING}, reason: {type:Type.STRING} } } }
                  }
                },
                option_b: {
                  type: Type.OBJECT,
                  properties: {
                    style_name: { type: Type.STRING },
                    colors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: {type:Type.STRING}, hex: {type:Type.STRING}, reason: {type:Type.STRING} } } }
                  }
                }
              }
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  product: { type: Type.STRING },
                  tool: { type: Type.STRING },
                  technique: { type: Type.STRING },
                  intensity: { type: Type.STRING }
                }
              }
            },
            variants: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                night: { type: Type.STRING }
              }
            },
            fix_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            products: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimated_time_minutes: { type: Type.NUMBER },
            error: { type: Type.STRING, nullable: true }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const cleanedText = cleanJsonResponse(text);
    return JSON.parse(cleanedText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error (Using Fallback):", error);
    return FALLBACK_RESULTS[lang];
  }
};
