-- Meppel Seed Data
-- Real places and events for Meppel, Drenthe

-- Categories
INSERT INTO public.categories (slug, name, description, icon, color, sort_order) VALUES
  ('restaurants', 'Restaurants', 'From casual to fine dining', 'Utensils', '#E8A87C', 1),
  ('cafes', 'Cafés', 'Coffee, tea, and cozy corners', 'Coffee', '#D98A6C', 2),
  ('bars', 'Bars & Cafés', 'Borrel, cocktails, and late nights', 'Wine', '#A78BFA', 3),
  ('shopping', 'Shopping', 'Boutiques, markets, and stores', 'ShoppingBag', '#60A5FA', 4),
  ('attractions', 'Attractions', 'Museums, monuments, and landmarks', 'Landmark', '#F59E0B', 5),
  ('parks', 'Parks & Nature', 'Green spaces and outdoor escapes', 'Trees', '#4ADE80', 6),
  ('hidden-gems', 'Hidden Gems', 'Off the beaten path', 'MapPin', '#FB7185', 7);

-- Restaurants
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Restaurant Sukade', 'restaurant-sukade', id, 'Innovative Dutch cuisine with a focus on fresh seafood and seasonal ingredients. Located along the canal in the heart of Meppel.', 'Innovative Dutch seafood cuisine', 3, 52.6965, 6.1955, 'Prinsengracht 12', '7941 AA', 'Meppel', '+31 522 745 074', 'https://restaurantsukade.nl', '@restaurantsukade', '{"tuesday":"17:00-22:00","wednesday":"17:00-22:00","thursday":"17:00-22:00","friday":"17:00-22:30","saturday":"17:00-22:30"}', '{}', ARRAY['romantic', 'fine-dining', 'seafood'], true, 98.5, 4.6, 183
FROM public.categories WHERE slug = 'restaurants';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Ton Nam Thai', 'ton-nam-thai', id, 'Authentic Thai cuisine in the heart of Meppel. Known for fresh flavours, generous portions, and warm service.', 'Authentic Thai flavours', 2, 52.6970, 6.1960, 'Grote Kerkstraat 8', '7941 AA', 'Meppel', '+31 522 244 888', 'https://www.tonnamthai.nl', '@tonnamthai', '{"tuesday":"16:00-22:00","wednesday":"16:00-22:00","thursday":"16:00-22:00","friday":"16:00-22:30","saturday":"16:00-22:30","sunday":"16:00-22:00"}', '{}', ARRAY['asian', 'family-friendly', 'takeaway'], true, 95.0, 4.7, 92
FROM public.categories WHERE slug = 'restaurants';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'De Brasserie | huberts sinds 1922', 'de-brasserie-huberts', id, 'A grand café and brasserie with a rich history dating back to 1922. Known for their excellent club sandwich and premium coffee.', 'Grand brasserie since 1922', 2, 52.6968, 6.1952, 'Hoofdstraat 45', '7941 AB', 'Meppel', '+31 522 244 122', 'https://www.debrasserie.com', '@debrasseriehuberts', '{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-21:00","friday":"09:00-22:00","saturday":"09:00-22:00","sunday":"10:00-18:00"}', '{}', ARRAY['historic', 'lunch', 'coffee'], true, 93.0, 4.5, 722
FROM public.categories WHERE slug = 'restaurants';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Ristorante Sardinia', 'ristorante-sardinia', id, 'Authentic Italian cuisine in the heart of Meppel. The salmon, spaghetti bolognese, and arrabiata are standouts.', 'Authentic Italian dining', 2, 52.6960, 6.1955, 'Grote Kerkstraat 22', '7941 AA', 'Meppel', '+31 522 244 789', 'https://sardiniameppel.nl', '@sardiniameppel', '{"tuesday":"17:00-22:00","wednesday":"17:00-22:00","thursday":"17:00-22:00","friday":"17:00-22:30","saturday":"17:00-22:30","sunday":"17:00-22:00"}', '{}', ARRAY['italian', 'pizza', 'family-friendly'], false, 88.0, 4.1, 1039
FROM public.categories WHERE slug = 'restaurants';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Restaurant Element', 'restaurant-element', id, 'Fine dining at its best in Meppel. A small-scale restaurant offering an exceptional culinary experience with creative dishes.', 'Exceptional fine dining', 4, 52.6972, 6.1968, 'Kerkstraat 18', '7941 AA', 'Meppel', '+31 522 745 080', null, '@restaurantelement', '{"wednesday":"18:00-22:00","thursday":"18:00-22:00","friday":"18:00-22:30","saturday":"18:00-22:30"}', '{}', ARRAY['fine-dining', 'romantic', 'special-occasion'], true, 96.0, 4.8, 11
FROM public.categories WHERE slug = 'restaurants';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Eetcafé De Beurs', 'eetcafe-de-beurs', id, 'A classic Dutch eetcafé with hearty portions and a no-nonsense atmosphere. Known for schnitzels, ribs, and daily specials.', 'Hearty Dutch eetcafé', 1, 52.6961, 6.1950, 'Grote Kerkstraat 15', '7941 AA', 'Meppel', '+31 522 244 200', null, null, '{"monday":"16:00-22:00","tuesday":"16:00-22:00","wednesday":"16:00-22:00","thursday":"16:00-22:00","friday":"16:00-23:00","saturday":"12:00-23:00","sunday":"12:00-22:00"}', '{}', ARRAY['dutch', 'casual', 'family-friendly'], false, 84.0, 4.2, 1654
FROM public.categories WHERE slug = 'restaurants';

