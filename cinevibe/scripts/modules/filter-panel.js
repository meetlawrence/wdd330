// scripts/modules/filter-panel.js
export function renderGenreFilters(genres, container) {
  container.innerHTML = genres.map(genre => `
    <button class="filter-chip" data-id="${genre.id}">
      ${genre.name}
    </button>
  `).join('');
}

export function filterMovies(movies, activeGenreId) {
  if (!activeGenreId) return movies;
  // TMDB stores genres as an array of IDs in 'genre_ids'
  return movies.filter(movie => movie.genre_ids.includes(parseInt(activeGenreId)));
}