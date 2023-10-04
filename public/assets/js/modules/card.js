import { modalModule } from "./modal.js";

export const cardModule = {
  isNotCard: false,
  isCard: true,
  
  // To Create and Set the card in the DOM
  createCard: function (cardData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");

    const clone = document.importNode(template.content, true);

    const title = clone.querySelector("h2");
    const cardIdDiv = clone.querySelector(".panel");
    const cardId = cardData.get("id");

    cardIdDiv.dataset.cardId = cardId;
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
}