const API_KEY = "b1faa3b7206840f87e88b9254b08fa74";
const container = document.querySelector(".films-container");
const categorySelect = document.querySelector(".category-input");

// Pages Navigation
const pageNavBtns = document.querySelectorAll(".page-nav__btn");
const curPage = document.querySelector(".pages-nav__current-page");

const createSelectInput = (catArr) => {
  catArr.forEach((cat) => {
    const catOption = document.createElement("option");
    catOption.textContent = cat.name;
    catOption.value = cat.id;
    categorySelect.appendChild(catOption);
  });
};

// navigation data store
const navigationData = {
  currentPage: 1,
  numOfPages: null,
  filmCategory: 28,
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
    console.error(error);
  }
};
getCategories();

const getFilms = async (id, pageNum = 1) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/4/discover/movie?api_key=${API_KEY}&with_genres=${id}&language=pl-PL&page=${pageNum}`
    );
    const films = await response.json();

    navigationData.currentPage = films.page;
    navigationData.numOfPages = films.total_pages;
    console.log(films);

    return films;
  } catch (error) {
    console.error(error);
  }
};

export const displayPosters = async (filmID, pageNum) => {
  try {
    let urlBase = `https://image.tmdb.org/t/p/w500/`;
    const { results } = await getFilms(filmID, pageNum);
    results.forEach((movie) => {
      const poster = document.createElement("img");
      poster.src = `${urlBase}${movie.poster_path}`;
      container.insertAdjacentElement("beforeend", poster);
      const infoWraper = document.createElement("div");
      infoWraper.classList.add("film-info");
      poster.insertAdjacentElement("beforeend", infoWraper);
    });
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  displayPosters(28);
});

categorySelect.addEventListener("change", (e) => {
  container.textContent = "";
  navigationData.filmCategory = e.target.value;
  navigationData.currentPage = 1;
  curPage.textContent = navigationData.currentPage;

  displayPosters(e.target.value);
  return e.target.value;
});

pageNavBtns.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.target.classList.contains("back")
      ? navigationData.currentPage > 1
        ? navigationData.currentPage--
        : navigationData.currentPage
      : navigationData.currentPage < navigationData.numOfPages
      ? navigationData.currentPage++
      : navigationData.currentPage;

    curPage.textContent = navigationData.currentPage;
    container.textContent = "";
    displayPosters(navigationData.filmCategory, navigationData.currentPage);
  })
);
