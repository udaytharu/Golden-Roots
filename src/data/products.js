export const PRODUCTS = [
  {
    id: 'turmeric',
    name: 'Turmeric Powder',
    desc: 'Rich in color and natural flavor. High curcumin content for premium quality.',
    longDesc:
      'Sourced from the fertile hills of Nepal, our Turmeric Powder is known for its high curcumin content and deep golden color. A staple in every Nepali kitchen.',
    price: 280,
    img: '/images/products/turmeric.jpeg',
    tag: 'Best Seller',
    category: 'best',
    rating: 4.9,
    reviews: 98,
    features: ['High Curcumin', 'Pure', 'Golden Color'],
  },
  {
    id: 'chili',
    name: 'Chili Powder',
    desc: 'Bold, spicy, and perfectly vibrant. Adds the perfect kick to your dishes.',
    longDesc:
      'Our Chili Powder is made from carefully selected red chilies, sun-dried and stone-ground to preserve their natural heat and vibrant color. Perfect for curries, marinades, and any dish that needs a spicy punch.',
    price: 350,
    img: '/images/products/chilli.jpeg',
    tag: 'New',
    category: 'new',
    rating: 4.8,
    reviews: 124,
    features: ['Rich Color', 'Bold Flavor', 'No Additives'],
  },
  {
    id: 'cumin',
    name: 'Cumin Powder',
    desc: 'Earthy, warm, and aromatic. Ground to perfection for rich flavor.',
    longDesc:
      'Our Cumin Powder is freshly ground from premium cumin seeds, releasing a warm, earthy aroma that enhances any dish.',
    price: 420,
    img: '/images/products/cumin.jpeg',
    tag: '',
    category: 'normal',
    rating: 4.7,
    reviews: 76,
    features: ['Rich Aroma', 'Natural', 'Freshly Ground'],
  },
  {
    id: 'coriander',
    name: 'Coriander Powder',
    desc: 'Fresh, citrusy, and essential for authentic Nepali and Indian curries.',
    longDesc:
      'Fresh and citrusy, our Coriander Powder is ground from premium coriander seeds to bring a bright, earthy flavor to your cooking.',
    price: 320,
    img: '/images/products/coriander.jpeg',
    tag: '',
    category: 'normal',
    rating: 4.6,
    reviews: 62,
    features: ['Fresh', 'Premium', 'Citrusy'],
  },
  {
    id: 'garam-masala',
    name: 'Garam Masala',
    desc: 'Aromatic blend of traditional Nepali spices, ground fresh for maximum flavor.',
    longDesc:
      'Our Garam Masala is a carefully balanced blend of cinnamon, cardamom, cloves, black pepper, and other traditional spices.',
    price: 380,
    img: '/images/products/packets.jpeg',
    tag: 'Best Seller',
    category: 'best',
    rating: 4.9,
    reviews: 145,
    features: ['Traditional Blend', 'Freshly Ground', 'Rich Aroma'],
  },
  {
    id: 'fenugreek',
    name: 'Fenugreek (Methi)',
    desc: 'Distinctive bitter-sweet flavor, essential for authentic Nepali cuisine.',
    longDesc:
      'Fenugreek seeds are a staple in Nepali cooking, known for their distinctive bitter-sweet flavor and numerous health benefits.',
    price: 240,
    img: '/images/products/packets.jpeg',
    tag: 'New',
    category: 'new',
    rating: 4.5,
    reviews: 48,
    features: ['Pure Seeds', 'Traditional', 'Health Benefits'],
  },
  {
    id: 'mustard-oil',
    name: 'Mustard Oil',
    desc: 'Cold-pressed, pure mustard oil for authentic Nepali cooking.',
    longDesc:
      'Our Mustard Oil is cold-pressed from premium mustard seeds to preserve its pungent flavor and nutritional value.',
    price: 520,
    img: '/images/products/packets.jpeg',
    tag: 'Best Seller',
    category: 'best',
    rating: 4.8,
    reviews: 87,
    features: ['Cold-Pressed', 'Pure', 'Traditional'],
  },
  {
    id: 'saffron',
    name: 'Saffron (Kesar)',
    desc: 'Premium hand-picked saffron threads, rich in color and aroma.',
    longDesc:
      'Our Saffron is hand-picked from the finest farms and carefully dried to preserve its distinctive aroma and golden color.',
    price: 850,
    img: '/images/products/packets.jpeg',
    tag: '',
    category: 'normal',
    rating: 5.0,
    reviews: 32,
    features: ['Hand-Picked', 'Premium', 'Rich Aroma'],
  },
];

export const FEATURED_PRODUCT_IDS = ['turmeric', 'chili', 'cumin', 'coriander'];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-NP')}`;
}
