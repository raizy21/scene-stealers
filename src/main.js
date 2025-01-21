import tmdbService from './services/tmdbService.js';
import config from './config.js';

//selector
const hamburger = document.querySelector("#hamburger-menu");
const header = document.querySelector("#header");

//hamburger click
hamburger.addEventListener("click", () => {
  // console.log("clicked");
  // document.querySelector(".navigation").classList.toggle("change");

  const navbar = document.querySelector("#navbar");

  //links
  const linkHome = document.querySelector("#linkHome");
  const linkJournal = document.querySelector("#linkJournal");
  const linkEvents = document.querySelector("#linkEvents");
  const linkRegister = document.querySelector("#linkRegister");

  if (linkHome.style.display === "none") {
    navbar.classList.add("flex-col");

    //display links
    linkHome.style.display = "block";
    linkJournal.style.display = "block";
    linkEvents.style.display = "block";
    linkRegister.style.display = "block";

    hamburger.style.display = "none";
  } else {
    navbar.classList.remove("flex-col");
    navbar.classList.add("flex-row", "items-center", "justify-center");

    //hide links
    linkHome.style.display = "none";
    linkJournal.style.display = "none";
    linkEvents.style.display = "none";
    linkRegister.style.display = "none";

    hamburger.style.display = "block";
  }
});

/**
 * Fetches and displays popular movies in the movie container
 * Creates movie cards with poster, title, year, and rating
 */
async function displayMovies() {
  try {
      // Fetch popular movies from TMDB
      const movies = (await tmdbService.getPopularMovies()).results;
      const movieContainer = document.getElementById('movie-cards');
      
      if (!movieContainer) return;
      
      movieContainer.innerHTML = ''; // Clear existing content
      
      // Create and append movie cards
      movies.forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.className = 'bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all';
          movieCard.innerHTML = `
              <img class="w-full h-auto" 
                   src="${movie.poster_path ? config.imageBaseUrl + movie.poster_path : 'src/images/no-poster.jpg'}" 
                   alt="${movie.title}">
              <div class="p-4">
                  <h3 class="text-xl font-bold mb-2">${movie.title}</h3>
                  <p class="text-gray-700 text-base">${new Date(movie.release_date).getFullYear()}</p>
                  <p class="text-gray-600 text-sm mt-2">Rating: ${movie.vote_average}/10</p>
              </div>
          `;
          movieContainer.appendChild(movieCard);
      });
  } catch (error) {
      console.error('Error fetching movies:', error);
  }
}

// Initialize the movie display on page load
displayMovies();