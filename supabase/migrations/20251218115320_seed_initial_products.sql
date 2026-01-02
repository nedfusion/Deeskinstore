/*
  # Seed Initial Products

  ## Products to be added:
  1. Simple Refreshing Facial Wash - ₦4,200
  2. Simple Moisturizing Facial Wash - ₦4,200
  3. CeraVe Hydrating Cleanser - ₦8,500
  4. The Ordinary Niacinamide 10% + Zinc 1% - ₦6,800
  5. Neutrogena Ultra Gentle Daily Cleanser - ₦7,200
  6. Olay Regenerist Micro-Sculpting Cream - ₦12,500
  7. La Roche-Posay Toleriane Double Repair Face Moisturizer - ₦15,800
  8. Aveeno Daily Moisturizing Body Lotion - ₦9,200

  All products are set as active and available in stock
*/

-- Clear existing products (in case of re-run)
DELETE FROM products;

-- Seed products
INSERT INTO products (id, name, description, price, image, category, stock, rating, is_active) VALUES
(
  gen_random_uuid(),
  'Simple Refreshing Facial Wash',
  'This 100% soap-free daily face wash is suitable for all skin types and is super gentle – even on sensitive skin. Supercharged with a NEW, vitamin-rich formula – this is the same gentle care you know and love from Simple – made even more effective for healthier-looking, smooth skin. With Pro Amino Acid Technology, it boosts amino acids naturally present in the skin, for a hydrated and healthy skin barrier against drying elements like pollution.',
  4200,
  'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Cleansers',
  50,
  4.5,
  true
),
(
  gen_random_uuid(),
  'Simple Moisturizing Facial Wash',
  'This Face Wash thoroughly cleanses your skin, removing oil, dirt, and other impurities. Great for everyday use as part of your skincare routine. Carefully blended with the purest possible ingredients and multi-vitamins, it is enriched with pro-vitamin B5, vitamin E and Bisabolol, leaving your face feeling clean and refreshed.',
  4200,
  'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Cleansers',
  50,
  4.4,
  true
),
(
  gen_random_uuid(),
  'CeraVe Hydrating Cleanser',
  'A gentle, non-foaming cleanser that removes makeup and dirt while maintaining the skin''s natural barrier. Formulated with ceramides, hyaluronic acid, and vitamin B5 to hydrate and restore the skin.',
  8500,
  'https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Cleansers',
  40,
  4.6,
  true
),
(
  gen_random_uuid(),
  'The Ordinary Niacinamide 10% + Zinc 1%',
  'A high-strength vitamin and mineral blemish formula with 10% niacinamide and 1% zinc. Reduces the appearance of skin blemishes and congestion while balancing visible aspects of sebum activity.',
  6800,
  'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Serums',
  60,
  4.3,
  true
),
(
  gen_random_uuid(),
  'Neutrogena Ultra Gentle Daily Cleanser',
  'A soap-free, hypoallergenic cleanser that effectively removes dirt, oil, and makeup without over-drying or irritating sensitive skin. Dermatologist recommended for daily use.',
  7200,
  'https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Cleansers',
  45,
  4.4,
  true
),
(
  gen_random_uuid(),
  'Olay Regenerist Micro-Sculpting Cream',
  'An advanced anti-aging moisturizer with amino-peptides and niacinamide. Smooths skin texture and reduces the appearance of fine lines and wrinkles while providing 24-hour hydration.',
  12500,
  'https://images.pexels.com/photos/7929553/pexels-photo-7929553.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Moisturizers',
  35,
  4.5,
  true
),
(
  gen_random_uuid(),
  'La Roche-Posay Toleriane Double Repair Face Moisturizer',
  'A daily face moisturizer for sensitive skin with ceramides and niacinamide. Restores the skin barrier and provides 48-hour hydration while being suitable for sensitive skin.',
  15800,
  'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Moisturizers',
  30,
  4.7,
  true
),
(
  gen_random_uuid(),
  'Aveeno Daily Moisturizing Body Lotion',
  'A nourishing body lotion with colloidal oatmeal that soothes and moisturizes dry skin for 24 hours. Clinically proven to improve the health of dry skin in just one day.',
  9200,
  'https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Body Moisturizers',
  55,
  4.6,
  true
);