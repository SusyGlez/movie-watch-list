const moviesContainer = document.getElementById("movies-container");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
let movieList = [];
let movieArray = [];
let movie = null;
const watchlistContainer = document.getElementById("watchlist-container");

if (searchForm) {
  searchForm.addEventListener("submit", function getRequest(event) {
    let input = searchInput.value;
    event.preventDefault();

    // fetch sData
    fetch(`http://www.omdbapi.com/?s=${input}&apikey=a3e59872`)
      .then((response) => response.json())
      .then((sData) => {
        console.log(sData);

        movieList = sData.Search;
        moviesContainer.innerHTML = null;

        if (movieList && movieList.length > 0) {
          renderMovielist();
        } else {
          moviesContainer.textContent = "Sorry, we couldn't find that movie :(";
        }
      });
  });
}
// fetch iData

function logMovie(id) {
  fetch(`http://www.omdbapi.com/?i=${id}&apikey=a3e59872`)
    .then((response) => response.json())
    .then((iData) => {
      console.log("idata", iData);
      movie = iData;
      renderMovieInfo(iData);
    });
}

function renderMovielist() {
  moviesContainer.innerHTML = null;
  movieList.forEach(
    (movie) =>
      (moviesContainer.innerHTML += `
              <button class="movie-btn" data-imdb-id="${movie.imdbID}" onclick="logMovie('${movie.imdbID}')">
              <img src="${movie.Poster}" />
              <h3>${movie.Title}</h3>
              <span>${movie.Year}</span>
              </button>`),
  );
}

function renderMovieInfo(iData) {
  moviesContainer.innerHTML = `
        <img src="${iData.Poster}"/>
        <div>
          <h3>${iData.Title}</h3>
          <div>
            <img src="./images/star-icon.png"/>
            <p>${iData.imdbRating}</p>
          </div>
        </div>
        <div>
          <p>${iData.Runtime}</p>
          <p>${iData.Genre}</p>
          <div>
            <button onclick="addMovieToWatchlist()"><img src="./images/plus-icon.png"/></button>
            <p>Watchlist</p>
          </div>
        </div>
        <p>${iData.Plot}</p>
        <button id="arrow-btn" onclick="renderMovielist()"> <- </button>
        `;
}

function addMovieToWatchlist() {
  const savedWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
  savedWatchlist.push(movie);
  localStorage.setItem("myWatchlist", JSON.stringify(savedWatchlist));
}

if (watchlistContainer) {
  const savedList = JSON.parse(localStorage.getItem("myWatchlist")) || [];
  watchlistContainer.innerHTML = "";
  savedList.forEach((movie) => {
    watchlistContainer.innerHTML += `
      <img src="${movie.Poster}"/>
      <div>
        <h3>${movie.Title}</h3>
        <div>
          <img src="./images/star-icon.png"/>
          <p>${movie.imdbRating}</p>
        </div>
      </div>
      <div>
        <p>${movie.Runtime}</p>
        <p>${movie.Genre}</p>
        <div>
          <button onclick="removeMovieFromWatchlist()"><img src="./images/subtract-icon.png"/></button>
          <p>Remove</p>
        </div>
      </div>
      <p>${movie.Plot}</p>
      `;
  });
}

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
