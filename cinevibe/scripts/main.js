// js/main.js
import { MovieAPI } from './modules/api-service.js';
import { createMovieCard } from './modules/movie-card.js';

const movieGrid = document.getElementById('movie-grid');

async function init() {
  console.log("App initializing..."); // Check if the script even starts
  
  try {
    const movies = await MovieAPI.fetchTrending();
    console.log("Movies fetched:", movies); // See if the API is actually returning data
    
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = '<p>No movies found. Check your API key.</p>';
        return;
    }

    movieGrid.innerHTML = '';
    movies.forEach(movie => {
      movieGrid.innerHTML += createMovieCard(movie);
    });
    console.log("Grid populated!");
    
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);