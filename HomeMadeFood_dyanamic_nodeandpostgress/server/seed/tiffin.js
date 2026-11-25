// Data moved here from the old TiffinService page. Edit prices in the DB afterwards (or here + re-seed).
export const tiffinPlans = [
  { name: "Regular Veg Tiffin", category: "Tiffin Service", price: 100, weight: "1 Meal", description: "4 chapatis, seasonal sabzi, dal and rice.", emoji: "🍱", tag: "Daily Favourite", healthy: true, featured: true },
  { name: "Mini Veg Tiffin", category: "Tiffin Service", price: 70, weight: "1 Meal", description: "3 chapatis, seasonal sabzi and dal.", emoji: "🥗", tag: "Budget Friendly", healthy: true, featured: false },
  { name: "Special Veg Thali", category: "Tiffin Service", price: 150, weight: "1 Meal", description: "Chapatis, two sabzis, dal, rice, salad and sweet.", emoji: "🍛", tag: "Special", healthy: true, featured: true },
  { name: "Dal Rice Tiffin", category: "Tiffin Service", price: 80, weight: "1 Meal", description: "Comforting dal, steamed rice and homemade pickle.", emoji: "🍚", tag: "Comfort Food", healthy: true, featured: false },
  { name: "Chapati Sabzi Tiffin", category: "Tiffin Service", price: 90, weight: "1 Meal", description: "Fresh chapatis with seasonal homemade sabzi.", emoji: "🫓", tag: "Homemade", healthy: true, featured: false },
  { name: "Premium Tiffin", category: "Tiffin Service", price: 180, weight: "1 Meal", description: "Chapatis, paneer sabzi, dal, rice, salad and sweet.", emoji: "🍲", tag: "Premium", healthy: false, featured: true },
];

// "Complete your meal" items. category_slug is derived from `slug`.
export const extras = [
  { name: "Gulab Jamun", description: "Soft, syrup-filled traditional Indian sweet.", price: 40, emoji: "🍮", category: "Sweets", slug: "sweets" },
  { name: "Kaju Katli", description: "Delicious cashew sweet for a special treat.", price: 60, emoji: "🍬", category: "Sweets", slug: "sweets" },
  { name: "Homemade Mango Pickle", description: "Traditional tangy and spicy mango pickle.", price: 30, emoji: "🥒", category: "Pickles", slug: "pickles" },
  { name: "Lemon Pickle", description: "Homemade lemon pickle with authentic flavours.", price: 25, emoji: "🍋", category: "Pickles", slug: "pickles" },
  { name: "Fresh Lime Juice", description: "Refreshing lime drink to accompany your meal.", price: 35, emoji: "🍋", category: "Drinks", slug: "drinks" },
  { name: "Masala Chaas", description: "Cooling buttermilk with a hint of Indian spices.", price: 25, emoji: "🥤", category: "Drinks", slug: "drinks" },
];

// Same numbers as the original page: base size + chapatis*8 + sabzi*15 + extras.
export const tiffinOptions = [
  { kind: "size", code: "Mini", label: "Mini", description: "Small appetite", price: 40, sort: 1 },
  { kind: "size", code: "Regular", label: "Regular", description: "Everyday meal", price: 60, sort: 2 },
  { kind: "size", code: "Premium", label: "Premium", description: "Extra-special meal", price: 90, sort: 3 },
  { kind: "chapati", code: "2", label: "2 chapatis", price: 16, sort: 1 },
  { kind: "chapati", code: "4", label: "4 chapatis", price: 32, sort: 2 },
  { kind: "chapati", code: "6", label: "6 chapatis", price: 48, sort: 3 },
  { kind: "sabzi", code: "1", label: "1 serving", price: 15, sort: 1 },
  { kind: "sabzi", code: "2", label: "2 servings", price: 30, sort: 2 },
  { kind: "extra", code: "dal", label: "Dal", price: 20, sort: 1 },
  { kind: "extra", code: "rice", label: "Rice", price: 20, sort: 2 },
  { kind: "extra", code: "salad", label: "Salad", price: 10, sort: 3 },
  { kind: "extra", code: "sweet", label: "Sweet", price: 20, sort: 4 },
];
