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

// search

//selectors
const userInput = document.querySelector("#userInput");
// const queryText = document.getElementById("queryText");
// const container = document.querySelector("#container");

//session storage input
let querySearch = JSON.parse(sessionStorage.getItem("query")) || [];

//trigger change event by updating the value
userInput.addEventListener("change", updateValue);

//updating the session storage item
async function updateValue(e) {
  // queryText.textContent = e.target.value;
  sessionStorage.setItem("query", JSON.stringify([e.target.value]));
  // window.userInput.reload();
}

//output session storage item
// console.log(querySearch);

// Fetch search movies from TMDB
async function searchMovies(query) {
  try {
    // Fetch search movies from TMDB
    const search = await tmdbService.searchMovie(query);

    //render output to html
    renderMovieSearch(search, header);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}
//render output to html
function renderMovieSearch(search, container) {
  if (!search) return;

  //make a container for search
  divContainer = document.createElement("div");
  divContainer.setAttribute("id", "divContainer");
  divContainer.className =
    "absolute w-full px-[3rem] top-[7rem] bg-secondaryColor";
  // search.results.length
  for (let i = 0; i < 5; i++) {
    //title
    const title = document.createElement("h2");
    title.textContent = search.results[i].title;
    title.className =
      "text-primaryColor  text-2xl flex justify-center items-center  hover:underline z-200";

    // text
    const text = document.createElement("p");
    text.textContent = search.results[i].overview;
    text.className = "text-primaryColor  flex ml-12 mb-[2rem] ";

    //create img
    // const img = document.createElement("img");

    //append to card
    divContainer.appendChild(title);
    divContainer.appendChild(text);

    // console.log(querySearch.length);
    if (querySearch.length === 1) {
      //append to container
      container.appendChild(divContainer);

      //append to container
      header.appendChild(divContainer);
    }
  }
}
console.log(sessionStorage.getItem("query"));

if (sessionStorage.getItem("query") !== null) {
  let reload = true;
  if (reload) {
    // window.location.reload();
    // sessionStorage.setItem("query").remove;
    reload = false;
  }
}

searchMovies(JSON.parse(sessionStorage.getItem("query")));

// end of search

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

document.addEventListener("DOMContentLoaded", () => {
  const heroContainer = document.getElementById("hero-content");

  // Create animated header
  const header = document.createElement("h1");
  header.textContent = "Welcome to SceneStealers";
  header.classList.add(
    "text-6xl",
    "text-white",
    "font-['Bungee']",
    "opacity-0",
    "translate-y-12"
  );
  heroContainer.appendChild(header);

  // Apply fade-in animation with delay
  setTimeout(() => {
    header.classList.remove("opacity-0", "translate-y-12");
    header.classList.add(
      "transition-all",
      "duration-1000",
      "opacity-100",
      "translate-y-0"
    );
  }, 300);

  // Create animated subheading
  const subheading = document.createElement("p");
  subheading.textContent =
    "Discover the latest movies, trending stars, and all things cinema!";
  subheading.classList.add(
    "text-xl",
    "text-white",
    "mt-4",
    "mb-8",
    "opacity-0",
    "translate-y-12"
  );
  heroContainer.appendChild(subheading);

  // Apply fade-in animation with delay
  setTimeout(() => {
    subheading.classList.remove("opacity-0", "translate-y-12");
    subheading.classList.add(
      "transition-all",
      "duration-1000",
      "opacity-100",
      "translate-y-0"
    );
  }, 600);

  // Add movie details (Posters and Titles)
  const movieContainer = document.createElement("div");
  movieContainer.classList.add("relative", "w-full", "h-96", "overflow-hidden");
  heroContainer.appendChild(movieContainer);

  // Movie Data (Use relative paths for images)
  const movies = [
    {
      title: "Mufasa: The Lion King",
      description:
        "Fortsetzung zu Disneys Realfilm-Remake Der König der Löwen von 2019. Mufasa: The Lion King wird von Barry Jenkins inszeniert.",
      poster: "src/images/poster/mufasa.png",
    },
    {
      title: "Kraven the Hunter",
      description:
        "Sergei Kravinoff leidet unter der komplexen Beziehung zu seinem kaltherzigen und skrupellosen Vater.",
      poster: "src/images/poster/kraven.png",
    },
    {
      title: "Venom: The Last Dance",
      description:
        "Der Reporter Eddie Brock und Venom sind auf der Flucht vor dem Gesetz und einer geheimen Spezialeinheit des US-Militärs.",
      poster: "src/images/poster/venom.png",
    },
  ];

  // Create movie cards for the slideshow
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add(
      "absolute",
      "w-full",
      "h-full",
      "opacity-0",
      "transform",
      "transition-all",
      "duration-1000"
    );
    movieCard.setAttribute("data-index", index);
    movieContainer.appendChild(movieCard);

    const movieImage = document.createElement("img");
    movieImage.src = movie.poster;
    movieImage.alt = `${movie.title} Poster`;
    movieImage.classList.add("w-full", "h-full", "object-cover", "rounded-lg");
    movieCard.appendChild(movieImage);

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.title;
    movieTitle.classList.add(
      "absolute",
      "bottom-10",
      "left-10",
      "text-white",
      "text-2xl",
      "font-bold",
      "opacity-0",
      "translate-y-12"
    );
    movieCard.appendChild(movieTitle);

    const movieDescription = document.createElement("p");
    movieDescription.textContent = movie.description;
    movieDescription.classList.add(
      "absolute",
      "bottom-4",
      "left-10",
      "text-white",
      "text-sm",
      "opacity-0",
      "translate-y-12"
    );
    movieCard.appendChild(movieDescription);
  });

  // Function to animate the slideshow
  let currentSlide = 0;
  const totalSlides = movies.length;

  const showSlide = (index) => {
    const slides = document.querySelectorAll("[data-index]");
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.remove("opacity-0", "translate-y-12");
        slide.classList.add(
          "opacity-100",
          "translate-y-0",
          "transition-all",
          "duration-1000"
        );
      } else {
        slide.classList.remove("opacity-100", "translate-y-0");
        slide.classList.add(
          "opacity-0",
          "translate-y-12",
          "transition-all",
          "duration-1000"
        );
      }
    });

    // Animate the text
    const title = slides[index].querySelector("h2");
    const description = slides[index].querySelector("p");

    title.classList.remove("opacity-0", "translate-y-12");
    title.classList.add(
      "opacity-100",
      "translate-y-0",
      "transition-all",
      "duration-1000"
    );

    description.classList.remove("opacity-0", "translate-y-12");
    description.classList.add(
      "opacity-100",
      "translate-y-0",
      "transition-all",
      "duration-1000"
    );
  };

  // Initial slide
  showSlide(currentSlide);

  // Set up the slideshow transition every 3 seconds
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }, 3000); // Change slide every 3 seconds
});
