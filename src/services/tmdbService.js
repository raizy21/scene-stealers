import config from '../config.js';

/**
 * Service class for handling TMDB API requests
 */
class TMDBService {
    /**
     * Fetches popular movies from TMDB API
     * @returns {Promise<Object>} JSON response containing popular movies
     */
    async getPopularMovies() {
        const response = await fetch(
            `${config.tmdbBaseUrl}/movie/popular?api_key=${config.tmdbApiKey}`
        );
        return await response.json();
    }

    /**
     * Fetches detailed information for a specific movie
     * @param {string} movieId - The ID of the movie to fetch
     * @returns {Promise<Object>} JSON response containing movie details
     */
    async getMovieDetails(movieId) {
        const response = await fetch(
            `${config.tmdbBaseUrl}/movie/${movieId}?api_key=${config.tmdbApiKey}`
        );
        return await response.json();
    }
}

export default new TMDBService();
