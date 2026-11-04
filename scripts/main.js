import { Card } from "./card.js";

async function getGenres(){
  let genres;
  if (sessionStorage.getItem("genres") != null) genres = JSON.parse(sessionStorage.getItem("genres"));
  else {
    genres = await requeteAPI(`${API_URL}/genres/anime`);
    if (genres) sessionStorage.setItem("genres", JSON.stringify(genres));
    else {
      sessionStorage.clear();
      //window.location.reload();
    }
  };

  genres["data"].forEach((g) => {
    const lab = document.createElement('label');
    lab.for = `genre${g['mal_id']}`;
    lab.innerHTML = `
      <input type="checkbox" id="genre${g['mal_id']}"/>${g["name"]}
    `;
    genre.appendChild(lab);
  });
}

const body = document.querySelector("body");

const API_HOST = "api.tenrai.org/v1";
const API_URL = `https://${API_HOST}`;

const form = document.querySelector("form");
const categorie = document.querySelector("#cat");
const entry = document.querySelector("#entry");
const genre = document.querySelector(".options");
const selectGenre = document.querySelector("#genre");
const cardsList = document.querySelector("#cardsList");

function resizeOptions(){
  const elmt = (categorie.value == 3) ? selectGenre : entry;
  const rect = elmt.getBoundingClientRect()

  genre.style.width = rect.width + "px";
  genre.style.top = elmt.offsetTop + elmt.offsetHeight + 2 + "px";
  genre.style.left = elmt.offsetLeft + "px";
}

window.addEventListener('resize', resizeOptions);

function openOptions(bool) {
  open = bool != undefined ? bool : !open;

  if (open) {
    genre.style.display = "flex";
  } else {
    genre.style.display = "none";
  }
}

let open = false;
selectGenre.addEventListener('click', (e) => {
  e.preventDefault();
  openOptions();
})

// BOUTON RESET
const resetButton = document.createElement("button");
resetButton.type = "button";
resetButton.id = "resetBtn";
resetButton.textContent = "Réinitialiser";

form.appendChild(resetButton);

// Textes liés à la catégorie de recherche
const placeholders = {
  "0": "Titre de l'anime",
  "1": "Identifiant de l'anime",
  "2": "Rang dans le classement",
  "3": "Titre de l'anime",
};

const messagesVides = {
  "0": "Veuillez entrer un nom d'anime ou de manga.",
  "1": "Veuillez entrer un identifiant d'anime.",
  "2": "Veuillez entrer un rang.",
};

function majPlaceholder() {
  const texte = placeholders[categorie.value];

  entry.placeholder = texte;
  entry.setAttribute("aria-label", texte);
}

majPlaceholder();

categorie.addEventListener('change', (event) => {
  if (event.target.value == 3) {
    entry.style.display = "none";
    selectGenre.style.display = "flex";
  } else {
    entry.style.display = "";
    selectGenre.style.display = "";
    openOptions(false);
  }

  majPlaceholder();
  resizeOptions();
});

document.addEventListener('click', (e) => {
  if (open && !selectGenre.contains(e.target) && !genre.contains(e.target)) {
    openOptions(false);
  }
});

// Event du formulaire
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const category = categorie.value;
  const recherche = entry.value.trim();

  if (recherche === "" && category != 3) {
    afficherMessage(
      messagesVides[category] ?? "Veuillez entrer un terme de recherche.",
      "error",
    );
    return;
  }

  cardsList.innerHTML = "";

  try {
    let resultats;

    switch (category) {
      case "0":
        resultats = await rechercherParTitre(recherche);
        break;

      case "1":
        resultats = await rechercherParIdentifiant(recherche);
        break;

      case "2":
        resultats = await rechercherParClassement(recherche);
        break;

      case "3":
        resultats = await rechercherParGenre();
        break;

      default:
        afficherMessage("Type de recherche invalide.", "error");
        return;
    }

    afficherResultats(resultats);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    afficherMessage(
      "Une erreur s'est produite lors de la recherche. Veuillez réessayer plus tard.",
      "error",
    );
  }
});

// Bouton reset
resetButton.addEventListener("click", () => {
  form.reset();
  cardsList.innerHTML = "";
  entry.focus();
});

// requete API
async function requeteAPI(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la requête API :", error);
    return null;
  }
}

// Recherche par titre
async function rechercherParTitre(titre) {
  const url = `${API_URL}/anime?q=${encodeURIComponent(titre)}&limit=10`;
  return await requeteAPI(url);
}

// Recherche par identifiant
async function rechercherParIdentifiant(id) {
  const url = `${API_URL}/anime/${encodeURIComponent(id)}`;
  return await requeteAPI(url);
}

// Recherche par classement
async function rechercherParClassement(classement) {
  let nbIntoAPage = 25;
  const page = Math.ceil(classement / nbIntoAPage);
  const indexOfTarget = (classement - 1) % nbIntoAPage;
  const url = `${API_URL}/top/anime?page=${page}`;

  var res = await requeteAPI(url);
  const animeTrouve = res.data.find(anime => {
    return anime.rank && anime.rank.toString() == classement;
  });

  return animeTrouve ?? null;
}

// Recherche par genre
async function rechercherParGenre() {
  const inputs = genre.querySelectorAll("input");

  let listeGenresSelec = new Array();

  inputs.forEach((inp) => {
    if (inp.checked) listeGenresSelec.push(inp.id.split("genre")[1]);
  });

  if (listeGenresSelec.length == 0) return null;

  let str = listeGenresSelec[0];
  for (let i = 1; i < listeGenresSelec.length; i++) str += `, ${listeGenresSelec[i]}`;

  const url = `${API_URL}/anime?page=1&size=10&genres=` + str;

  return await requeteAPI(url);
}

// Afficher les resultats
function afficherResultats(animes) {
  if (!animes) {
    afficherMessage("Aucun résultat trouvé.");
    return;
  }

  const donnees = Array.isArray(animes) ? animes : (animes.data ?? animes);
  const animesList = Array.isArray(donnees) ? donnees : [donnees];

  if (animesList.length === 0) {
    afficherMessage("Aucun résultat trouvé.");
    return;
  }

  animesList.forEach((anime) => {
    let anime_genres = [];
    anime.genres.forEach((g) => {
      anime_genres.push(g['name']);
    });

    const card = new Card(
      anime.title ?? "Titre inconnu",
      anime_genres,
      anime.rank ?? anime.ranking ?? "N/A",
      anime.images.jpg.image_url ?? "",
      anime.synopsis ?? "Synopsis indisponible.",
      anime.episodes ?? "N/A",
      anime.mal_id ?? "N/A",
    );
    card.render();
  });
}

// Afficher un message
function afficherMessage(message) {
  cardsList.innerHTML = "";
  const paragraph = document.createElement("p");

  paragraph.classList.add("message");
  paragraph.textContent = message;

  cardsList.appendChild(paragraph);
}

const boutonTheme = document.querySelector("#themeToggle");

function appliquerTheme(theme) {
  document.body.classList.toggle("clair", theme === "clair");
}

appliquerTheme(sessionStorage.getItem("theme") ?? "sombre");

boutonTheme.addEventListener("click", () => {
  const nouveau = document.body.classList.contains("clair") ? "sombre" : "clair";
  appliquerTheme(nouveau);
  sessionStorage.setItem("theme", nouveau);
});

window.addEventListener('load', () => {
  resizeOptions();
  getGenres();
});
