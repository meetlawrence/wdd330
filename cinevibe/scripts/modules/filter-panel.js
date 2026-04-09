export const FilterPanel = {
    render(container, genres) {
        // Define the genres you actually want to show
        const allowedGenres = [
            'Action', 'Adventure', 'Animation', 'Comedy', 
            'Drama', 'Horror', 'Science Fiction', 'Thriller'
        ];

        // 2. Filter the incoming list from the API
        const filteredGenres = genres.filter(g => allowedGenres.includes(g.name));

        const ratingInfo = [
            { id: 'G', label: 'General Audiences' },
            { id: 'PG', label: 'Parental Guidance' },
            { id: 'PG-13', label: 'Parents Cautioned' },
            { id: 'R', label: 'Restricted' }
        ];
        
        container.innerHTML = `
            <div class="sidebar-header">
              <div class="filter-icon">
                <svg class="icon-small"><use href="assets/icons/sprites.svg#icon-filter"></use></svg>
              </div>
              <h3>Filters</h3>
            </div>
            <div class="filter-section">
              <div class="sidebar-header">
                <div class="shield-icon">
                    <svg class="icon-small"><use href="assets/icons/sprites.svg#icon-shield"></use></svg>
                </div>
                <div>
                    <h4>Parental Controls</h4>
                </div>
              </div>
                <button class="filter-chip rating-btn active-chip" data-type="rating" data-id="all"><strong>All Ratings</strong><span>Show All Movies</span></button>
                ${ratingInfo.map(r => `
                    <button class="filter-chip rating-btn" data-type="rating" data-id="${r.id}">
                        <strong>${r.id}</strong> <span>${r.label}</span>
                    </button>
                `).join('')}
            </div>

            <hr class="sidebar-divider">

            <div class="sidebar-header">
              <div class="genre-icon">
                  <svg class="icon-small">
                      <use href="assets/icons/sprites.svg#icon-genre"></use>
                  </svg>
              </div>
              <h3>Genres</h3>
            </div>
            <div class="filter-section">
                <div class="genre-grid">
                    <button class="filter-chip" data-type="genre" data-id="all">All Genres</button>
                    ${filteredGenres.map(g => `
                        <button class="filter-chip" data-type="genre" data-id="${g.id}">${g.name}</button>
                    `).join('')}
                </div>
            </div>

            <hr class="sidebar-divider">
            
            <button class="filter-chip sort-btn" id="sort-rating">Sort by TMDB Score</button>
        `;
    },

    toggle(container, overlay, isOpen) {
        if (isOpen) {
            container.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        } else {
            container.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    },

    setActiveChip(chip) {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active-chip'));
        chip.classList.add('active-chip');
    }
};