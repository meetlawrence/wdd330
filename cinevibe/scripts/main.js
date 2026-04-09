import { MovieAPI } from './modules/api-service.js';
import { createMovieCard } from './modules/movie-card.js';
import { renderModalContent } from './modules/movie-detail.js';
import { FilterService } from './modules/filter-service.js';
import { FilterPanel } from './modules/filter-panel.js';

// --- DOM Elements ---
const movieGrid = document.getElementById('movie-grid');
const filterContainer = document.getElementById('filter-container');
const filterBtn = document.querySelector('.filter-button');
const modal = document.getElementById('mydialog');
const closeModal = document.getElementById('closeModal');
const searchInput = document.getElementById('search-input');
const movieCount = document.getElementById('movie-count');
const bodyHeaderTitle = document.querySelector('.body-header-title');

let allMovies = [];

async function init() {
    // 1. Setup Overlay
    let overlay = document.querySelector('.sidebar-overlay') || createOverlay();

    try {
        // 2. Load Data
        const [movies, genres] = await Promise.all([
            MovieAPI.fetchTrending(), 
            MovieAPI.fetchGenres()
        ]);
        allMovies = movies;

        // 3. Initial Render
        FilterPanel.render(filterContainer, genres);
        updateUI(allMovies, "Trending Now");

        // --- EVENT LISTENERS ---

        // A. Sidebar Toggle
        filterBtn.addEventListener('click', () => FilterPanel.toggle(filterContainer, overlay, true));
        overlay.addEventListener('click', () => FilterPanel.toggle(filterContainer, overlay, false));

        // B. Filtering & Sorting Logic
        filterContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;

            let filteredList = [...allMovies];
            let title = "Trending Now";
            const type = chip.dataset.type;
            const id = chip.dataset.id;

            if (chip.id === 'sort-rating') {
                filteredList = FilterService.sortByRating(allMovies);
                title = "Top Rated Movies";
            } else if (type === 'rating') {
                filteredList = FilterService.filterByRating(allMovies, id);
                title = (id === 'all') ? "All Ratings" : `Rated: ${id}`;
            } else if (type === 'genre') {
                filteredList = FilterService.filterByGenre(allMovies, id);
                title = (id === 'all') ? "All Genres" : `Genre: ${chip.textContent}`;
            }

            FilterPanel.setActiveChip(chip);
            updateUI(filteredList, title);
            FilterPanel.toggle(filterContainer, overlay, false);
        });

        // C. Search Functionality
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

        // D. Modal Opening (Event Delegation)
        movieGrid.addEventListener('click', async (event) => {
            const card = event.target.closest('.movie-card');
            if (!card) return;

            const movieId = card.dataset.id;
            try {
                const details = await MovieAPI.fetchMovieDetails(movieId);
                renderModalContent(details, modal);
                modal.showModal(); 
            } catch (err) {
                console.error("Modal failed to load:", err);
            }
        });

        // E. Modal Closing
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
    
    // Clear and re-render to trigger entrance animations
    movieGrid.innerHTML = ''; 

    if (moviesList.length === 0) {
        movieGrid.innerHTML = '<p class="no-results">No movies match your criteria.</p>';
    } else {
        movieGrid.innerHTML = moviesList.map(m => createMovieCard(m)).join('');
    }
}

function createOverlay() {
    const ov = document.createElement('div');
    ov.className = 'sidebar-overlay';
    document.body.appendChild(ov);
    return ov;
}

document.addEventListener('DOMContentLoaded', init);