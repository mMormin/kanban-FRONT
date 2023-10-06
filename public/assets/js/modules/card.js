import { apiFetcher } from "./apiFetcher.js";
import { modalModule } from "./modal.js";

export const cardModule = {
  isNotCard: false,
  isCard: true,

  // To Create and Set the card in the DOM
  createCard: function (cardData) {
    const templateContent = document.getElementById("card").content;
    const cardsContainer = document.querySelector(".cards-list");
    const cardId = cardData.get("id");

    const clone = document.importNode(templateContent, true);

    const title = clone.querySelector("h2");
    const cardIdDiv = clone.querySelector(".card");
    cardIdDiv.dataset.cardId = cardId;
    title.textContent = cardData.get("title");
    //cardIdDiv.style.order = cardData.get("position");

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

    const dragAndDropCard = Sortable.create(cardsContainer, {
      ghostClass: "ghost-card",
      chosenClass: "chosen-card",
      animation: 500,
      direction: "horizontal",
    });

    dragAndDropCard.option("onUpdate", function (evt) {
      const movedCardId = evt.item.dataset.cardId;
      const isMovedCardId = evt.from.children[evt.oldIndex].dataset.cardId;

      apiFetcher.swapCardsPositions(movedCardId, isMovedCardId);
    });

    modalModule.hideModal();
  },
};
