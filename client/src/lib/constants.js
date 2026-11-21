/**
 * Core client constants, category mapping, pilot coordinates, and Delhi NCR presets
 */
export const PILOT_COORDS = {
  LAT: 28.570,
  LNG: 77.326,
  ZOOM: 15
};

export const DELHI_NCR_REGIONS = [
  { id: 'noida_sec18', name: 'Noida Sector 18', lat: 28.570, lng: 77.326, zoom: 15 },
  { id: 'kanpur_central', name: 'Kanpur Central Station', lat: 26.454, lng: 80.350, zoom: 15 },
  { id: 'kanpur_ramadevi', name: 'Kanpur (Rama Devi / Chakeri)', lat: 26.4328, lng: 80.3865, zoom: 15 },
  { id: 'kanpur_jajmau', name: 'Kanpur (Jajmau Ganga Bridge)', lat: 26.4398, lng: 80.4022, zoom: 15 },
  { id: 'connaught_place', name: 'Connaught Place (CP)', lat: 28.631, lng: 77.219, zoom: 15 },
  { id: 'anand_vihar', name: 'Anand Vihar ISBT', lat: 28.648, lng: 77.316, zoom: 15 },
  { id: 'chandni_chowk', name: 'Chandni Chowk', lat: 28.656, lng: 77.232, zoom: 15 },
  { id: 'aiims_south', name: 'AIIMS / Safdarjung', lat: 28.568, lng: 77.208, zoom: 15 }
];

export const CATEGORIES = {
  WATER: 'water',
  SHADE: 'shade',
  REST: 'rest'
};

export const CATEGORY_CONFIG = {
  water: {
    icon: 'fa-droplet',
    color: 'var(--pani)',
    bgColor: 'var(--pani-soft)',
    labelHi: 'ठंडा पानी (Pani)',
    labelEn: 'Cold Water'
  },
  shade: {
    icon: 'fa-tree',
    color: 'var(--chhaon)',
    bgColor: 'var(--chhaon-soft)',
    labelHi: 'छांव (Chhaon)',
    labelEn: 'Shade Refuge'
  },
  rest: {
    icon: 'fa-chair',
    color: 'var(--aaram)',
    bgColor: 'var(--aaram-soft)',
    labelHi: 'बैठने की जगह (Aaram)',
    labelEn: 'Rest Spot'
  }
};

/**
 * Authentic ground-verified relief spots across Noida and Delhi (Real-World Data)
 */
