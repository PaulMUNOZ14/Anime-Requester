require('dotenv').config();
const apiKey = import.meta.env.VITE_API_KEY;
const API_HOST = 'anime-db.p.rapidapi.com';
const API_URL = `https://${API_HOST}`;

const form = document.querySelector("form");
const categorie = document.querySelector("#cat")
const entry = document.querySelector("#entry");
const cardsList = ducument.querySelector("#cardsList");

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
  const entryValue = entry.value.trim();

  if (recherche === ""){
    afficherMessage("Veuillez entrer un nom d'anime ou de manga.", "error");
    return;
  }

  cardsList.innerHTML = "";

  try {
    let resultats;

    switch (typeRechecher) {
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
    afficherMessage("Une erreur s'est produite lors de la recherche. Veuillez réessayer plus tard.", "error");
    }
});

// Bouton reset
resetButton.addEventListener("click", () => {
  form.reset();
  cardsList.innerHTML = "";
  entry.focus();
});

// requete API
function requeteAPI(url) {
    null
}

// Recherche par titre
function rechercherParTitre(titre) {
    null
}

// Recherche par identifiant
function rechercherParIdentifiant(id) {
    null
}

// Recherche par classement
function rechercherParClassement(classement) {
    null
}

// Afficher les resultats
function afficherResultats(animes) {
  null
}

// Afficher un message
function afficherMessage(message) {
  const paragraph = document.createElement("p");

  paragraph.classList.add("message");
  paragraph.textContent = message;

  cardsList.appendChild(paragraph);
}