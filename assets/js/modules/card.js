import { apiFetcher } from "./apiFetcher.js";
import { modalModule } from "./modal.js";

export const cardModule = {
  isTodo: "isTodo",
  isCard: "isCard",

  // To Create and Set the card in the DOM
  makeCard: function (cardData) {
    const templateContent = document.getElementById("card").content;
    const cardsContainer = document.querySelector(".cards-list");
    const cardId = cardData.get("id");

    const clone = document.importNode(templateContent, true);

    const title = clone.querySelector("h2");
    const cardIdDiv = clone.querySelector(".card");
    cardIdDiv.dataset.cardId = cardId;
    title.textContent = cardData.get("title");

    // Events Listeners
    clone
      .querySelector(".add-todo-button")
      .addEventListener("click", (e) =>
        modalModule.newModalAttributes(e, cardModule.isTodo)
      );

      
    clone
      .querySelector(".edit-card-button")
      .addEventListener("click", (e) =>
        modalModule.editModalAttributes(e, cardModule.isCard, cardId)
      );

    cardsContainer.appendChild(clone);

    const dragAndDropOnCard = Sortable.create(cardsContainer, {
      ghostClass: "ghost-card",
      chosenClass: "chosen-card",
      swapClass: "highlight-card",
      swap: true,
      animation: 500,
      direction: "horizontal",
    });

    dragAndDropOnCard.option("onUpdate", function (evt) {
      const movedCardId = evt.item.dataset.cardId;
      const isMovedCardId = evt.from.children[evt.oldIndex].dataset.cardId;

      apiFetcher.swapCardsPositions(movedCardId, isMovedCardId);
    });

    modalModule.hideModal();
  },
};
