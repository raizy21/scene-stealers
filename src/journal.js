// Import required modules and functions
import tmdbService from './services/tmdbService.js';
import config from './config.js';
import { 
  getFavorites, 
  saveMovieReview, 
  getMovieReview, 
  addToWatchlist, 
  removeFromFavorites,
  isInWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInFavorites,
  addToFavorites
} from './dataStorage.js';

// State management for view switching (favorites/watchlist)
let currentView = 'favorites';
const favoritesBtn = document.getElementById('favorites-btn');
const watchlistBtn = document.getElementById('watchlist-btn');
const viewTitle = document.getElementById('view-title');

// Event listeners for view switching buttons
favoritesBtn.addEventListener('click', () => {
  currentView = 'favorites';
  updateViewButtons();
  displayMovies();
});

watchlistBtn.addEventListener('click', () => {
  currentView = 'watchlist';
  updateViewButtons();
  displayMovies();
});

/**
 * Updates the visual state of view toggle buttons
 * Changes button colors and title based on current view
 */
function updateViewButtons() {
  if (currentView === 'favorites') {
    favoritesBtn.classList.add('bg-primaryColor', 'text-white');
    favoritesBtn.classList.remove('text-primaryColor');
    watchlistBtn.classList.remove('bg-primaryColor', 'text-white');
    watchlistBtn.classList.add('text-primaryColor');
    viewTitle.textContent = 'My Favorite Movies';
  } else {
    watchlistBtn.classList.add('bg-primaryColor', 'text-white');
    watchlistBtn.classList.remove('text-primaryColor');
    favoritesBtn.classList.remove('bg-primaryColor', 'text-white');
    favoritesBtn.classList.add('text-primaryColor');
    viewTitle.textContent = 'My Watchlist';
  }
}

/**
 * Main function to display movies from favorites or watchlist
 * Fetches additional movie details and creates movie cards
 */
