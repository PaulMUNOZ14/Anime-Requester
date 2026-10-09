export class Card {
  constructor(title, genres, rank, image, synopsis, episodes, id) {
    this.title = title;
    this.genres = genres;
    this.rank = rank;
    this.image = image;
    this.synopsis = synopsis;
    this.episodes = episodes;
    this.id = id;
  }

  render() {
    const cardsList = document.getElementById("cardsList");
    if (!cardsList) {
      console.error(
        'Impossible d’afficher la carte : l’élément "cardsList" est introuvable.',
      );
      return;
    }
    const cardElement = document.createElement("article");
    cardElement.classList.add("card");

    const titleElement = document.createElement("h2");
    titleElement.textContent = this.title;
    cardElement.appendChild(titleElement);

    const imageElement = document.createElement("img");
    imageElement.src = this.image
      ? this.image
      : "assets/image-placeholder.jpeg";
    imageElement.alt = `image de ${this.title}`;
    cardElement.appendChild(imageElement);

    const detailsElement = document.createElement("div");
    detailsElement.classList.add("card-details");
    cardElement.appendChild(detailsElement);

    const idElement = document.createElement("p");
    idElement.innerHTML = `<strong>Identifiant :</strong> ${this.id}`;
    detailsElement.appendChild(idElement);

    const episodesElement = document.createElement("p");
    episodesElement.innerHTML = `<strong>Nombres d'épisodes :</strong> ${this.episodes}`;
    detailsElement.appendChild(episodesElement);

    const rankElement = document.createElement("p");
    rankElement.innerHTML = `<strong>Classement :</strong> ${this.rank}`;
    detailsElement.appendChild(rankElement);

    const genresLabel = document.createElement("p");
    genresLabel.classList.add("genres-label");
    genresLabel.innerHTML = `<strong>Genres :</strong>`;
    detailsElement.appendChild(genresLabel);

    const genresList = document.createElement("ul");

    if (Array.isArray(this.genres) && this.genres.length > 0) {
      this.genres.forEach((genre) => {
        const genresElement = document.createElement("li");
        genresElement.classList.add("genre");
        genresElement.textContent = genre;
        genresList.appendChild(genresElement);
      });
    } else {
      const genreElement = document.createElement("li");
      genreElement.classList.add("element");
      genreElement.textContent = "N/A";
      genresList.appendChild(genreElement);
    }
    detailsElement.appendChild(genresList);

    const synopsisElement = document.createElement("p");
    synopsisElement.innerHTML = `<strong>Synopsis :</strong> ${this.synopsis}`;
    detailsElement.appendChild(synopsisElement);

    cardsList.appendChild(cardElement);
  }
}
