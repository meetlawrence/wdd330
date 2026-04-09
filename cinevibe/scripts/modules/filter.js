export function renderGenreChips(genres, container) {
  // Add an "All" chip first
  let html = `<button class="filter-chip active" data-id="all">All</button>`;
  
  html += genres.map(genre => `
    <button class="filter-chip" data-id="${genre.id}">
      ${genre.name}
    </button>
  `).join('');

  container.innerHTML = html;
}

export function applyFilters(movies, activeGenreId) {
  if (activeGenreId === 'all') return movies;
  return movies.filter(movie => movie.genre_ids.includes(parseInt(activeGenreId)));
}