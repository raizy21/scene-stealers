import tmdbService from "./services/tmdbService.js";
import config from "./config.js";
import { addToFavorites, isInFavorites } from "./dataStorage.js";

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
    const movieContainer = document.getElementById("movie-cards");

    if (!movieContainer) return;

    movieContainer.innerHTML = ""; // Clear existing content

    // Create and append movie cards
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className =
        "bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all";

      const movieImage = document.createElement("img");
      movieImage.className = "w-full h-auto";
      movieImage.alt = `${movie.title}Poster`;
      movieImage.src = movie.poster_path
        ? config.imageBaseUrl + movie.poster_path
        : "src/images/no-poster.jpg";

      const movieDetails = document.createElement("div");
      movieDetails.className = "p-4";

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = movie.title;
      movieTitle.className = "text-xl font-bold mb-2";

      const movieDate = document.createElement("p");
      movieDate.className = "text-gray-700 text-base";
      movieDate.textContent = new Date(movie.release_date).getFullYear();

      const movieRating = document.createElement("p");
      movieRating.className = "text-gray-600 text-sm mt-2";
      movieRating.textContent = movie.vote_average;

      const btnContainer = document.createElement("div");
      btnContainer.className =
        "flex justify-end items-center bg-[#a5b4fc] z-50 px-4 py-2";

      const heart = document.createElement("img");
      heart.className = "w-8";
      heart.src = "src/images/heart-regular.svg";

      const favBtn = document.createElement("a");
      favBtn.className = " px-4 py-2 rounded-lg text-white cursor-pointer";

      favBtn.addEventListener("click", () => {
        if (isInFavorites(movie.id)) {
          alert(`${movie.title} is already in your favorites!`);
          return;
        }
        
        if (addToFavorites(movie)) {
          alert(`${movie.title} added to favorites!`);
        }
      });

      favBtn.appendChild(heart);
      btnContainer.appendChild(favBtn);

      movieDetails.appendChild(movieTitle);
      movieDetails.appendChild(movieDate);
      movieDetails.appendChild(movieRating);

      movieCard.appendChild(movieImage);
      movieCard.appendChild(movieDetails);

      movieContainer.appendChild(movieCard);
      movieCard.appendChild(btnContainer);
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Initialize the movie display on page load
displayMovies();