-- Cafés
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Grand Café De Wheem', 'grand-cafe-de-wheem', id, 'A popular grand café with a spacious terrace overlooking the canal. Great for coffee, lunch, or an evening drink. The homemade apple pie is legendary.', 'Canalside grand café', 2, 52.6963, 6.1948, 'Prinsengracht 28', '7941 AA', 'Meppel', '+31 522 240 055', null, '@grandcafedewheem', '{"monday":"09:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-21:00","friday":"09:00-22:00","saturday":"09:00-22:00","sunday":"10:00-18:00"}', '{}', ARRAY['canal-view', 'terrace', 'lunch'], true, 89.0, 4.5, 681
FROM public.categories WHERE slug = 'cafes';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Proeverij Taste & Toast', 'proeverij-taste-and-toast', id, 'A cosy tasting café specialising in creative toasts, fresh juices, and specialty coffee. The avocado toast and smoothie bowls are standouts.', 'Creative toasts and fresh juices', 1, 52.6967, 6.1958, 'Hoofdstraat 28', '7941 AB', 'Meppel', '+31 522 745 100', null, '@tasteandtoast', '{"tuesday":"09:00-17:00","wednesday":"09:00-17:00","thursday":"09:00-17:00","friday":"09:00-17:00","saturday":"09:00-17:00","sunday":"10:00-16:00"}', '{}', ARRAY['lunch', 'healthy', 'coffee'], false, 83.0, 4.5, 78
FROM public.categories WHERE slug = 'cafes';

-- Bars
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Herberg ''t Plein', 'herberg-t-plein', id, 'A beloved brown café on the Marktplein with a lively atmosphere. Great for a cold beer, a nice wine, or an amazing hot chocolate. A Meppel institution.', 'Iconic brown café on the square', 1, 52.6962, 6.1958, 'Marktplein 1', '7941 AA', 'Meppel', '+31 522 243 456', null, '@herbergthetplein', '{"monday":"10:00-01:00","tuesday":"10:00-01:00","wednesday":"10:00-01:00","thursday":"10:00-01:00","friday":"10:00-02:00","saturday":"10:00-02:00","sunday":"12:00-01:00"}', '{}', ARRAY['lively', 'historic', 'beer'], true, 91.0, 4.2, 1626
FROM public.categories WHERE slug = 'bars';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Grandcafé Salud', 'grandcafe-salud', id, 'A vibrant grand café in the centre of Meppel. Great for coffee, lunch, borrel, and dinner. Their sunny terrace is the perfect spot on warm days.', 'Coffee, lunch, borrel & dinner', 2, 52.6964, 6.1954, 'Hoofdstraat 35', '7941 AB', 'Meppel', '+31 522 745 090', null, '@grandcafesalud', '{"tuesday":"10:00-22:00","wednesday":"10:00-22:00","thursday":"10:00-22:00","friday":"10:00-01:00","saturday":"10:00-01:00","sunday":"10:00-22:00"}', '{}', ARRAY['terrace', 'lively', 'borrel'], false, 86.0, 4.3, 120
FROM public.categories WHERE slug = 'bars';

-- Attractions
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Drukkerijmuseum', 'drukkerijmuseum', id, 'The Meppel Printing Museum is a fascinating look at the city''s rich printing heritage. Passionate volunteers demonstrate historic printing techniques.', 'Historic printing museum', 1, 52.6975, 6.1975, 'Kerkstraat 30', '7941 AA', 'Meppel', '+31 522 244 567', null, null, '{"wednesday":"10:00-16:00","thursday":"10:00-16:00","friday":"10:00-16:00","saturday":"10:00-16:00"}', '{}', ARRAY['museum', 'history', 'family-friendly'], true, 82.0, 4.4, 25
FROM public.categories WHERE slug = 'attractions';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Meppeler Toren', 'meppeler-toren', id, 'The 45-metre-high tower of the Grote of Mariakerk is the proud centre of Meppel. Climb the 147 steps for a fantastic view over the city.', 'Iconic 15th-century church tower', 1, 52.6968, 6.1962, 'Grote Kerkstraat', '7941 AA', 'Meppel', null, null, null, '{"thursday":"10:00-16:00","saturday":"10:00-16:00"}', '{}', ARRAY['historic', 'viewpoint', 'landmark'], true, 85.0, 4.0, 45
FROM public.categories WHERE slug = 'attractions';

INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Molen de Vlijt', 'molen-de-vlijt', id, 'A beautifully restored mill on the canal. One of the last remaining mills from the city''s original 20. Still turns — a picturesque sight.', 'Restored canal-side mill', 0, 52.6958, 6.1945, 'Vlijt', '7941 AA', 'Meppel', null, null, null, null, '{}', ARRAY['historic', 'photo-spot', 'canal'], false, 80.0, 4.2, 18
FROM public.categories WHERE slug = 'attractions';

-- Parks
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'Stadspark Meppel', 'stadspark-meppel', id, 'Meppel''s central park with winding paths, centuries-old trees, and a picturesque pond. Perfect for walks, picnics, and morning runs.', 'Meppel''s central green oasis', 0, 52.6980, 6.1920, 'Stadspark', '7941 AA', 'Meppel', null, null, null, null, '{}', ARRAY['nature', 'walking', 'family-friendly'], true, 87.0, 4.7, 52
FROM public.categories WHERE slug = 'parks';

-- Shopping
INSERT INTO public.places (name, slug, category_id, description, short_description, price_level, latitude, longitude, address, postcode, city, phone, website, instagram, hours, photos, tags, is_featured, trending_score, avg_rating, review_count)
SELECT 'O''moda', 'omoda-meppel', id, 'The go-to shoe and fashion store on Meppel''s Hoofdstraat. Wide selection of trendy footwear, bags, and clothing for the whole family.', 'Fashion and footwear', 2, 52.6966, 6.1956, 'Hoofdstraat 40', '7941 AB', 'Meppel', '+31 522 244 300', 'https://www.omoda.nl', '@omoda_shoes', '{"monday":"10:00-18:00","tuesday":"09:00-18:00","wednesday":"09:00-18:00","thursday":"09:00-21:00","friday":"09:00-18:00","saturday":"09:00-17:00"}', '{}', ARRAY['shopping', 'fashion', 'shoes'], false, 78.0, 4.3, 87
FROM public.categories WHERE slug = 'shopping';

-- Events
INSERT INTO public.events (name, slug, description, category, venue_name, venue_address, latitude, longitude, start_datetime, end_datetime, price, organizer_name, attendee_count) VALUES
('Meppelse Markt', 'meppelse-markt', 'The weekly Thursday market on the Marktplein. Fresh produce, flowers, cheese, bread, and local specialties from Drenthe farmers.', 'markets', 'Marktplein', 'Marktplein, Meppel', 52.6962, 6.1958, NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '5 hours', NULL, 'Gemeente Meppel', 500),
('Koopzondag Meppel', 'koopzondag-meppel', 'Monthly shopping Sunday in the centre. All shops on the Hoofdstraat and surrounding streets are open from 12:00 to 17:00.', 'shopping', 'Centrum Meppel', 'Hoofdstraat, Meppel', 52.6966, 6.1956, NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '5 hours', NULL, 'Winkeliersvereniging Meppel', 800),
('Kookworkshop Italiaans', 'kookworkshop-italiaans', 'Learn to make fresh pasta and tiramisu with Chef Marco. All ingredients included. Take home your creations or enjoy on site.', 'workshops', 'Ristorante Sardinia', 'Grote Kerkstraat 22, Meppel', 52.6960, 6.1955, NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '3 hours', 45.00, 'Ristorante Sardinia', 12),
('Expositie: Drentse Landschappen', 'expositie-drentse-landschappen', 'An exhibition of landscape paintings by local Drenthe artists. A tribute to the heathlands, forests, and villages of Drenthe.', 'art', 'Drukkerijmuseum', 'Kerkstraat 30, Meppel', 52.6975, 6.1975, NOW() + INTERVAL '5 days', NOW() + INTERVAL '30 days', 5.00, 'Drukkerijmuseum', 45),
('Yoga in het Stadspark', 'yoga-in-het-stadspark', 'Outdoor yoga session in the beautiful Stadspark. All levels welcome. Bring your own mat and water. Followed by herbal tea.', 'sports', 'Stadspark Meppel', 'Stadspark, Meppel', 52.6980, 6.1920, NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', 10.00, 'Meppel Wellness', 28),
('Live Muziek bij Herberg ''t Plein', 'live-muziek-herberg-t-plein', 'Every Friday night, Herberg ''t Plein hosts live music from local Drenthe bands. From blues to rock. Free entry, great atmosphere.', 'music', 'Herberg ''t Plein', 'Marktplein 1, Meppel', 52.6962, 6.1958, NOW() + INTERVAL '5 days' + INTERVAL '19 hours', NOW() + INTERVAL '6 days' + INTERVAL '1 hour', NULL, 'Herberg ''t Plein', 150);
