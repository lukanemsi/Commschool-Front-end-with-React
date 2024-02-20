const poke_container = document.getElementById("poke_contianer");
const startTeam = document.createElement("img");
startTeam.id = "start-team"
startTeam.src = "./src/img/fight.svg";
startTeam.alt = "fight";
startTeam.style.cursor = "pointer"
const addedPokemonDiv = document.getElementById("added-pokemon");

startTeam.style.display = "none";
let pokemon_count = 10;
let pokemon_from = 1;

const getNeighboors = async (neighboors) =>{
  for (let n of neighboors.split(",")) {
    await fetchPokemons(n);
  }
}
const getPokemons = async () => {
  for (let i = pokemon_from; i <= pokemon_count; i++) {
    await fetchPokemons(i);
  }
  pokemon_from = pokemon_count + 1;
  addPlusCard()
};
const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const pokeTypeColors = {
  normal: "#575741",
  fire: "#6C3A1D",
  water: "#33416D",
  electric: "#6E6116",
  grass: "#465D31",
  ice: "#5B7F7B",
  fighting: "#6D1715",
  poison: "#582457",
  ground: "#7F6F3C",
  flying: "#54497B",
  psychic: "#8B2A4E",
  bug: "#5E6810",
  rock: "#6D6525",
  ghost: "#3C3255",
  dragon: "#3C1D89",
  dark: "#3C3933",
  steel: "#57575E",
  fairy: "#7A526D",
};

const main_types = Object.keys(colours);
const fetchPokemons = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  createPokemonCard(data);
};

let prokeArr = [];
const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) >= 0);
  pokemonEl.classList.add(type);
  const id = pokemon.id.toString().padStart(3, "0");
  const color = colours[type];
  pokemonEl.style.backgroundColor = color;


  const prokemonInnerHTML = `
    <div class="pokemon-content">
      <div class="info">
        <span class="number">#${id}</span>
        <h3 class="name">${pokemon.name}</h3>
      </div>
      <div class="img-container">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      </div>
      <div class="poke-type-wrapper">
      ${pokemon.types.map(type => `<div class="poke-type" style="background-color: ${pokeTypeColors[type.type.name]}">${type.type.name}</div>`).join('')}
      </div>
    </div>`;
  pokemonEl.addEventListener("contextmenu", (e) => {
    e.preventDefault(); 
    const menu = document.createElement("div");
    menu.style.position = "absolute";
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.zIndex = "1000";
    menu.innerHTML = `
      <div class="row">
        <div class="btn bten_view">
          <button id="viewDetails">View Details</button>
          </div>
          <div class="btn btn_choose">
          <button id="choosePokemon">Choose Pokemon</button>
          </div>
      </div>
      `;

    document.body.appendChild(menu);


    document.getElementById("viewDetails").addEventListener("click", () => {
      window.location.href = `description.html?id=${pokemon.id}`;

      menu.remove();
    });

    document.getElementById("choosePokemon").addEventListener("click", () => {

      if (prokeArr.length < 5) {
        prokeArr.push(pokemon.id);
        addPokemonToAddedList(pokemon);

        if(prokeArr.length == 5)
        {
          startTeam.style.display = "block";
          startTeam.addEventListener("click", () => {
            window.location.href = `battle.html?id=${prokeArr}`;
          });
          addedPokemonDiv.appendChild(startTeam)
        }
      } else {
        alert("You can choose only 5 pokemons");
      }

      menu.remove();
    });

    document.addEventListener(
      "click",
      (event) => {
        if (!menu.contains(event.target)) {
          menu.remove();
        }
      },
      { once: true },
    );
  });

  pokemonEl.innerHTML = prokemonInnerHTML;
  poke_container.appendChild(pokemonEl);

};


let counter = 0;
function addPokemonToAddedList(pok){
  const pokemon = document.createElement("div");
  pokemon.innerHTML = `
    <div class="img-container">
      <img src="${pok.sprites.front_default}" alt="${pok.name}" />
      <div class="cancel">
      <span class="counter" style="display: none">${counter++}</span>
      <img src="./src/img/cancel-icon.svg" alt="cancel" class="cancel-icon"/>
      </div>
    </div>
  `;  
  addedPokemonDiv.appendChild(pokemon)
  const cancelIcons = document.getElementsByClassName("cancel");
  const icon = cancelIcons[cancelIcons.length-1];
  icon.addEventListener("click", ()=> {
    let counterDiv = icon.getElementsByClassName("counter")[0];
    prokeArr.splice(counterDiv.innerHTML, 1);
    counter--;
    startTeam.style.display = "none";
    addedPokemonDiv.removeChild(pokemon)
  
  })

 
}

function addPlusCard()
{
  const plusCard = document.createElement("div");
  plusCard.classList.add("add-card")
  plusCard.innerHTML = `<img src="./src/img/plus.png" />`; 
  plusCard.addEventListener("click",() => {
    pokemon_count+= 10;
    poke_container.removeChild(plusCard)
    getPokemons()
  })

  poke_container.appendChild(plusCard)
}

const species = new URLSearchParams(window.location.search).get("species");
if(species == null)
{
  getPokemons();
}
else{
  getNeighboors(species)
}