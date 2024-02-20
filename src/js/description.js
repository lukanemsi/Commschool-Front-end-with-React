const id = new URLSearchParams(window.location.search).get("id");
const poke_container = document.getElementById("poke_details_contianer");

const POKE_API = `https://pokeapi.co/api/v2/`
const ABILITIES_API = POKE_API + 'ability/'
const FORM_API = POKE_API + `pokemon-form/`
const HABITANT_API = POKE_API + `pokemon-habitat/`

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

const fetchURL = async (url,id) => {
  url = url + id;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

const fetchPokemons = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  createPokemonCard(data);
};
fetchPokemons(id);

const createPokemonCard = (pokemon) => {

  const pokemonDetailsDiv = document.createElement("div");
  pokemonDetailsDiv.classList.add("pokemon-details");
  const poke_types = pokemon.types.map((type) => type.type.name);
  const type = main_types.find((type) => poke_types.indexOf(type) >= 0);
  const id = pokemon.id.toString().padStart(3, "0");
  const color = colours[type];
  pokemonDetailsDiv.style.backgroundColor = color;


  const prokemonInnerHTML = `
            <div class="pokemon-details-info"></div>
            <div class="pokemon-image-wrapper">
            </div>
            <div class="poke-type-wrapper">
            ${pokemon.types.map(type => `<div class="poke-type" style="background-color: ${pokeTypeColors[type.type.name]}">${type.type.name}</div>`).join('')}
            </div>
            <div class="stats">
            ${pokemon.stats.map(stat => `<div class="stat">
              <span class="stat-name">
                ${stat.stat.name} 
              </span>
              <input type="range" min="1" max="150" value="${stat.base_stat}" class="slider" disabled>
              <span class="stat-number">${stat.base_stat}</span>  
              </div>`).join("")} 
            </div>
        `;

    
  pokemonDetailsDiv.innerHTML = prokemonInnerHTML;
  poke_container.appendChild(pokemonDetailsDiv);


  fetchURL(ABILITIES_API,pokemon.id).then(data => {
    data.effect_entries.filter(effect => effect.language.name === "en")
    .forEach(effect => {
      const affectsDiv = document.createElement("div");
      affectsDiv.innerHTML = `
        <div class="effect-content">
          <h2>Effect</h2>
          <p>${effect.effect}</p>
        </div>
        <div class="short-effect-content">
          <h2>Short effect</h2>
          <p>${effect.short_effect}</p>
        </div>
      `;
      pokemonDetailsDiv.appendChild(affectsDiv);
    })
  })

  fetchURL(FORM_API,pokemon.id).then(data =>{
    const srcList = [];
    Object.entries(data.sprites).forEach((key) => {
      if(key[1] !== null)
      {
        srcList.push(key[1])
      }
    })
  
    const pokemonImage = document.getElementsByClassName("pokemon-image-wrapper")[0];
    pokemonImage.innerHTML = createCaruselle(srcList);
  })

  fetchURL(HABITANT_API, pokemon.id).then(data => {
    const habitant = document.createElement("div")
    habitant.classList.add('habitant')
    
    const neighboorSpecies = []
    data.pokemon_species.map(el => { const numbers = el.url.match(/\d+/g); return numbers[numbers.length -1]})
    .forEach(el => neighboorSpecies.push(el))
    const neighboorsDiv = document.createElement("div")
    neighboorsDiv.innerHTML = `<p class="see-neighboors">See ALL Neighboors</p>` 
    neighboorsDiv.addEventListener("click" , () => {
      displayNeighboorSpecies(neighboorSpecies)
    })
    habitant.innerHTML = `
      <div><p class="habitant-name"><span class="habitat-span">Habitat: </span>${data.name}</p></div> 
    `
    habitant.appendChild(neighboorsDiv)
    pokemonDetailsDiv.appendChild(habitant);
  })
};

function displayNeighboorSpecies(species)
{
  const newWindow = window.open(`./index.html?species=${species}`, '_blank');

}

function createCaruselle(srcList){
  return `
  <div
  id="carouselExampleIndicators"
  class="carousel slide"
  data-ride="carousel"
>
  <ol class="carousel-indicators">
    <li
      data-target="#carouselExampleIndicators"
      data-slide-to="0"
      class="active"
    ></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    ${srcList.map((src,index) => {
      if(index === 0)
      {
        return `
        <div class="carousel-item active ">
          <img
            class="d-block poke-img"
            src="${src}"
          />
        </div>`
      }
      else{  
        return `<div class="carousel-item">
        <img
          class="d-block poke-img"
          src="${src}"
        />
      </div>`
      }
      
    }).join("")}
   
  </div>
  <a
    class="carousel-control-prev"
    href="#carouselExampleIndicators"
    role="button"
    data-slide="prev"
  >
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a
    class="carousel-control-next"
    href="#carouselExampleIndicators"
    role="button"
    data-slide="next"
  >
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
`
}