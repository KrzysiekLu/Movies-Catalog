const API_KEY = "b1faa3b7206840f87e88b9254b08fa74";
const container = document.querySelector(".films-container");
const categorySelect = document.querySelector(".category-input");

const createSelectInput = (catArr) => {
  catArr.forEach((cat) => {
    const catOption = document.createElement("option");
    catOption.textContent = cat.name;
    catOption.value = cat.id;
    categorySelect.appendChild(catOption);
  });
};

const getCategories = async () => {
  try {
    const catListResponse = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`
    );
    const catListData = await catListResponse.json();
    const catList = catListData.genres;
    createSelectInput(catList);
  } catch (error) {
    alert("Problem with get category list");
  }
};
getCategories();

const getFilms = async (id) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/4/discover/movie?api_key=${API_KEY}&with_genres=${id}&language=pl-PL&page=1`
    );
    const films = await response.json();
    console.log(films.total_pages);

    return films;
  } catch (error) {
    alert("Problem with get films");
  }
};

const displayPosters = async (filmID) => {
  try {
    let urlBase = `https://image.tmdb.org/t/p/w500/`;
    const { results } = await getFilms(filmID);
    results.forEach((movie) => {
      const poster = document.createElement("img");
      poster.src = `${urlBase}${movie.poster_path}`;
      container.insertAdjacentElement("beforeend", poster);
    });
  } catch (error) {
    alert("Problem with geting posters");
  }
};

window.addEventListener("DOMContentLoaded", () => {
  displayPosters(28);
});

categorySelect.addEventListener("change", (e) => {
  container.textContent = "";
  displayPosters(e.target.value);
});
