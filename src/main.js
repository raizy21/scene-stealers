import tmdbService from "./services/tmdbService.js";
import config from "./config.js";
import {
  addToFavorites,
  addToWatchlist,
  isInFavorites,
  isInWatchlist,
} from "./dataStorage.js";

//selector
const hamburger = document.querySelector("#hamburger-menu");
const exitBtn = document.querySelector("#exit-btn");
const header = document.querySelector("#header");
const navbar = document.querySelector("#navbar");
const listItemsLink = document.querySelector("#listItemsLink");
const linkHome = document.querySelector("#linkHome");
const linkJournal = document.querySelector("#linkJournal");
const linkEvents = document.querySelector("#linkEvents");
const linkRegister = document.querySelector("#linkRegister");
let divContainer;

//hamburger click
hamburger.addEventListener("click", () => {
  // console.log("clicked");

  // document.querySelector(".navigation").classList.toggle("change");

  //make a container for links
  divContainer = document.createElement("div");
  divContainer.setAttribute("id", "divContainer");
  divContainer.className =
    "absolute w-full h-full top-[7rem] bg-secondaryColor";

  //show the navbar
  navbar.classList.remove("hidden", "laptop:flex");
  navbar.classList.add("flex", "flex-col");

  //styling the links
  linkHome.className =
    "text-primaryColor mt-12 text-4xl flex justify-center items-center hover:text-5xl hover:underline";
  linkJournal.className =
    "text-primaryColor mt-12 text-4xl flex justify-center items-center  hover:text-5xl hover:underline";
  linkEvents.className =
    "text-primaryColor mt-12 text-4xl flex justify-center items-center  hover:text-5xl hover:underline";
  linkRegister.className =
    "text-primaryColor mt-12 text-4xl flex justify-center items-center  hover:text-5xl hover:underline";

  //hide the hamburger menu and show the exit buttons
  hamburger.classList.add("hidden");
  exitBtn.classList.remove("hidden");

  // append links
  divContainer.appendChild(linkHome);
  divContainer.appendChild(linkJournal);
  divContainer.appendChild(linkEvents);
  divContainer.appendChild(linkRegister);

  //append to header container
  header.appendChild(divContainer);
});

//exit btn click
exitBtn.addEventListener("click", () => {
  // console.log("clicked");

  // document.querySelector(".navigation").classList.toggle("change");

  //show the navbar
  navbar.classList.add("hidden", "laptop:flex");
  navbar.classList.remove("flex", "flex-col");

  //styling the links
  linkHome.classList.remove(
    "text-primaryColor",
    "mt-12",
    "text-4xl",
    "flex",
    "justify-center",
    "items-center",
    "hover:text-5xl",
    "hover:underline"
  );

  linkJournal.classList.remove(
    "text-primaryColor",
    "mt-12",
    "text-4xl",
    "flex",
    "justify-center",
    "items-center",
    "hover:text-5xl",
    "hover:underline"
  );
  linkEvents.classList.remove(
    "text-primaryColor",
    "mt-12",
    "text-4xl",
    "flex",
    "justify-center",
    "items-center",
    "hover:text-5xl",
    "hover:underline"
  );

  linkRegister.classList.remove(
    "text-primaryColor",
    "mt-12",
    "text-4xl",
    "flex",
    "justify-center",
    "items-center",
    "hover:text-5xl",
    "hover:underline"
  );

  //hide the exit button and show the hamburger
  hamburger.classList.remove("hidden");
  exitBtn.classList.add("hidden");

  //remove div
  if (divContainer !== null) {
    header.removeChild(divContainer);
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
        "bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-all flex flex-col justify-between";

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
        "flex gap-1 justify-end items-center bg-[#a5b4fc] z-50 px-4 py-2";

      const heart = document.createElement("img");
      heart.className = "w-8";
      heart.src = "src/images/heart-regular.svg";

      if (isInFavorites(movie.id)) {
        heart.src = "src/images/heart-solid.svg";
      }

      const save = document.createElement("img");
      save.className = "w-6";
      save.src = "src/images/bookmark-regular.svg";

      if (isInWatchlist(movie.id)) {
        save.src = "src/images/bookmark-solid.svg";
      }

      const favBtn = document.createElement("a");
      favBtn.className = "py-2 rounded-lg text-white cursor-pointer";

      const saveBtn = document.createElement("a");
      saveBtn.className = "px-4 py-2 rounded-lg text-white cursor-pointer";

      favBtn.addEventListener("click", () => {
        if (isInFavorites(movie.id)) {
          alert(`${movie.title} is already in your favorites!`);
          return;
        }

        if (addToFavorites(movie)) {
          heart.src = "src/images/heart-solid.svg";
          alert(`${movie.title} added to favorites!`);
        }
      });

      saveBtn.addEventListener("click", () => {
        if (isInWatchlist(movie.id)) {
          alert(`${movie.title} is already in your watchlist!`);
          return;
        }

        if (addToWatchlist(movie)) {
          save.src = "src/images/bookmark-solid.svg";
          alert(`${movie.title} added to your watchlist!`);
        }
      });

      favBtn.appendChild(heart);
      saveBtn.appendChild(save);
      btnContainer.appendChild(saveBtn);
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
