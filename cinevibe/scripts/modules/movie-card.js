export function createMovieCard(movie) {
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : 'assets/placeholder-poster.png';

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="trending-badge" title="Trending Now">
        <div>
          <svg class="icon-trending"><use href="assets/icons/sprites.svg#icon-trending"></use></svg>
        </div>
        <div>
          <p>Trending</p>
        </div> 
      </div>
      
      <img src="${posterPath}" alt="${movie.title}" loading="lazy">
      
      <div class="card-info">
        <h3>${movie.title}</h3>
        <div class="meta">
          <span class="rating">
            <svg class="icon-star"><use href="assets/icons/sprites.svg#icon-rating"></use></svg>
            ${movie.vote_average.toFixed(1)}
          </span>
          <span class="year">${movie.release_date?.split('-')[0] || 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
}