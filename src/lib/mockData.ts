import { IMAGES } from './images';
import type { Category, Product, Order } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Paints & Finishes', slug: 'paints', description: 'Premium paints for every surface', image_url: IMAGES.paints, created_at: new Date().toISOString() },
  { id: '2', name: 'Cement & Concrete', slug: 'cement', description: 'Industry standard construction materials', image_url: IMAGES.cement, created_at: new Date().toISOString() },
  { id: '3', name: 'Iron & Steel', slug: 'iron-materials', description: 'Structural steel and iron rods', image_url: IMAGES.ironMaterials, created_at: new Date().toISOString() },
  { id: '4', name: 'Electrical Items', slug: 'electrical-items', description: 'Wires, switches, and lighting', image_url: IMAGES.electrical, created_at: new Date().toISOString() },
  { id: '5', name: 'Plumbing Products', slug: 'plumbing-products', description: 'Pipes, fittings, and faucets', image_url: IMAGES.plumbing, created_at: new Date().toISOString() },
  { id: '6', name: 'Hardware Tools', slug: 'hardware-tools', description: 'Power and hand tools', image_url: IMAGES.tools, created_at: new Date().toISOString() },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Asian Paints Apex Ultima (20L)',
    description: 'High-performance exterior emulsion paint with advanced weather guard technology.',
    price: 7850,
    compare_price: 8499,
    image_url: IMAGES.paints,
    category_id: '1',
    stock: 25,
    sku: 'AP-ALT-20',
    is_featured: true,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'DeWalt 18V Cordless Drill',
    description: 'Professional grade power drill with 2-speed transmission and LED light.',
    price: 12500,
    compare_price: 15999,
    image_url: IMAGES.powerDrill,
    category_id: '6',
    stock: 12,
    sku: 'DW-CD-18',
    is_featured: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'UltraTech Cement (50kg Bag)',
    description: 'Premium quality cement for strong and durable construction.',
    price: 450,
    compare_price: 480,
    image_url: IMAGES.cement,
    category_id: '2',
    stock: 500,
    sku: 'UT-CM-50',
    is_featured: true,
    rating: 4.7,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Polycab 2.5sqmm Wire (90m)',
    description: 'Flame retardant low smoke (FRLS) copper wire for home electricals.',
    price: 2450,
    compare_price: 2900,
    image_url: IMAGES.electrical,
    category_id: '4',
    stock: 100,
    sku: 'PL-WR-2.5',
    is_featured: true,
    rating: 4.6,
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Bosch Professional GSB 600 Drill',
    description: 'Powerful 600W impact drill for professional masonry and wood work.',
    price: 4999,
    compare_price: 5999,
    image_url: IMAGES.tools,
    category_id: '6',
    stock: 20,
    sku: 'BS-GSB-600',
    is_featured: true,
    rating: 4.8,
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    name: 'JSW Neosteel TMT Bars (12mm)',
    description: 'High-strength structural steel bars with excellent bendability.',
    price: 1850,
    compare_price: 2100,
    image_url: IMAGES.ironMaterials,
    category_id: '3',
    stock: 1000,
    sku: 'JSW-NS-12',
    is_featured: false,
    rating: 4.7,
    created_at: new Date().toISOString()
  },
  {
    id: 'p7',
    name: 'Astral CPVC Pro Pipes (3m)',
    description: 'Premium quality lead-free CPVC pipes for hot and cold water.',
    price: 850,
    compare_price: 1050,
    image_url: IMAGES.plumbing,
    category_id: '5',
    stock: 150,
    sku: 'AS-CP-03',
    is_featured: false,
    rating: 4.5,
    created_at: new Date().toISOString()
  },
  {
    id: 'p8',
    name: 'Industrial Heavy-Duty Bench Grinder',
    description: 'Powerful 250W bench grinder with dual grinding wheels for sharpening and polishing.',
    price: 3450,
    compare_price: 4200,
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    category_id: '6',
    stock: 8,
    sku: 'IND-BG-250',
    is_featured: true,
    rating: 4.9,
    created_at: new Date().toISOString()
  },
  {
    id: 'p9',
    name: 'Digital Laser Distance Meter (40m)',
    description: 'High-precision laser measuring tool with multiple calculation modes.',
    price: 2199,
    compare_price: 2899,
    image_url: "https://images.unsplash.com/photo-1530124560676-587cad321376?auto=format&fit=crop&q=80&w=800",
    category_id: '6',
    stock: 45,
    sku: 'LZ-DM-40',
    is_featured: false,
    rating: 4.8,
    created_at: new Date().toISOString()
  }
];

export const MOCK_ORDERS: Order[] = [];
