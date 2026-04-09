import { MovieAPI } from './modules/api-service.js';
import { createMovieCard } from './modules/movie-card.js';
import { renderModalContent } from './modules/movie-detail.js';

// --- DOM Elements ---
const movieGrid = document.getElementById('movie-grid');
const filterContainer = document.getElementById('filter-container');
const filterBtn = document.querySelector('.filter-button');
const modal = document.getElementById('mydialog');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('search-input');
const movieCount = document.getElementById('movie-count');
const bodyHeaderTitle = document.querySelector('.body-header-title');

// --- Global State ---
let allMovies = []; 

async function init() {
    try {
        // 1. Setup Sidebar Overlay
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }

        // 2. Fetch Initial Data (Trending + Genres)
        const [movies, genres] = await Promise.all([
            MovieAPI.fetchTrending(),
            MovieAPI.fetchGenres()
        ]);

        allMovies = movies;

        // 3. Initial UI Render
        renderGenres(genres);
        updateUI(allMovies, "Trending Now");

        // --- EVENT LISTENERS ---

        // A. Toggle Sidebar
        filterBtn.addEventListener('click', () => {
            filterContainer.classList.add('active');
            overlay.classList.add('active');
        });

        // B. Close Sidebar (Overlay Click)
        overlay.addEventListener('click', closeSidebar);

        // C. Filtering Logic (Sidebar Chips)
        filterContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;

            // Highlight Active Chip
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active-chip'));
            chip.classList.add('active-chip');

            // Apply Filter
            const genreId = chip.dataset.id;
            const filtered = (genreId === 'all') 
                ? allMovies 
                : allMovies.filter(m => m.genre_ids.includes(Number(genreId)));
            
            updateUI(filtered, genreId === 'all' ? "Trending Now" : `Genre: ${chip.textContent}`);
            closeSidebar();
        });

        // D. Search Functionality (Enter Key)
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    const results = await MovieAPI.searchMovies(query);
                    updateUI(results, `Search results for: "${query}"`);
                } else {
                    updateUI(allMovies, "Trending Now");
                }
            }
        });

        // E. Modal Opening (Event Delegation)
        movieGrid.addEventListener('click', async (event) => {
            const card = event.target.closest('.movie-card');
            if (!card) return;

            const movieId = card.dataset.id;
            try {
                const details = await MovieAPI.fetchMovieDetails(movieId);
                renderModalContent(details, modal);
                modal.showModal(); // Opens the <dialog>
            } catch (err) {
                console.error("Modal failed to load:", err);
            }
        });

        // F. Modal Closing
        if (closeModal) {
            closeModal.addEventListener('click', () => modal.close());
        }

    } catch (error) {
        console.error("CineVibe failed to initialize:", error);
    }
}

// --- Helper Functions ---

function updateUI(moviesList, title) {
    if (bodyHeaderTitle) bodyHeaderTitle.textContent = title;
    if (movieCount) movieCount.textContent = `${moviesList.length} titles found`;
    
    if (moviesList.length === 0) {
        movieGrid.innerHTML = '<p class="no-results">No movies match your criteria.</p>';
    } else {
        movieGrid.innerHTML = moviesList.map(m => createMovieCard(m)).join('');
    }
}

function renderGenres(genres) {
    filterContainer.innerHTML = `
        <div class="sidebar-header">
        </div>
        <button class="filter-chip active-chip" data-id="all">All Movies</button>
        ${genres.map(g => `<button class="filter-chip" data-id="${g.id}">${g.name}</button>`).join('')}
    `;
}

function closeSidebar() {
    filterContainer.classList.remove('active');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', init);