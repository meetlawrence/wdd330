// js/modules/api-service.js
import { API_KEY, BASE_URL } from '../constants.js';

export const MovieAPI = {
  async fetchTrending() {
    try {
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      return [];
    }
  },

  async searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  }
};

console.log("I am alive! My path is correct.");