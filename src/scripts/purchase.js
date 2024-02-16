import { URL, IMG_PATH, SEARCH_API, MOVIE_DETAILS } from "./constants.js";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const encodedData = urlParams.get("data");
const id = urlParams.get("id");

const usedSeats = JSON.parse(decodeURIComponent(encodedData));
const cardContentDiv = document.getElementById("card-content")

function displayContent(){
    getMovie(id).then((movie) => {
        const titleH1 = document.createElement('h1');
        titleH1.textContent = movie.original_title;

        const warningDiv = document.createElement('div');
        warningDiv.classList.add("warning")
        warningDiv.textContent = 'We warn you that you will have only 3 minutes on the payment page to buy a ticket';

        const movieInfoDiv = document.createElement('div');
        movieInfoDiv.classList.add('movie-info');

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');

        const languageFlex = createFlexDiv('Language:', `${movie.original_language.toUpperCase()}`);
        const dateFlex = createFlexDiv('Date:', `${movie.release_date}`);
        const timeFlex = createFlexDiv('Time:', '13:00');

        contentDiv.appendChild(languageFlex);
        contentDiv.appendChild(dateFlex);
        contentDiv.appendChild(timeFlex);

        const movieImageDiv = document.createElement('div');
        movieImageDiv.classList.add('movie-image');

        const movieImg = document.createElement('img');
        movieImg.src = `${IMG_PATH}/${movie.poster_path}`;
        movieImg.alt = 'movie photo';

        movieImageDiv.appendChild(movieImg);

        movieInfoDiv.appendChild(contentDiv);
        movieInfoDiv.appendChild(movieImageDiv);

        const ticketsDiv = document.createElement('div');
        ticketsDiv.classList.add('tickets');

        const table = createTable(usedSeats);

        ticketsDiv.appendChild(table);

        const buttonWrapperDiv = document.createElement('div');
        buttonWrapperDiv.classList.add('button-wrapper');
        buttonWrapperDiv.classList.add('flex');

        const payButton = document.createElement('button');
        payButton.id = "pay-button"
        payButton.textContent = 'Pay';

        const goBackButton = document.createElement('button');
        goBackButton.id = "back-button"
        goBackButton.textContent = 'Go Back';

        goBackButton.addEventListener("click", () => {
            window.location.href = `index.html?id=${id}`
        })
        payButton.addEventListener("click", () => {
            window.location.href = `index.html`
        })

        buttonWrapperDiv.appendChild(payButton);
        buttonWrapperDiv.appendChild(goBackButton);

        cardContentDiv.appendChild(titleH1);
        cardContentDiv.appendChild(warningDiv);
        cardContentDiv.appendChild(movieInfoDiv);
        cardContentDiv.appendChild(ticketsDiv);
        cardContentDiv.appendChild(buttonWrapperDiv);           
    });
}
function createTable(seats){
    const table = document.createElement("table");
    const headers = ["Row","Seat","Price"];
    const headerRow = createTableRow(
        headers, "td"
    );
    table.appendChild(headerRow);
    for (const [key, value] of Object.entries(seats)) {
        for(const v of value)
        {
            const dataRow = createTableRow([key,v, "15$"], "td")
            table.appendChild(dataRow);
        }
    }
    return table;
}

function createTableRow(contents, type){
    const tr = document.createElement("tr");
    for(let i = 0; i < contents.length; i++)
    {   
        let typeElement;
        if(type === "td")
        {
            typeElement = document.createElement("td")
        }
        else{
            typeElement = document.createElement("th")
        }
        typeElement.textContent = contents[i];
        tr.appendChild(typeElement);
    }
   
    return tr;
}

function createFlexDiv(label, value) {
    const flexDiv = document.createElement('div');
    flexDiv.classList.add('flex');

    const labelP = document.createElement('p');
    labelP.textContent = label;

    const valueP = document.createElement('p');
    valueP.textContent = value;

    flexDiv.appendChild(labelP);
    flexDiv.appendChild(valueP);

    return flexDiv;
}



function getMovie(id){
    return fetch(MOVIE_DETAILS.replace("$movieID$", id))
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status code: ${response.status}`
        );
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}


displayContent();