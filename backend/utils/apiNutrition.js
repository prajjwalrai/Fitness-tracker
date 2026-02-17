const axios = require('axios');

const ninjaClient = axios.create({
  baseURL: 'https://api.api-ninjas.com/v1'
});

/**
 * Search for nutrition data using API Ninjas Nutrition API
 * @param {string} query - Food item or natural language string (e.g., "1lb chicken breast")
 * @returns {Array} Parsed food items with nutrition info
 */
const searchFood = async (query) => {
  if (!query) return [];
  try {
    const response = await ninjaClient.get('/nutrition', {
      params: { query },
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });

    // API Ninjas returns an array of items for the query
    const foods = response.data.map((item, index) => {
      return {
        foodId: `ninja_${Date.now()}_${index}`,
        label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
        calories: Math.round(item.calories || 0),
        protein: Math.round((item.protein_g || 0) * 10) / 10,
        fat: Math.round((item.fat_total_g || 0) * 10) / 10,
        carbs: Math.round((item.carbohydrates_total_g || 0) * 10) / 10,
        fiber: Math.round((item.fiber_g || 0) * 10) / 10,
        servingSize: `${item.serving_size_g}g`,
        category: 'Food'
      };
    });

    return foods;
  } catch (error) {
    console.error('API Ninjas Nutrition error:', error.message);
    // Return demo data if API fails or key is missing
    return getDemoFoods(query);
  }
};

const getDemoFoods = (query) => {
  const demoDb = [
    { foodId: 'demo_1', label: 'Chicken Breast', calories: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, category: 'Poultry', servingSize: '100g' },
    { foodId: 'demo_2', label: 'Brown Rice', calories: 216, protein: 5, fat: 1.8, carbs: 45, fiber: 3.5, category: 'Grains', servingSize: '100g' },
    { foodId: 'demo_3', label: 'Banana', calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, category: 'Fruit', servingSize: '100g' },
    { foodId: 'demo_4', label: 'Greek Yogurt', calories: 59, protein: 10, fat: 0.7, carbs: 3.6, fiber: 0, category: 'Dairy', servingSize: '100g' },
    { foodId: 'demo_5', label: 'Egg', calories: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0, category: 'Protein', servingSize: '100g' },
    { foodId: 'demo_6', label: 'Salmon', calories: 208, protein: 20, fat: 13, carbs: 0, fiber: 0, category: 'Seafood', servingSize: '100g' },
    { foodId: 'demo_7', label: 'Sweet Potato', calories: 86, protein: 1.6, fat: 0.1, carbs: 20, fiber: 3, category: 'Vegetables', servingSize: '100g' },
    { foodId: 'demo_8', label: 'Oatmeal', calories: 68, protein: 2.4, fat: 1.4, carbs: 12, fiber: 1.7, category: 'Grains', servingSize: '100g' },
    { foodId: 'demo_9', label: 'Broccoli', calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, category: 'Vegetables', servingSize: '100g' },
    { foodId: 'demo_10', label: 'Almonds', calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12.5, category: 'Nuts', servingSize: '100g' }
  ];
  const q = query.toLowerCase();
  const filtered = demoDb.filter(f => f.label.toLowerCase().includes(q));
  return filtered.length > 0 ? filtered : demoDb.slice(0, 5);
};

module.exports = { searchFood };
