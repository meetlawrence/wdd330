import { MovieAPI } from './modules/api-service.js';
import { createMovieCard } from './modules/movie-card.js';
import { renderModalContent } from './modules/movie-detail.js';

// Elements
const movieGrid = document.getElementById('movie-grid');
const filterContainer = document.getElementById('filter-container');
const filterBtn = document.querySelector('.filter-button');

let allMovies = []; // Memory state

async function init() {
    try {
        // 1. Fetch Movies AND Genres
        const [movies, genres] = await Promise.all([
            MovieAPI.fetchTrending(),
            MovieAPI.fetchGenres() // Ensure this is in your api-service.js
        ]);

        allMovies = movies;

        // 2. Initial Render
        renderGenres(genres);
        renderGrid(allMovies);

        // 3. Toggle Filter Drawer
        filterBtn.addEventListener('click', () => {
            console.log("Filter button clicked!");
            
            // Toggle a 'hidden' class or check the display style
            if (filterContainer.style.display === 'flex') {
                filterContainer.style.display = 'none';
            } else {
                filterContainer.style.display = 'flex';
            }
        });

        // 4. Handle Filtering
        filterContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;

            // UI feedback
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active-chip'));
            chip.classList.add('active-chip');

            // Filter Logic
            const genreId = chip.dataset.id;
            const filtered = (genreId === 'all') 
                ? allMovies 
                : allMovies.filter(m => m.genre_ids.includes(Number(genreId)));
            
            renderGrid(filtered);
        });

  } catch (err) { console.error(err); }
  
  

}

function renderGenres(genres) {
    filterContainer.innerHTML = `<button class="filter-chip active-chip" data-id="all">All</button>` +
        genres.map(g => `<button class="filter-chip" data-id="${g.id}">${g.name}</button>`).join('');
}

function renderGrid(list) {
    movieGrid.innerHTML = list.map(m => createMovieCard(m)).join('');
}

document.addEventListener('DOMContentLoaded', init);