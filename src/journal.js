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
  getWatchlist 
} from './dataStorage.js';

//selector
const hamburger = document.querySelector("#hamburger-menu");
const navbarMobile = document.querySelector("#navbar-mobile");
const exitHamburgerMenu = document.querySelector("#exit-hamburger-menu");

//hamburger click
hamburger.addEventListener("click", () => {
  // console.log("clicked");
  navbarMobile.classList.add(
    "w-[100%vw]",
    "h-[100vh]",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-primaryColor",
    "bg-primaryColor"
  );
  hamburger.classList.add("hidden");
  exitHamburgerMenu.classList.remove("hidden");
  exitHamburgerMenu.classList.add("block");
});

//exit click

//exitHamburgerMenu click
exitHamburgerMenu.addEventListener("click", () => {
  // console.log("clicked");
  navbarMobile.classList.remove(
    "w-[100%vw]",
    "h-[100vh]",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-primaryColor",
    "bg-primaryColor",
    "block"
  );
  hamburger.classList.remove("hidden");
  exitHamburgerMenu.classList.remove("block");
  exitHamburgerMenu.classList.add("hidden");
  navbarMobile.classList.add("hidden");
});

// Add view state and toggle buttons
let currentView = 'favorites';
const favoritesBtn = document.getElementById('favorites-btn');
const watchlistBtn = document.getElementById('watchlist-btn');
const viewTitle = document.getElementById('view-title');

// Toggle button event listeners
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

// Replace displayFavorites with a more generic displayMovies function
async function displayMovies() {
  const movies = currentView === 'favorites' ? getFavorites() : getWatchlist();
  const container = document.getElementById("fav-movie-cards");

  if (!container) return;
  container.innerHTML = "";

  if (movies.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center text-white text-xl">
        No movies in your ${currentView} yet!
      </div>
    `;
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.className = "bg-white rounded-lg overflow-hidden shadow-lg p-4";
    const review = getMovieReview(movie.id);
    const inWatchlist = isInWatchlist(movie.id);

    movieCard.innerHTML = `
      <div class="flex justify-end gap-2 mb-2">
        <button
          class="delete-favorite text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600"
          data-movie-id="${movie.id}"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
        <button
          class="add-watchlist text-white ${inWatchlist ? 'bg-gray-500' : 'bg-green-500'} px-2 py-1 rounded hover:opacity-80"
          data-movie-id="${movie.id}"
        >
          <i class="fa-solid ${inWatchlist ? 'fa-check' : 'fa-bookmark'}"></i>
          ${inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
      </div>
      
      <img 
        src="${movie.poster_path ? config.imageBaseUrl + movie.poster_path : 'images/no-poster.jpg'}"
        alt="${movie.title} Poster"
        class="w-full h-auto rounded-lg mb-4"
      />
      <div class="space-y-4">
        <h3 class="text-xl font-bold">${movie.title}</h3>
        <p class="text-gray-700">${new Date(movie.release_date).getFullYear()}</p>
        <p class="text-gray-600">Rating: ${movie.vote_average}</p>
        <p class="text-sm text-gray-600">${movie.overview || 'No overview available.'}</p>
        
        <div class="border-t pt-4 mt-4">
          <h4 class="font-bold mb-2">Your Review</h4>
          <div class="flex items-center mb-2">
            <label class="mr-2">Rating:</label>
            <select class="movie-rating border rounded p-1" data-movie-id="${movie.id}">
              ${[1,2,3,4,5,6,7,8,9,10].map(num => 
                `<option value="${num}" ${review.rating === num ? 'selected' : ''}>${num}</option>`
              ).join('')}
            </select>
          </div>
          <textarea
            class="movie-comment w-full border rounded p-2 mb-2"
            placeholder="Add your comments..."
            data-movie-id="${movie.id}"
            rows="3"
          >${review.comment || ''}</textarea>
          <button
            class="save-review bg-primaryColor text-white px-4 py-2 rounded hover:bg-opacity-90"
            data-movie-id="${movie.id}"
          >
            Save Review
          </button>
        </div>
      </div>
    `;

    // Add event listeners for new buttons
    const deleteBtn = movieCard.querySelector('.delete-favorite');
    deleteBtn.addEventListener('click', () => {
      if (confirm(`Remove ${movie.title} from favorites?`)) {
        removeFromFavorites(movie.id);
        movieCard.remove();
      }
    });

    const watchlistBtn = movieCard.querySelector('.add-watchlist');
    watchlistBtn.addEventListener('click', () => {
      const isCurrentlyInWatchlist = watchlistBtn.classList.contains('bg-gray-500');
      
      if (isCurrentlyInWatchlist) {
        removeFromWatchlist(movie.id);
        watchlistBtn.classList.replace('bg-gray-500', 'bg-green-500');
        watchlistBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i> Add to Watchlist';
      } else {
        addToWatchlist(movie);
        watchlistBtn.classList.replace('bg-green-500', 'bg-gray-500');
        watchlistBtn.innerHTML = '<i class="fa-solid fa-check"></i> Remove from Watchlist';
      }
    });

    // Add event listener for save button
    const saveButton = movieCard.querySelector('.save-review');
    saveButton.addEventListener('click', () => {
      const movieId = saveButton.dataset.movieId;
      const rating = parseInt(movieCard.querySelector('.movie-rating').value);
      const comment = movieCard.querySelector('.movie-comment').value;
      
      saveMovieReview(movieId, { rating, comment });
      alert('Review saved!');
    });

    container.appendChild(movieCard);
  });
}

// Initialize the view
updateViewButtons();
displayMovies();
