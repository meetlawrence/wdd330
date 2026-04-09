// scripts/modules/movie-detail.js

export function renderModalContent(movie, dialogElement) {
    const title = dialogElement.querySelector('#mytitle');
    const info = dialogElement.querySelector('#myinfo');

    const trailer = movie.videos.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    title.textContent = movie.title;

    info.innerHTML = `
        <div class="video-wrapper">
            ${trailer 
                ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>` 
                : `<div class="no-trailer">Trailer unavailable</div>`
            }
        </div>
        <div class="modal-details">
            <div class="stats-row">
                <span class="stat modal-rating">
                    <svg class="icon-small"><use href="assets/icons/sprites.svg#icon-rating"></use></svg>
                    ${movie.vote_average.toFixed(1)} <div class="rating-text">/ 10</div>
                </span>
                <span class="stat">
                    <svg class="icon-small"><use href="assets/icons/sprites.svg#icon-clock"></use></svg>
                    ${movie.runtime} min
                </span>
                <span class="stat">
                    <svg class="icon-small"><use href="assets/icons/sprites.svg#icon-calendar"></use></svg>
                    ${movie.release_date.split('-')[0]}
                </span>
            </div>
            <p class="overview">${movie.overview}</p>
            <div class="modal-actions">
                <a href="https://www.imdb.com/title/${movie.imdb_id}" target="_blank" class="btn-primary">View IMDb</a>
                <a href="https://www.reddit.com/r/movies/search/?q=${encodeURIComponent(movie.title)}" target="_blank" class="btn-secondary">Discuss on Reddit</a>
            </div>
        </div>
    `;

    dialogElement.showModal();
}