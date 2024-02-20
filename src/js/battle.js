const id = new URLSearchParams(window.location.search).get("id");

const split_string = id.split(",");
const sorted = split_string.sort((a, b) => a - b);

const opponent_container = document.getElementById("opponent_container");
const poke_container = document.getElementById("poke_contianer_battle");
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

const main_types = Object.keys(colours);
let pokemon_arr = [];
const fetchPokemons = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  pokemon_arr.push(data);
  pokemon_arr.sort((a, b) => a.id - b.id);
  if (pokemon_arr.length >= 5) {
    pokemon_arr.forEach((pokemon) => {
      createPokemonCard(pokemon);
    });
  }
};
const fetchOpponentPokemons = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  createOpponentPokemonCard(data);
};

split_string.forEach((id) => {
  fetchPokemons(id);
});

const createPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) >= 0);
  const id = pokemon.id.toString().padStart(3, "0");
  const color = colours[type];
  pokemonEl.style.backgroundColor = color;
  const prokemonInnerHTML = `
        <div class="img-container">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        </div>
        <div class="info">
          <span class="number">#${id}</span>
          <h3 class="name">${pokemon.name}</h3>
        </div>
        `;
  pokemonEl.addEventListener("click", () => {
    window.location.href = `description.html?id=${pokemon.id}`;
  });
  pokemonEl.innerHTML = prokemonInnerHTML;
  poke_container.appendChild(pokemonEl);
};
const createOpponentPokemonCard = (pokemon) => {
  const pokemonEl = document.createElement("div");
  pokemonEl.classList.add("pokemon");
  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) >= 0);
  const id = pokemon.id.toString().padStart(3, "0");
  const color = colours[type];
  pokemonEl.style.backgroundColor = color;
  const prokemonInnerHTML = `
        <div class="img-container">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        </div>
        <div class="info">
          <span class="number">#${id}</span>
          <h3 class="name">${pokemon.name}</h3>
        </div>
        `;
  pokemonEl.addEventListener("click", () => {
    window.location.href = `description.html?id=${pokemon.id}`;
  });
  pokemonEl.innerHTML = prokemonInnerHTML;
  opponent_container.appendChild(pokemonEl);
};

function generateRandomOpponents(){
  for (let i = 0; i < 5; i++) {
    let random = Math.floor(Math.random() * 100) + 1;
    fetchOpponentPokemons(random);
  }
}

// EXPLENATION specific card only fights to its facing oponents (1v1), card with highest id is the champion
// Team with most champions wins
function fight(){
  let myTeamScore= 0;
  let opponentTeamScore = 0;

  myIds = getPokeIdFromContainer(poke_container);
  opponentIds = getPokeIdFromContainer(opponent_container)
  
  for(let i = 0; i < 5; i++)
  {
    if(myIds[i] > opponentIds[i]){
      myTeamScore++;
      setWinnerPokemon(i,poke_container);
    }
    else if(myIds[i] < opponentIds[i])
    {
      opponentTeamScore++;
      setWinnerPokemon(i,opponent_container);
    }
    else{
      console.log("1v1 draw")
    }
  }

  const myWin = document.getElementById("my-win")
  const oponentWin = document.getElementById("oponent-win")

  if(myTeamScore > opponentTeamScore)
  {
    myWin.style.display = "block"
  }
  else if(myTeamScore < opponentTeamScore)
  {
    oponentWin.style.display = "block"
  }
  else{
    oponentWin.style.display = "block"
    myWin.style.display = "block"
  }
}
function setWinnerPokemon(index, container){
  var children = container.children;
  const winnerCrown = document.createElement("div");
  winnerCrown.classList.add("winner")
  winnerCrown.innerHTML = `<img src="./src/img/crown.png" alt="crown" />` 
  children[index].appendChild(winnerCrown)
}
function getPokeIdFromContainer(container)
{
    const result = [];
    const ids = container.getElementsByClassName("number")
    for(let c of ids)
    {
     result.push(parseInt(c.innerHTML.substring(1),10))
    }
  return result;
}
generateRandomOpponents();