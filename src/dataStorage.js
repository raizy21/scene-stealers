export const addToFavorites = (movie) => {
  if (isInFavorites(movie.id)) {
    return false;
  }
  const currFavs = getFavorites();
  const updatedFavs = [movie, ...currFavs];
  localStorage.setItem("favorites", JSON.stringify(updatedFavs));
  return true;
};

export const removeFromFavorites = (movieId) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

export const isInFavorites = (movieId) => {
  const favorites = getFavorites();
  return favorites.some((movie) => movie.id === movieId);
};

export const saveMovieReview = (movieId, review) => {
  const reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
  reviews[movieId] = review;
  localStorage.setItem("movieReviews", JSON.stringify(reviews));
};

export const getMovieReview = (movieId) => {
  const reviews = JSON.parse(localStorage.getItem("movieReviews")) || {};
  return reviews[movieId] || { rating: 0, comment: "" };
};

export const addToWatchlist = (movie) => {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const updatedWatchlist = [movie, ...watchlist];
  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
};

export const getWatchlist = () => {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
};

export const isInWatchlist = (movieId) => {
  const watchlist = getWatchlist();
  return watchlist.some((movie) => movie.id === movieId);
};

export const removeFromWatchlist = (movieId) => {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter((movie) => movie.id !== movieId);
  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
};
