import { apiFetcher } from "./apiFetcher.js";

import { modalModule } from "./modal.js";

export const cardModule = {
  isNotCard: false,
  isCard: true,

  // To Create and Set the card in the DOM
  createCard: function (cardData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");
    const cardId = cardData.get("id");

    Sortable.create(cardsContainer, {
      ghostClass: "ghost-card",
      chosenClass: "chosen-card",
      animation: 500,
      direction: "horizontal",
      // onEnd: function (evt) {
      //   const cardIndex = evt.newIndex;
      //   cardModule.changeCardPosition(cardId, cardIndex);
      // },
    });

    const clone = document.importNode(template.content, true);

    const title = clone.querySelector("h2");

    const cardIdDiv = clone.querySelector(".card");

    cardIdDiv.dataset.cardId = cardId;
    //cardIdDiv.style.order = cardData.get("position");
    title.textContent = cardData.get("title");

    // Events Listeners
    clone
      .querySelector(".add-todo-button")
      .addEventListener("click", (e) =>
        modalModule.newModalAttributes(e, cardModule.isNotCard)
      );

    clone
      .querySelector(".edit-card-button")
      .addEventListener("click", (e) =>
        modalModule.editModalAttributes(e, cardModule.isCard, cardId)
      );

    cardsContainer.appendChild(clone);

    modalModule.hideModal();
  },

  changeCardPosition: async function (cardId, direction) {
    try {
      const cardOptions = {
        method: "PATCH",
      };

      const cardResponse = await fetch(
        `${apiFetcher.base_url}/${cardId}?dir=${direction}`,
        cardOptions
      );

      const json = await cardResponse.json();
      if (!cardResponse.ok) throw json;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
