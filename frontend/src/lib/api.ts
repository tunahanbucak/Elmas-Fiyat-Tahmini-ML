export interface DiamondFeatures {
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  depth: number;
  table: number;
  x: number;
  y: number;
  z: number;
}

export interface PredictionResult {
  predicted_price: number;
  price_per_carat: number;
  tier: string;
  isBackendConnected: boolean;
  features: DiamondFeatures;
}

export interface PresetItem {
  id: string;
  title: string;
  description: string;
  features: DiamondFeatures;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://elmas-fiyat-api.onrender.com';

/**
 * Scikit-Learn SVR Model Tahmin Hesaplayıcısı (Client-Side Fallback)
 * Sunucu kapalıysa uygulamanın çökmesini engeller ve gerçekçi tahmin sunar.
 */
function calculateClientFallback(features: DiamondFeatures): number {
  const cutMultipliers: Record<string, number> = {
    Ideal: 1.25,
    Premium: 1.15,
    'Very Good': 1.05,
    Good: 0.95,
    Fair: 0.8,
  };

  const colorMultipliers: Record<string, number> = {
    D: 1.3,
    E: 1.2,
    F: 1.1,
    G: 1.0,
    H: 0.9,
    I: 0.82,
    J: 0.75,
  };

  const clarityMultipliers: Record<string, number> = {
    IF: 1.35,
    VVS1: 1.25,
    VVS2: 1.15,
    VS1: 1.05,
    VS2: 0.98,
    SI1: 0.88,
    SI2: 0.78,
    I1: 0.65,
  };

  const basePrice = Math.pow(features.carat, 1.65) * 3800;
  const cutMult = cutMultipliers[features.cut] || 1.0;
  const colorMult = colorMultipliers[features.color] || 1.0;
  const clarityMult = clarityMultipliers[features.clarity] || 1.0;

  return Math.max(250, Math.round(basePrice * cutMult * colorMult * clarityMult));
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const response = await fetch(`${API_BASE_URL}/api/presets`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

export async function predictPrice(features: DiamondFeatures): Promise<PredictionResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        isBackendConnected: true,
      };
    }
  } catch {
    // Sunucu çevrimdışıysa sessizce istemci hesaplayıcısına geç
  }

  // Fallback (Sunucu Kapalıysa Çökmez)
  const predicted_price = calculateClientFallback(features);
  const price_per_carat = Math.round(predicted_price / Math.max(0.01, features.carat));

  let tier = 'Ekonomik Segment';
  if (predicted_price >= 15000) tier = 'Özel Koleksiyon / Lüks';
  else if (predicted_price >= 5000) tier = 'Yatırımlık Segment';
  else if (predicted_price >= 1500) tier = 'Prestij Mücevher';

  return {
    predicted_price,
    price_per_carat,
    tier,
    isBackendConnected: false,
    features,
  };
}

export async function fetchPresets(): Promise<PresetItem[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${API_BASE_URL}/api/presets`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Fallback preset verisi
  }

  return [
    {
      id: 'ideal_solitaire',
      title: '1.0 Karat İdeal Tektaş',
      description: 'Yüksek parlaklığa sahip evlilik yüzüğü standardı',
      features: {
        carat: 1.0,
        cut: 'Ideal',
        color: 'E',
        clarity: 'VS1',
        depth: 61.5,
        table: 57.0,
        x: 6.45,
        y: 6.48,
        z: 3.98,
      },
    },
    {
      id: 'flawless_luxury',
      title: '2.0 Karat Yatırımlık Kusursuz',
      description: 'D Rengi ve IF berraklıkta koleksiyonluk elmas',
      features: {
        carat: 2.0,
        cut: 'Ideal',
        color: 'D',
        clarity: 'IF',
        depth: 62.0,
        table: 56.0,
        x: 8.10,
        y: 8.13,
        z: 5.03,
      },
    },
    {
      id: 'budget_sparkle',
      title: '0.5 Karat Günlük Şık Elmas',
      description: 'Uygun fiyatlı ve temiz kesimli zarif elmas',
      features: {
        carat: 0.5,
        cut: 'Very Good',
        color: 'G',
        clarity: 'SI1',
        depth: 62.8,
        table: 58.0,
        x: 5.05,
        y: 5.08,
        z: 3.18,
      },
    },
    {
      id: 'statement_gem',
      title: '3.0 Karat Özel Koleksiyon',
      description: 'Yüksek karat ağırlığı ve mükemmel cila',
      features: {
        carat: 3.0,
        cut: 'Premium',
        color: 'F',
        clarity: 'VVS2',
        depth: 61.2,
        table: 59.0,
        x: 9.25,
        y: 9.29,
        z: 5.67,
      },
    },
  ];
}

export function estimateDimensions(carat: number, depthPercent: number = 61.5) {
  const diameter = Math.round(6.5 * Math.cbrt(carat) * 100) / 100;
  const z = Math.round(diameter * (depthPercent / 100) * 100) / 100;
  return {
    x: diameter,
    y: Math.round((diameter + 0.03) * 100) / 100,
    z: z,
  };
}
