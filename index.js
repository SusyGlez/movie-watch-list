const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const watchlistContainer = document.getElementById("watchlist-container");
let movieList = [];
let movie = null;

if (searchForm) {
  searchForm.addEventListener("submit", function getRequest(event) {
    event.preventDefault();
    let input = searchInput.value;

    fetch(`https://www.omdbapi.com/?s=${input}&apikey=a3e59872`)
      .then((response) => response.json())
      .then((sData) => {
        console.log(sData);

        movieList = sData.Search;
        moviesContainer.innerHTML = "";

        if (movieList && movieList.length > 0) {
          renderMovielist();
        } else {
          moviesContainer.textContent =
            "Unable to find what you’re looking for. Please try another search.";
        }
      });
  });
}

function logMovie(id) {
  fetch(`https://www.omdbapi.com/?i=${id}&apikey=a3e59872`)
    .then((response) => response.json())
    .then((iData) => {
      console.log("idata", iData);
      movie = iData;
      renderMovieInfo(iData);
    });
}

function renderMovielist() {
  moviesContainer.innerHTML = "";
  movieList.forEach((movie) => {
    moviesContainer.innerHTML += `
              <button class="movie-btn flex flex-row border-b-[#2c2c2c] border-b w-lg py-3" data-imdb-id="${movie.imdbID}">
              <img class="w-20" src="${movie.Poster}" />
              <div class="flex flex-col pl-5 items-start justify-center text-[#ffff]">
                <h3 class="text-xl">${movie.Title}</h3>
                <span class="text-base">${movie.Year}</span>
              </div>
              </button>`;
  });
}

function renderMovieInfo(iData) {
  const savedWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
  const alreadySaved = savedWatchlist.some((m) => m.imdbID === iData.imdbID);

  let watchlistBtnHtml;

  if (alreadySaved) {
    watchlistBtnHtml = `<button data-add="${iData.imdbID}" class="cursor-pointer"><i class="fa-solid fa-circle-check"></i></button>`;
  } else {
    watchlistBtnHtml = `<button data-add="${iData.imdbID}" class="cursor-pointer"><img src="./images/plus-icon.png"/></button>`;
  }

  moviesContainer.innerHTML = `
        <img class="w-2xs mb-4" src="${iData.Poster}"/>
        <div class="flex flex-col text-white justify-between mb-4 max-w-md">
          <h3 class="font-bold text-2xl text-center">${iData.Title}</h3>
          <div class="flex flex-row gap-2.5 items-center justify-center">
            <img class="object-none w-fit" src="./images/star-icon.png"/>
            <p class="text-base">${iData.imdbRating}</p>
          </div>
        </div>
        <div class="text-white text-base w-md flex flex-row justify-between items-center mb-4">
          <p>${iData.Runtime}</p>
          <p class="w-60 text-center">${iData.Genre}</p>
          <div class="flex flex-row gap-2.5 items-center justify-center">
            ${watchlistBtnHtml}
            <p>Watchlist</p>
          </div>
        </div>
        <div class="flex flex-col w-md gap-2.5 mb-4">
          <p class="text-lg text-white">${iData.Plot}</p>
          <button id="arrow-btn" data-back="true" class="cursor-pointer self-end"><i class="fa-solid fa-circle-arrow-left text-white text-[28px] hover:text-gray-500"></i></button>
        </div>
        `;
}

