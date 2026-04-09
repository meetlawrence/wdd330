export const FilterService = {
    // Filter movies by genre ID
    filterByGenre(movies, genreId) {
        if (genreId === 'all') return movies;
        return movies.filter(m => m.genre_ids.includes(Number(genreId)));
    },

    filterByRating(movies, rating) {
        if (rating === 'all') return movies;

        return movies.filter(movie => {
            // 1. Check if the movie already has a certification (for future-proofing)
            if (movie.certification === rating) return true;

            // 2. Fallback Logic: Map genres/data to ratings
            const isAdult = movie.adult === true;
            const genres = movie.genre_ids || [];

            // Horror (27) or Crime (80) + Adult usually = R
            if (rating === 'R') {
                return isAdult || genres.includes(27) || genres.includes(80);
            }
            
            // Animation (16) or Family (10751) = G or PG
            if (rating === 'G' || rating === 'PG') {
                return genres.includes(10751) || genres.includes(16);
            }

            // Everything else we'll treat as PG-13 for now
            if (rating === 'PG-13') {
                return !isAdult && !genres.includes(10751);
            }

            return false;
        });
    },
    
    // Sort movies by rating
    sortByRating(movies) {
        return [...movies].sort((a, b) => b.vote_average - a.vote_average);
    }
};