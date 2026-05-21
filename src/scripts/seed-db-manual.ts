import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Hardcoded keys for this manual seed to avoid dependency issues
const firebaseConfig = {
  apiKey: "AIzaSyBnux-j8F1jDSW9e6vdsQ26_QWfz311SRY",
  authDomain: "acehardwaretools-23721.firebaseapp.com",
  projectId: "acehardwaretools-23721",
  storageBucket: "acehardwaretools-23721.firebasestorage.app",
  messagingSenderId: "175679083495",
  appId: "1:175679083495:web:01c664f1c7f1acff732342",
};

const MOCK_CATEGORIES = [
  { id: '1', name: 'Paints & Finishes', slug: 'paints', description: 'Premium paints for every surface' },
  { id: '2', name: 'Cement & Concrete', slug: 'cement', description: 'Industry standard construction materials' },
  { id: '3', name: 'Iron & Steel', slug: 'iron-materials', description: 'Structural steel and iron rods' },
  { id: '4', name: 'Electrical Items', slug: 'electrical-items', description: 'Wires, switches, and lighting' },
  { id: '5', name: 'Plumbing Products', slug: 'plumbing-products', description: 'Pipes, fittings, and faucets' },
  { id: '6', name: 'Hardware Tools', slug: 'hardware-tools', description: 'Power and hand tools' },
];

const MOCK_PRODUCTS = [
  { id: 'p1', name: 'Asian Paints Apex Ultima (20L)', price: 7850, category_id: '1', stock: 25, is_featured: true },
  { id: 'p2', name: 'DeWalt 18V Cordless Drill', price: 12500, category_id: '6', stock: 12, is_featured: true },
  { id: 'p3', name: 'UltraTech Cement (50kg Bag)', price: 450, category_id: '2', stock: 500, is_featured: true },
  { id: 'p4', name: 'Polycab 2.5sqmm Wire (90m)', price: 2450, category_id: '4', stock: 100, is_featured: true },
  { id: 'p5', name: 'Bosch Professional GSB 600 Drill', price: 4999, category_id: '6', stock: 20, is_featured: true },
  { id: 'p8', name: 'Industrial Heavy-Duty Bench Grinder', price: 3450, category_id: '6', stock: 8, is_featured: true },
  { id: 'p9', name: 'Digital Laser Distance Meter (40m)', price: 2199, category_id: '6', stock: 45, is_featured: false }
];

async function seed() {
  console.log('🚀 Starting Manual Database Seed (Hardcoded Keys)...');
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    console.log('📦 Uploading Categories...');
    for (const cat of MOCK_CATEGORIES) {
      const { id, ...data } = cat;
      await setDoc(doc(db, 'categories', id), { ...data, created_at: new Date().toISOString() });
      console.log(`✅ Category: ${cat.name}`);
    }

    console.log('🛠️ Uploading Products...');
    for (const prod of MOCK_PRODUCTS) {
      const { id, ...data } = prod;
      await setDoc(doc(db, 'products', id), { ...data, created_at: new Date().toISOString() });
      console.log(`✅ Product: ${prod.name}`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