function renderWatchlist() {
  if (!watchlistContainer) return;

  const saveList = JSON.parse(localStorage.getItem("myWatchlist")) || [];

  if (saveList.length === 0) {
    watchlistContainer.innerHTML = `
    <div class="flex flex-col items-center border-b-transparent">
      <h2 class="font-bold">Your watchlist is looking a little empty...</h2>
      <div class="flex flex-row gap-2.5 items-center justify-center mt-4">
        <a href="./index.html"><img src="./images/plus-icon.png" /></a>
        <span class="text-white font-bold">Let's add some movies!</span>
      </div>
    </div>`;
    return;
  }

  watchlistContainer.innerHTML = "";
  saveList.forEach((movie) => {
    watchlistContainer.innerHTML += `
    <div class="flex flex-center gap-4 border-b-[#2c2c2c] border-b">
      <img class="w-30 mb-4 object-contain" src="${movie.Poster}"/>

      <div class="flex flex-col text-white w-full w-sm mb-4 mt-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold text-2xl">${movie.Title}</h3>
          <div class="flex flex-row gap-2.5 items-center">
            <img class="w-fit" src="./images/star-icon.png"/>
            <p class="text-base">${movie.imdbRating}</p>
          </div>
        </div>

        <div class="text-base w-sm flex flex-row justify-between items-center mb-4">
        <p>${movie.Runtime}</p>
        <p class="w-60 text-center">${movie.Genre}</p>
        <div class="flex flex-row gap-2.5 items-center">
          <button class="cursor-pointer"><img src="./images/subtract-icon.png" data-remove="${movie.imdbID}"/></button>
          <p>Remove</p>
        </div>
        </div>

        <p class="text-lg text-white mb-4">${movie.Plot}</p>
      </div>
    </div>
      `;
  });
}

renderWatchlist();

document.addEventListener("click", function (e) {
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const savedWatchlist =
      JSON.parse(localStorage.getItem("myWatchlist")) || [];

    const alreadyExist = savedWatchlist.some((m) => m.imdbID === movie.imdbID);

    if (alreadyExist) {
      console.log("This movie is already in your watchlist");
    } else {
      savedWatchlist.push(movie);
      localStorage.setItem("myWatchlist", JSON.stringify(savedWatchlist));
    }
    addBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
    return;
  }

  const removeBtn = e.target.closest("[data-remove]");
  if (removeBtn) {
    const id = removeBtn.dataset.remove;
    let currentList = JSON.parse(localStorage.getItem("myWatchlist")) || [];
    currentList = currentList.filter((movie) => movie.imdbID !== id);
    localStorage.setItem("myWatchlist", JSON.stringify(currentList));
    renderWatchlist();
    return;
  }

  const backBtn = e.target.closest("[data-back]");
  if (backBtn) {
    renderMovielist();
    return;
  }

  const movieBtn = e.target.closest(".movie-btn");
  if (movieBtn) {
    logMovie(movieBtn.dataset.imdbId);
  }
});

//el usuario escribe el título de la película que quiere encontrar en un input de búsqueda.
//Al hacer click en el botón de buscar, el fetch debe buscar en la API (a través de la API key que ya tengo) el título o títulos relacionados con lo que busca el usuario y entregar esa respuesta a través de data.
//El parámetro de búsqueda usado será "s".
//La API debe devolver un array sencillo de películas relacionadas con la palabra o palabras de la búsqueda. Este array estará dentro del div llamado movies-container.
//Este array sencillo contendrá solo el título, año, poster y imdbID de cada película mostrada.
//El usuario podrá hacer click en la película que le interese para poder obtener información que se mostrará dentro del mismo "movies-container". Esto se logrará a través de un segundo fetch con el parámetro i=
//Esta sección mostrará título de la película, calificación, duración, género(s) y una breve descripción de lo que trata la película.

//Aparte de los detalles de la película, habrá un botón de "+" que tendrá la función de añadir la película a la watchlist del usuario (watchlist.html). La watchlist quedará almacenada en localstorage.
//En esta sección también habrá un botón de "<-" para volver un paso atrás en el proceso y volver a la lista simple de películas. La información del array de resultados del fetch se guardarán una variable "currentResults = [], así es como se podrá regresar a la lista simple de resultados.
//El botón de búsqueda permanecerá deshabilitado hasta que el usuario escriba algo en la barra de búsqueda.
//Si el API falla en entregar un resultado, deberá salir un mensaje de error en medio de la pantalla que diga "Sorry, we couldn't find a movie or show", o algo parecido.
