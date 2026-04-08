import { MovieAPI } from './modules/api-service.js';
import { createMovieCard } from './modules/movie-card.js';
// ADD THIS IMPORT BELOW
import { renderModalContent } from './modules/movie-detail.js';

const movieGrid = document.getElementById('movie-grid');
const modal = document.getElementById('mydialog');
const closeModal = document.getElementById('closeModal');

async function init() {
  console.log("App initializing..."); 
  
  try {
    const movies = await MovieAPI.fetchTrending();
    
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = '<p>No movies found. Check your API key.</p>';
        return;
    }

    movieGrid.innerHTML = '';
    movies.forEach(movie => {
      movieGrid.innerHTML += createMovieCard(movie);
    });
    
    // Update the trending count in the UI
    const movieCount = document.getElementById('movie-count');
    if (movieCount) movieCount.textContent = `${movies.length} movies currently trending`;

  } catch (error) {
    console.error("Initialization failed:", error);
  }

  // --- Click Event for Modal ---
  movieGrid.addEventListener('click', async (event) => {
    const card = event.target.closest('.movie-card');
    if (!card) return; 

    const movieId = card.dataset.id;
    console.log("Card clicked! ID:", movieId);

    try {
        const details = await MovieAPI.fetchMovieDetails(movieId);
        console.log("Details fetched:", details);
        
        // This will now work because of the import at the top
        renderModalContent(details, modal);
        
    } catch (error) {
      console.error("Failed to open modal:", error);
    }
  });

  // --- Close Modal Logic ---
  if (closeModal) {
    closeModal.addEventListener('click', () => modal.close());
  }
}

document.addEventListener('DOMContentLoaded', init);