const isIndex = document.getElementById("pokemonList");
const isDetail = document.getElementById("title");

if (isIndex) {
  async function loadPokemons() {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    const data = await res.json();

    for (const pokemon of data.results) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<a href="detail.html?name=${pokemon.name}">${pokemon.name}</a>`;
      isIndex.appendChild(card);
    }
  }

  loadPokemons();
}

// Page detail.html
if (isDetail) {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  async function loadDetails() {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();

    document.getElementById("title").textContent = data.name;
    document.getElementById("image").src = data.sprites.front_default;
    document.getElementById("type").textContent = "Type : " + data.types.map(t => t.type.name).join(", ");

    const list = document.getElementById("moves");
    data.moves.slice(0, 5).forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.move.name;
      list.appendChild(li);
    });
  }

  loadDetails();
}
