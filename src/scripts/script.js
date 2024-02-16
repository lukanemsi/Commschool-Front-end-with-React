import { URL, IMG_PATH, SEARCH_API, MOVIE_DETAILS } from "./constants.js";

let pageFrom = 1;
let pageTo = 10;
const movieWrapperDiv = document.getElementById("movie-wrapper");
const pagginator = document.getElementById("pagginator");
const seatsReservationDiv = document.getElementById("seats-wrapper");
const cinemaSeats = { row: 10, column: 8 };

async function fetchMovies(url, ignoreId) {
  clearDiv(movieWrapperDiv);
  clearDiv(seatsReservationDiv);

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  if (movieId && !ignoreId) {
    fetch(MOVIE_DETAILS.replace("$movieID$", movieId))
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status code: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        displayMovieDetails(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
    return;
  }
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status code: ${response.status}`
        );
      }
      return response.json();
    })
    .then((data) => {
      displayData(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function createMovie(movie) {
  const movieDiv = document.createElement("div");
  movieDiv.classList.add("movie");

  const movieHeader = document.createElement("div");
  movieHeader.classList.add("movie-header");

  const movieRating = document.createElement("div");
  movieRating.classList.add("movie-rating");

  movieRating.style.backgroundColor = getBackgroundColorByRating(
    movie.vote_average
  );

  const ratingParagraph = document.createElement("p");
  ratingParagraph.textContent = `${movie.vote_average}`;
  movieRating.appendChild(ratingParagraph);

  const movieImage = document.createElement("img");
  movieImage.src = `${IMG_PATH}/${movie.poster_path}`;

  movieHeader.appendChild(movieRating);
  movieHeader.appendChild(movieImage);

  const movieContent = document.createElement("div");
  movieContent.classList.add("movie-content");
  const movieTitle = document.createElement("h3");
  movieTitle.textContent = `${movie.title}`;

  const movieRelease = document.createElement("p");
  movieRelease.textContent = `${movie.release_date}`;

  const movieInfoBoxes = document.createElement("div");
  movieInfoBoxes.classList.add("movie-info-boxes");

  const movieMinAge = document.createElement("div");
  movieMinAge.classList.add("movie-info-box");
  movieMinAge.innerHTML = movie.adult ? "PG13" : "PG";

  const movieLang = document.createElement("div");
  movieLang.classList.add("movie-info-box");
  movieLang.innerHTML = movie.original_language.toUpperCase();

  movieInfoBoxes.appendChild(movieMinAge);
  movieInfoBoxes.appendChild(movieLang);

  movieContent.appendChild(movieTitle);
  movieContent.appendChild(movieRelease);
  movieContent.appendChild(movieInfoBoxes);

  movieDiv.appendChild(movieHeader);
  movieDiv.appendChild(movieContent);
  movieDiv.addEventListener("click", () => {
    window.open(`index.html?id=${movie.id}`, "_blank");
  });
  movieWrapperDiv.appendChild(movieDiv);
}
function clearDiv(div) {
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function displayData(data) {
  for (let i = 0; i < data.results.length; i++) {
    createMovie(data.results[i]);
  }
}
function displayMovieDetails(movie) {
  const movieImg = document.createElement("div");
  movieImg.classList.add("movie-image");
  const img = document.createElement("img");
  img.src = `${IMG_PATH}/${movie.poster_path}`;
  img.alt = "movie image";
  movieImg.appendChild(img);

  const movieDetails = document.createElement("div");
  movieDetails.classList.add("movie-details");

  const movieTitle = document.createElement("h1");
  movieTitle.textContent = movie.original_title;

  const genresWrapper = document.createElement("div");
  genresWrapper.classList.add("genres-wrapper")
  const genresTitle = document.createElement("h4");
  genresTitle.textContent = "Genres";

  const genres = document.createElement("div");
  genres.classList.add("genres");

  genresWrapper.appendChild(genresTitle);
  genresWrapper.appendChild(genres);
  for (let i = 0; i < movie.genres.length; i++) {
    const genre = document.createElement("div");
    genre.classList.add("genre");
    genre.innerHTML = movie.genres[i].name;
    genres.appendChild(genre);
  }

  const movieOverview = document.createElement("div");
  movieOverview.classList.add("movie-overview")
  const overview = document.createElement("h3");
  overview.textContent = "Overview";
  const description = document.createElement("p");
  description.textContent = movie.overview;
  movieOverview.appendChild(overview);
  movieOverview.appendChild(description);

  const movieRecognition = document.createElement("div");
  movieRecognition.classList.add("movie-reco");

  const movieVote = document.createElement("div");
  movieVote.classList.add("movie-reco-statistic");
  movieVote.innerHTML = "Vote " + movie.vote_count;

  const moviePopularity = document.createElement("div");
  moviePopularity.classList.add("movie-reco-statistic");
  moviePopularity.innerHTML = "Popularity " + movie.popularity;

  movieRecognition.appendChild(movieVote);
  movieRecognition.appendChild(moviePopularity);
  movieDetails.appendChild(movieTitle);
  movieDetails.appendChild(genresWrapper);
  movieDetails.appendChild(movieOverview);
  movieDetails.appendChild(movieRecognition);
  movieWrapperDiv.appendChild(movieImg);
  movieWrapperDiv.appendChild(movieDetails);

  displaySeats();
}

function getBackgroundColorByRating(rating) {
  if (rating < 5) {
    return "#CB1E10";
  } else if (rating < 7) {
    return "#EAB8A4";
  }
  return "#CB8F10";
}

function setPaginator(pageFrom, pageTo) {
  const leftArrowDiv = document.createElement("div");
  leftArrowDiv.classList.add("left-arrow");
  const leftArrowImg = document.createElement("img");
  leftArrowImg.src = "./src/img/left-arrow.png";
  leftArrowImg.alt = "left-arrow";
  leftArrowDiv.appendChild(leftArrowImg);
  pagginator.appendChild(leftArrowDiv);

  const rightArrowDiv = document.createElement("div");
  rightArrowDiv.classList.add("right-arrow");
  const rightArrowImg = document.createElement("img");
  rightArrowImg.src = "./src/img/right-arrow.png";
  rightArrowImg.alt = "right-arrow";
  rightArrowDiv.appendChild(rightArrowImg);

  for (let i = pageFrom; i <= pageTo; i++) {
    const numb = document.createElement("div");
    numb.classList.add("paginator-number");
    numb.addEventListener("click", () => {
      fetchMovies(URL + i, true);
    });
    numb.innerHTML = i;
    pagginator.appendChild(numb);
  }
  pagginator.appendChild(rightArrowDiv);
  setPagginatorArrows();
}

function displaySeats() {
  let price = 0;
  const purchaseDiv = document.createElement("div");
  purchaseDiv.classList.add("purchase-container");
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");
  const buyButton = document.createElement("button");
  buyButton.classList.add("btn")
  buyButton.id = "buy-btn"

  buyButton.textContent = "Buy now";
  const resetButton = document.createElement("button");
  resetButton.classList.add("btn")
  resetButton.id = "reset-btn"

  resetButton.textContent = "reset";
  buttonWrapper.appendChild(buyButton);
  buttonWrapper.appendChild(resetButton);

  const priceDiv = document.createElement("p");
  priceDiv.textContent = `Total Price ${price}`;

  buyButton.addEventListener("click", () => {
    const occupiedSeats = getOccupiedSeats();
    const encodedSeats = encodeURIComponent(JSON.stringify(occupiedSeats));
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");
    window.location.href = `./purchase.html?id=${movieId}&data=${encodedSeats}`;
  });
  resetButton.addEventListener("click", () => {
    priceDiv.textContent = `Total Price 0`;
    const allSeats = document.getElementsByClassName("seat");

    for (let i = 0; i < allSeats.length; i++) {
      allSeats[i].style.background = "white";
    }
  });

  purchaseDiv.appendChild(priceDiv);
  purchaseDiv.appendChild(buttonWrapper);

  for (let i = 1; i <= cinemaSeats.row; i++) {
    const seatRow = document.createElement("div");
    seatRow.classList.add("seat-row");

    const rowNumber = document.createElement("p");
    rowNumber.classList.add("row-number");
    rowNumber.textContent = i;
    seatRow.appendChild(rowNumber);
    for (let j = 1; j <= cinemaSeats.column; j++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.addEventListener("click", () => {
        let color = window.getComputedStyle(seat).backgroundColor;

        if (color === "rgb(255, 0, 0)") {
          seat.style.background = "white";
          price -= 15;
        } else {
          seat.style.backgroundColor = "red";
          price += 15;
        }
        priceDiv.textContent = `Total Price ${price}`;
      });
      seat.innerHTML = j;
      seatRow.appendChild(seat);
    }

    seatsReservationDiv.appendChild(seatRow);
  }

  seatsReservationDiv.appendChild(purchaseDiv);
}

function setPagginatorArrows() {
  const leftArrow = document.getElementsByClassName("left-arrow")[0];
  leftArrow.addEventListener("click", () => {
    if (pageFrom > 10) {
      pageFrom -= 10;
      pageTo -= 10;
    }
    clearDiv(pagginator);
    setPaginator(pageFrom, pageTo);
  });

  const rightArrow = document.getElementsByClassName("right-arrow")[0];
  rightArrow.addEventListener("click", () => {
    if (pageTo !== 500) {
      pageFrom += 10;
      pageTo += 10;
    }
    clearDiv(pagginator);
    setPaginator(pageFrom, pageTo);
  });
}
function getOccupiedSeats() {
  const seats = document.getElementsByClassName("seat");
  const result = {};
  for (let i = 0; i < seats.length; i++) {
    if (seats[i].style.backgroundColor === "red") {
      const key =
        seats[i].parentNode.getElementsByClassName("row-number")[0].innerHTML;

      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(+seats[i].innerHTML);
    }
  }
  console.log(result);
  return result;
}
function filterMovies() {
  let inputValue = document.getElementById("filterInput").value;
  fetchMovies(SEARCH_API + inputValue, true);
}

fetchMovies(URL + 1);
setPaginator(pageFrom, pageTo);