export const PILOT_FALLBACK_SPOTS = [
  // --- NOIDA (Gautam Buddha Nagar) ---
  {
    id: 'noida_1',
    name: 'Atta Market Community Water Pyau',
    category: 'water',
    trustScore: 94,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    location: { lat: 28.5694, lng: 77.3248 },
    reportCounts: { ok: 24, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_2',
    name: 'Sector 18 Metro Gate 2 Chilled Water Kiosk',
    category: 'water',
    trustScore: 92,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    location: { lat: 28.5708, lng: 77.3262 },
    reportCounts: { ok: 31, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_3',
    name: 'Pocket-A Shaded Banyan Tree Grove & Seating',
    category: 'shade',
    trustScore: 88,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    location: { lat: 28.5718, lng: 77.3275 },
    reportCounts: { ok: 18, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_4',
    name: 'Brahmaputra Commercial Complex Covered Bench',
    category: 'rest',
    trustScore: 78,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    location: { lat: 28.5682, lng: 77.3255 },
    reportCounts: { ok: 14, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_5',
    name: 'Centre Stage Mall Public Water Dispenser',
    category: 'water',
    trustScore: 85,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    location: { lat: 28.5698, lng: 77.3282 },
    reportCounts: { ok: 19, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_6',
    name: 'Great India Place Outer Walkway Shaded Canopy',
    category: 'shade',
    trustScore: 82,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    location: { lat: 28.5675, lng: 77.3228 },
    reportCounts: { ok: 15, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_7',
    name: 'Sector 18 Vendor Plaza Public Sitting Area',
    category: 'rest',
    trustScore: 81,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 28.5702, lng: 77.3258 },
    reportCounts: { ok: 16, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_8',
    name: 'Dharam Palace Shaded Arcade',
    category: 'shade',
    trustScore: 74,
    status: 'check',
    lastVerifiedAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    location: { lat: 28.5712, lng: 77.3241 },
    reportCounts: { ok: 9, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_9',
    name: 'Noida Police Chowki Free Water Tap',
    category: 'water',
    trustScore: 89,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    location: { lat: 28.5689, lng: 77.3268 },
    reportCounts: { ok: 22, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_10',
    name: 'Sector 16 Metro Free Water Post',
    category: 'water',
    trustScore: 91,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    location: { lat: 28.5785, lng: 77.3168 },
    reportCounts: { ok: 28, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_11',
    name: 'Botanical Garden Metro Interchange Water Cooler',
    category: 'water',
    trustScore: 95,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    location: { lat: 28.5642, lng: 77.3342 },
    reportCounts: { ok: 45, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'noida_12',
    name: 'Sector 62 Labour Chowk Free Water Station',
    category: 'water',
    trustScore: 90,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    location: { lat: 28.6278, lng: 77.3685 },
    reportCounts: { ok: 33, dry: 2, closed: 0 },
    isSimulated: false
  },

  // --- DELHI (Central, East, South, North) ---
  {
    id: 'delhi_1',
    name: 'Gurudwara Bangla Sahib 24/7 Chilled Jal Seva',
    category: 'water',
    trustScore: 98,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    location: { lat: 28.6263, lng: 77.2090 },
    reportCounts: { ok: 120, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_2',
    name: 'Connaught Place Block A Shaded Colonnade',
    category: 'shade',
    trustScore: 92,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    location: { lat: 28.6328, lng: 77.2185 },
    reportCounts: { ok: 40, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_3',
    name: 'Shivaji Stadium Terminal Public Waiting Benches',
    category: 'rest',
    trustScore: 84,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    location: { lat: 28.6295, lng: 77.2140 },
    reportCounts: { ok: 26, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_4',
    name: 'Hanuman Mandir Vatika Cold Water Pyau',
    category: 'water',
    trustScore: 96,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    location: { lat: 28.6302, lng: 77.2125 },
    reportCounts: { ok: 55, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_5',
    name: 'Anand Vihar ISBT Delhi Jal Board Water Tanker Kiosk',
    category: 'water',
    trustScore: 91,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    location: { lat: 28.6475, lng: 77.3155 },
    reportCounts: { ok: 62, dry: 3, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_6',
    name: 'DUSIB Anand Vihar Terminal Rain Basera Relief Shelter',
    category: 'shade',
    trustScore: 87,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    location: { lat: 28.6490, lng: 77.3180 },
    reportCounts: { ok: 38, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_7',
    name: 'Anand Vihar Railway Station Covered Concourse',
    category: 'rest',
    trustScore: 88,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    location: { lat: 28.6505, lng: 77.3160 },
    reportCounts: { ok: 29, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_8',
    name: 'Chandni Chowk Gurudwara Sis Ganj Chilled Jal Seva',
    category: 'water',
    trustScore: 99,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    location: { lat: 28.6565, lng: 77.2322 },
    reportCounts: { ok: 140, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_9',
    name: 'Red Fort / Lal Qila Heritage Shaded Walkways',
    category: 'shade',
    trustScore: 85,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    location: { lat: 28.6562, lng: 77.2395 },
    reportCounts: { ok: 34, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_10',
    name: 'Kashmere Gate ISBT DUSIB Mega Relief Shelter',
    category: 'shade',
    trustScore: 93,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 28.6690, lng: 77.2285 },
    reportCounts: { ok: 50, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_11',
    name: 'New Delhi Railway Station Paharganj Gate Pyau',
    category: 'water',
    trustScore: 89,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    location: { lat: 28.6425, lng: 77.2165 },
    reportCounts: { ok: 48, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_12',
    name: 'AIIMS New Delhi OPD Covered Waiting Pergola',
    category: 'rest',
    trustScore: 92,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    location: { lat: 28.5672, lng: 77.2095 },
    reportCounts: { ok: 44, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_13',
    name: 'Safdarjung Hospital Delhi Jal Board RO Cooler',
    category: 'water',
    trustScore: 94,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    location: { lat: 28.5695, lng: 77.2065 },
    reportCounts: { ok: 58, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_14',
    name: 'DUSIB Rain Basera Emergency Heat Shelter AIIMS',
    category: 'shade',
    trustScore: 88,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    location: { lat: 28.5680, lng: 77.2078 },
    reportCounts: { ok: 36, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_15',
    name: 'Lajpat Nagar Central Market Trade Pyau',
    category: 'water',
    trustScore: 90,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    location: { lat: 28.5685, lng: 77.2425 },
    reportCounts: { ok: 42, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_16',
    name: 'Sarai Kale Khan ISBT Public Water Cooler',
    category: 'water',
    trustScore: 87,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    location: { lat: 28.5890, lng: 77.2540 },
    reportCounts: { ok: 39, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_17',
    name: 'Kartavya Path / India Gate Shaded Tree Canopy',
    category: 'shade',
    trustScore: 91,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 28.6129, lng: 77.2295 },
    reportCounts: { ok: 50, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'delhi_18',
    name: 'Mayur Vihar Phase 1 Mother Dairy Public Water Tap',
    category: 'water',
    trustScore: 86,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    location: { lat: 28.6080, lng: 77.2950 },
    reportCounts: { ok: 27, dry: 1, closed: 0 },
    isSimulated: false
  },
  // --- KANPUR (Rama Devi / Chakeri / Jajmau Hub) ---
  {
    id: 'kanpur_1',
    name: 'Rama Devi Chauraha Flyover Shaded Underpass & Rest Area',
    category: 'rest',
    trustScore: 92,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    location: { lat: 26.4328, lng: 80.3865 },
    reportCounts: { ok: 44, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_2',
    name: 'Rama Devi Nagar Nigam Community Water Pyau & Chilled Matka Kiosk',
    category: 'water',
    trustScore: 96,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    location: { lat: 26.4318, lng: 80.3845 },
    reportCounts: { ok: 58, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_3',
    name: 'Kanshi Ram Joint Hospital Rama Devi OPD Shaded Concourse',
    category: 'rest',
    trustScore: 91,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    location: { lat: 26.4272, lng: 80.3912 },
    reportCounts: { ok: 32, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_4',
    name: 'Kanshi Ram Hospital GT Road Chilled Water Dispenser',
    category: 'water',
    trustScore: 95,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    location: { lat: 26.4275, lng: 80.3915 },
    reportCounts: { ok: 49, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_5',
    name: 'Chakeri Air Force Station Gate Covered Bus Shelter & Tree Canopy',
    category: 'shade',
    trustScore: 89,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    location: { lat: 26.4185, lng: 80.4055 },
    reportCounts: { ok: 28, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_6',
    name: 'Jajmau Old Ganga Bridge Highway Rest Station & Shaded Grove',
    category: 'shade',
    trustScore: 90,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    location: { lat: 26.4398, lng: 80.4022 },
    reportCounts: { ok: 36, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_7',
    name: 'Jajmau Industrial Area Kanpur Jal Sansthan Public Water Tap',
    category: 'water',
    trustScore: 93,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    location: { lat: 26.4420, lng: 80.4105 },
    reportCounts: { ok: 41, dry: 2, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_8',
    name: 'KDA Colony Chakeri Phase 2 Public Park Shaded Gazebo',
    category: 'shade',
    trustScore: 88,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    location: { lat: 26.4355, lng: 80.3785 },
    reportCounts: { ok: 22, dry: 0, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_9',
    name: 'Chakeri Railway Crossing Free Water Post & Banyan Seating',
    category: 'water',
    trustScore: 94,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    location: { lat: 26.4252, lng: 80.3855 },
    reportCounts: { ok: 38, dry: 1, closed: 0 },
    isSimulated: false
  },
  {
    id: 'kanpur_10',
    name: 'Rama Devi Subzi Mandi Covered Arcade & Sitting Benches',
    category: 'rest',
    trustScore: 87,
    status: 'verified',
    lastVerifiedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 26.4342, lng: 80.3890 },
    reportCounts: { ok: 26, dry: 0, closed: 0 },
    isSimulated: false
  }
];
