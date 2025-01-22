export const addToFavorites = (movie) => {
  const currFavs = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavs = [movie, ...currFavs];
  localStorage.setItem("favorites", JSON.stringify(updatedFavs));
};
