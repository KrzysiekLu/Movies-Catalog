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
  const catListResponse = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pl-PL`
  );
  const catListData = await catListResponse.json();
  const catList = catListData.genres;
  createSelectInput(catList);
};
getCategories();

const getDataList = async (id) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}&language=pl-PL&page=3`
  );
  console.log(response);

  const filmList = await response.json();
  console.log(filmList);

  return filmList;
};

const gePosters = async (id) => {
  let urlBase = `https://image.tmdb.org/t/p/w500/`;

  const { results } = await getDataList(id);
  results.forEach((movie) => {
    const poster = document.createElement("img");
    poster.src = `${urlBase}${movie.poster_path}`;
    container.insertAdjacentElement("beforeend", poster);
  });
};
categorySelect.addEventListener("change", (e) => {
  console.log(e.target.value);
  container.textContent = "";
  gePosters(e.target.value);
});
