import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Simple Refreshing Facial Wash',
    brand: 'Simple',
    sizes: ['150ml'],
    categories: ['Cleansers', 'Sensitive skin', 'Under 10k skincare'],
    description: 'This 100% soap-free daily face wash is suitable for all skin types and is super gentle – even on sensitive skin. Supercharged with a NEW, vitamin-rich formula – this is the same gentle care you know and love from Simple – made even more effective for healthier-looking, smooth skin. With Pro Amino Acid Technology, it boosts amino acids naturally present in the skin, for a hydrated and healthy skin barrier against drying elements like pollution. Like all Simple products, this Refreshing Facial Wash is dermatologically tested, hypoallergenic, contains no harsh chemicals and is free from alcohol, mineral oils, artificial colours and perfume.',
    picture: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 4200,
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    skinConcerns: ['Sensitive Skin', 'Daily Cleansing', 'Gentle Care'],
    skinTypes: ['All Skin Types', 'Sensitive'],
    ingredients: ['Pro Amino Acid Technology', 'Vitamin-rich formula', 'Soap-free cleansers'],
    isPopular: true,
    isNew: false,
  },
];