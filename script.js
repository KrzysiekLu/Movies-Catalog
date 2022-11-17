const API_KEY = "b1faa3b7206840f87e88b9254b08fa74";
const filmsWrapper = document.querySelector(".films-container");
const categorySelect = document.querySelector(".category-input");

// Pages Navigation
const pageNavBtns = document.querySelectorAll(".page-nav__btn");
const curPage = document.querySelector(".pages-nav__current-page");

// create input " select Categories "
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

// get list of categories
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

export const displayFilms = async (filmID, pageNum) => {
  try {
    let urlBase = `https://image.tmdb.org/t/p/w500/`;
    const { results } = await getFilms(filmID, pageNum);
    results.forEach((movie) => {
      //create single film container
      const filmContainer = document.createElement("div");
      filmContainer.classList.add("film-container");

      //create poster
      const poster = document.createElement("img");
      poster.src = `${urlBase}${movie.poster_path}`;
      filmContainer.insertAdjacentElement("afterbegin", poster);

      //create info wraper
      const infoWraper = document.createElement("div");
      infoWraper.classList.add("film-info");
      infoWraper.textContent = movie.title;
      filmContainer.insertAdjacentElement("beforeend", infoWraper);

      filmsWrapper.insertAdjacentElement("afterbegin", filmContainer);
    });
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  displayFilms(28);
});

categorySelect.addEventListener("change", (e) => {
  filmsWrapper.textContent = "";
  navigationData.filmCategory = e.target.value;
  navigationData.currentPage = 1;
  curPage.textContent = navigationData.currentPage;

  displayFilms(e.target.value);
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
    filmsWrapper.textContent = "";
    displayFilms(navigationData.filmCategory, navigationData.currentPage);
  })
);
