import { Card } from "./card.js";

let API_KEY;

const popup = document.createElement('div')
popup.className = 'popup'

popup.innerHTML = `
  <div>
    <h1>Veuillez rentrer votre clé API</h1>
    <input id='APIkeyEntry' type='text' placeholder='Clé API'>
    <button>Confirmer</button>
  </div>
`

function confirmeAPI(){
  let inp = popup.querySelector('input').value
  if (inp){
    API_KEY = inp
    body.children[body.children.length - 1].remove()
  }
}

const apiBtn = popup.querySelector('button')
apiBtn.addEventListener('click', confirmeAPI)

document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && body.children[body.children.length - 1] == popup){
    confirmeAPI()
  }
})

const body = document.querySelector('body')
body.appendChild(popup)

const API_HOST = "anime-db.p.rapidapi.com";
const API_URL = `https://${API_HOST}`;

const form = document.querySelector("form");
const categorie = document.querySelector("#cat");
const entry = document.querySelector("#entry");
const cardsList = document.querySelector("#cardsList");

// BOUTON RESET
const resetButton = document.createElement("button");
resetButton.type = "button";
resetButton.id = "resetBtn";
resetButton.textContent = "Réinitialiser";

form.appendChild(resetButton);

// Event du formulaire
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const category = categorie.value;
  const recherche = entry.value.trim();

  if (recherche === "") {
    afficherMessage("Veuillez entrer un nom d'anime ou de manga.", "error");
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
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    });
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
  const url = `${API_URL}/anime?page=1&size=10&search=${encodeURIComponent(titre)}`;
  afficherResultats(await requeteAPI(url));
}

// Recherche par identifiant
async function rechercherParIdentifiant(id) {
  const url = `${API_URL}/anime/${encodeURIComponent(id)}`;
  afficherResultats(await requeteAPI(url));
}

// Recherche par classement
async function rechercherParClassement(classement) {
  const url = `${API_URL}/anime?page=1&size=1&sort=rank:${encodeURIComponent(classement)}`;
  afficherResultats(await requeteAPI(url));
}

// Afficher les resultats
function afficherResultats(animes) {
  const animesList = animes.data ?? [];
  if (animesList.length === 0) {
    afficherMessage("Aucun résultat trouvé.");
    return;
  }

  animesList.forEach((anime) => {
    const card = new Card(
      anime.title ?? anime.name ?? "Titre inconnu",
      anime.genres ?? [],
      anime.rank ?? anime.ranking ?? "N/A",
      anime.image ?? "",
      anime.synopsis ?? "Synopsis indisponible.",
      anime.episodes ?? "N/A",
    );
    card.render();
  });
}

// Afficher un message
function afficherMessage(message) {
  const paragraph = document.createElement("p");

  paragraph.classList.add("message");
  paragraph.textContent = message;

  cardsList.appendChild(paragraph);
}
