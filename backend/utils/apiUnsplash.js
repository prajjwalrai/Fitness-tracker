const axios = require('axios');

const unsplashClient = axios.create({
  baseURL: 'https://api.unsplash.com'
});

/**
 * Search fitness-related photos from Unsplash
 * @param {string} query - Search query (e.g., "fitness", "gym", "yoga")
 * @param {number} count - Number of photos to return
 * @returns {Array} Photo objects with URLs and attribution
 */
const searchPhotos = async (query = 'fitness', count = 6) => {
  try {
    const response = await unsplashClient.get('/search/photos', {
      params: {
        query,
        per_page: count,
        orientation: 'landscape',
        content_filter: 'high'
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    return response.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      full: photo.urls.full,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      color: photo.color
    }));
  } catch (error) {
    console.error('Unsplash API error:', error.message);
    return getDemoPhotos(query);
  }
};

/**
 * Get a random fitness photo
 */
const getRandomPhoto = async (query = 'fitness gym') => {
  try {
    const response = await unsplashClient.get('/photos/random', {
      params: { query, orientation: 'landscape', content_filter: 'high' },
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    const photo = response.data;
    return {
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      full: photo.urls.full,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      color: photo.color
    };
  } catch (error) {
    console.error('Unsplash random photo error:', error.message);
    const demos = getDemoPhotos(query);
    return demos[Math.floor(Math.random() * demos.length)];
  }
};

const getDemoPhotos = (query) => {
  return [
    { id: 'demo1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', alt: 'Gym equipment', photographer: 'Unsplash', photographerUrl: '#', color: '#1a1a2e' },
    { id: 'demo2', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200', thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', alt: 'Person working out', photographer: 'Unsplash', photographerUrl: '#', color: '#16213e' },
    { id: 'demo3', url: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200', thumb: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400', alt: 'Running track', photographer: 'Unsplash', photographerUrl: '#', color: '#0f3460' },
    { id: 'demo4', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', alt: 'Yoga session', photographer: 'Unsplash', photographerUrl: '#', color: '#533483' },
    { id: 'demo5', url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200', thumb: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400', alt: 'Fitness training', photographer: 'Unsplash', photographerUrl: '#', color: '#2b2d42' },
    { id: 'demo6', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200', thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', alt: 'Healthy food prep', photographer: 'Unsplash', photographerUrl: '#', color: '#3d5a80' }
  ];
};

module.exports = { searchPhotos, getRandomPhoto };