async function displayMovies() {
  // Get movies based on current view
  const movies = currentView === 'favorites' ? getFavorites() : getWatchlist();
  const container = document.getElementById("fav-movie-cards");

  // Handle empty states
  if (!container) return;
  container.innerHTML = "";

  if (movies.length === 0) {
    // Show message when no movies are found
    container.innerHTML = `
      <div class="col-span-full text-center text-white text-xl">
        No movies in your ${currentView} yet!
      </div>
    `;
    return;
  }

  // Set up container layout
  container.className = "grid grid-cols-1 gap-8 w-full max-w-7xl px-4";

  // Create movie cards
  for (const movie of movies) {
    // Fetch extended movie information from TMDB
    const details = await tmdbService.getMovieDetails(movie.id);
    const movieCard = document.createElement("div");
    movieCard.className = "bg-white rounded-lg overflow-hidden shadow-lg p-6 flex flex-col md:flex-row gap-6";
    const review = getMovieReview(movie.id);
    const inWatchlist = isInWatchlist(movie.id);

    movieCard.innerHTML = `
      <div class="w-full md:w-1/3 flex-shrink-0 flex flex-col gap-4">
        <div class="aspect-[2/3] w-full relative">
          <img 
            src="${movie.poster_path ? config.imageBaseUrl + movie.poster_path : 'images/no-poster.jpg'}"
            alt="${movie.title} Poster"
            class="w-full h-full object-cover rounded-lg shadow-md absolute"
          />
        </div>
        
        <div class="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            class="${isInFavorites(movie.id) ? 'delete-favorite bg-red-500 hover:bg-red-600' : 'add-favorite bg-green-500 hover:bg-green-600'} 
            text-white px-4 py-2 rounded-lg flex-1 sm:flex-initial flex items-center justify-center gap-2 transition-colors min-w-[120px]"
            title="${isInFavorites(movie.id) ? 'Remove from favorites' : 'Add to favorites'}"
          >
            <i class="fa-${isInFavorites(movie.id) ? 'solid fa-trash' : 'regular fa-heart'} text-xl"></i>
            <span class="whitespace-nowrap">${isInFavorites(movie.id) ? 'Remove' : 'Favorite'}</span>
          </button>
          
          <button
            class="add-watchlist text-white px-4 py-2 rounded-lg flex-1 sm:flex-initial flex items-center justify-center gap-2 transition-colors min-w-[120px]
            ${inWatchlist ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'}"
          >
            <i class="fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'} text-xl"></i>
            <span class="whitespace-nowrap">${inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>
      
      <div class="flex-1 flex flex-col min-w-0">
        <div class="mb-4">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-2xl font-bold">${movie.title}</h3>
            <span class="text-sm bg-primaryColor text-white px-2 py-1 rounded">
              ${details.vote_average.toFixed(1)}/10
            </span>
          </div>
          <p class="text-gray-600">${new Date(movie.release_date).getFullYear()} • ${details.runtime} min • ${details.genres.map(g => g.name).join(', ')}</p>
        </div>

        <div class="space-y-4 mb-6">
          <p class="text-gray-700">${movie.overview || 'No overview available.'}</p>
          
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            ${details.tagline ? `<p class="text-gray-500 italic">"${details.tagline}"</p>` : ''}
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600"><strong>Status:</strong> ${details.status}</p>
                <p class="text-sm text-gray-600"><strong>Original Language:</strong> ${details.original_language.toUpperCase()}</p>
                ${details.homepage ? `<p class="text-sm text-gray-600"><strong>Website:</strong> <a href="${details.homepage}" target="_blank" class="text-primaryColor hover:underline">Visit</a></p>` : ''}
              </div>
              <div>
                <p class="text-sm text-gray-600"><strong>Budget:</strong> ${details.budget > 0 ? `$${(details.budget / 1000000).toFixed(1)}M` : 'N/A'}</p>
                <p class="text-sm text-gray-600"><strong>Revenue:</strong> ${details.revenue > 0 ? `$${(details.revenue / 1000000).toFixed(1)}M` : 'N/A'}</p>
                <p class="text-sm text-gray-600"><strong>Release:</strong> ${new Date(details.release_date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="font-semibold">Cast</h4>
            <div class="flex flex-wrap gap-2">
              ${details.credits.cast.slice(0, 5).map(actor => `
                <span class="bg-gray-100 px-2 py-1 rounded text-sm">
                  ${actor.name} as ${actor.character}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="font-semibold">Crew</h4>
            <div class="flex flex-wrap gap-2">
              ${details.credits.crew
                .filter(person => ['Director', 'Producer', 'Screenplay'].includes(person.job))
                .slice(0, 3)
                .map(person => `
                  <span class="bg-gray-100 px-2 py-1 rounded text-sm">
                    ${person.name} (${person.job})
                  </span>
                `).join('')}
            </div>
          </div>
        
        <div class="mt-auto">
          <h4 class="font-bold text-xl mb-4">Your Review</h4>
          <div class="flex items-center gap-3 mb-4">
            <div class="flex">
              ${[1,2,3,4,5,6,7,8,9,10].map(star => `
                <button class="star-rating-btn text-3xl ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform" data-rating="${star}">
                  <i class="fa-solid fa-star"></i>
                </button>
              `).join('')}
            </div>
            <span class="text-lg text-gray-500">(${review.rating || 0}/10)</span>
          </div>
          
          <textarea
            class="movie-comment w-full border rounded-lg p-4 mb-4 min-h-[120px] text-gray-700"
            placeholder="Share your thoughts about the movie..."
            data-movie-id="${movie.id}"
            rows="4"
          >${review.comment || ''}</textarea>
          <button
            class="save-review bg-primaryColor text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors w-full md:w-auto"
            data-movie-id="${movie.id}"
          >
            Save Review
          </button>
        </div>
      </div>
    `;

    // Add interactive elements
    // Star rating system
    const stars = movieCard.querySelectorAll('.star-rating-btn');
    let currentRating = review.rating || 0;
    
    // Handle star rating clicks
    stars.forEach(star => {
      star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        stars.forEach(s => {
          const starRating = parseInt(s.dataset.rating);
          s.classList.toggle('text-yellow-400', starRating <= currentRating);
          s.classList.toggle('text-gray-300', starRating > currentRating);
        });
      });
    });

    // Set up favorite button functionality
    const favoriteBtn = movieCard.querySelector('.delete-favorite, .add-favorite');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        // Handle adding/removing from favorites
        if (isInFavorites(movie.id)) {
          if (confirm(`Remove ${movie.title} from favorites?`)) {
            removeFromFavorites(movie.id);
            displayMovies(); // Refresh the display
          }
        } else {
          if (addToFavorites(movie)) {
            alert(`${movie.title} added to favorites!`);
            displayMovies(); // Refresh the display
          }
        }
      });
    }

    // Watchlist button event listener
    const watchlistBtn = movieCard.querySelector('.add-watchlist');
    watchlistBtn.addEventListener('click', () => {
      if (isInWatchlist(movie.id)) {
        if (confirm(`Remove ${movie.title} from watchlist?`)) {
          removeFromWatchlist(movie.id);
          if (currentView === 'watchlist') {
            displayMovies(); // Refresh the entire display if in watchlist view
          } else {
            // Update button appearance without full refresh
            watchlistBtn.classList.replace('bg-gray-500', 'bg-green-500');
            watchlistBtn.classList.replace('hover:bg-gray-600', 'hover:bg-green-600');
            watchlistBtn.innerHTML = `
              <i class="fa-solid fa-bookmark text-xl"></i>
              <span class="whitespace-nowrap">Add to Watchlist</span>
            `;
          }
        }
      } else {
        addToWatchlist(movie);
        alert(`${movie.title} added to watchlist!`);
        // Update button appearance immediately
        watchlistBtn.classList.replace('bg-green-500', 'bg-gray-500');
        watchlistBtn.classList.replace('hover:bg-green-600', 'hover:bg-gray-600');
        watchlistBtn.innerHTML = `
          <i class="fa-solid fa-check text-xl"></i>
          <span class="whitespace-nowrap">Remove from Watchlist</span>
        `;
      }
    });

    // Handle review saving
    const saveButton = movieCard.querySelector('.save-review');
    saveButton.addEventListener('click', () => {
      // Save user review and rating
      const movieId = saveButton.dataset.movieId;
      const comment = movieCard.querySelector('.movie-comment').value;
      
      saveMovieReview(movieId, { 
        rating: currentRating, 
        comment: comment 
      });
      alert('Review saved!');
    });

    container.appendChild(movieCard);
  }
}

// Initialize the page
updateViewButtons();
displayMovies();
