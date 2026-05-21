// Verified working Pexels image URLs with h=600&fit=crop for reliable loading
// These URLs have been tested and confirmed to work with hotlinking

export const IMAGES = {
  // Category images
  paints: 'https://images.pexels.com/photos/15013713/pexels-photo-15013713.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  cement: 'https://images.pexels.com/photos/29817952/pexels-photo-29817952.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  ironMaterials: 'https://images.pexels.com/photos/5623179/pexels-photo-5623179.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  electrical: 'https://images.pexels.com/photos/14129562/pexels-photo-14129562.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  plumbing: 'https://images.pexels.com/photos/9658236/pexels-photo-9658236.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  tools: 'https://images.pexels.com/photos/9607261/pexels-photo-9607261.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',

  // Specific product images
  sprayPaint: 'https://images.pexels.com/photos/7952069/pexels-photo-7952069.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  steelAngle: 'https://images.pexels.com/photos/5661674/pexels-photo-5661674.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  ledLight: 'https://images.pexels.com/photos/3946161/pexels-photo-3946161.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  circuitBreaker: 'https://images.pexels.com/photos/10871737/pexels-photo-10871737.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  faucet: 'https://images.pexels.com/photos/7327156/pexels-photo-7327156.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  waterHeater: 'https://images.pexels.com/photos/34593293/pexels-photo-34593293.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  powerDrill: 'https://images.pexels.com/photos/30413424/pexels-photo-30413424.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  angleGrinder: 'https://images.pexels.com/photos/4315559/pexels-photo-4315559.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  hammer: 'https://images.pexels.com/photos/7484795/pexels-photo-7484795.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  circularSaw: 'https://images.pexels.com/photos/1249614/pexels-photo-1249614.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  spiritLevel: 'https://images.pexels.com/photos/9050959/pexels-photo-9050959.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  safetyHelmet: 'https://images.pexels.com/photos/4161604/pexels-photo-4161604.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  tapeMeasure: 'https://images.pexels.com/photos/32942847/pexels-photo-32942847.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  construction: 'https://images.pexels.com/photos/36463675/pexels-photo-36463675.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',

  // Hero banners
  heroConstruction: 'https://images.pexels.com/photos/36463675/pexels-photo-36463675.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop',
  heroTools: 'https://images.pexels.com/photos/30413424/pexels-photo-30413424.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop',
  heroPaint: 'https://images.pexels.com/photos/15013713/pexels-photo-15013713.jpeg?auto=compress&cs=tinysrgb&w=1400&h=600&fit=crop',

  // Fallback
  fallback: 'https://images.pexels.com/photos/9607261/pexels-photo-9607261.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop',
  fallbackSmall: 'https://images.pexels.com/photos/9607261/pexels-photo-9607261.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
} as const;

// Category slug to image mapping for fallbacks
export const CATEGORY_FALLBACKS: Record<string, string> = {
  paints: IMAGES.paints,
  cement: IMAGES.cement,
  'iron-materials': IMAGES.ironMaterials,
  'electrical-items': IMAGES.electrical,
  'plumbing-products': IMAGES.plumbing,
  'hardware-tools': IMAGES.tools,
};
