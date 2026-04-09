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
  },

  async fetchMovieDetails(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,release_dates`
        );
        return await response.json();
    } catch (error) {
        console.error("Error fetching details:", error);
    }
  },

  async fetchGenres() {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      return data.genres;
    } catch (error) {
      console.error("Error fetching genres:", error);
      return [];
    }
  }
};
