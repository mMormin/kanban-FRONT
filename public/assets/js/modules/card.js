import { apiFetcher } from "./apiFetcher.js";

import { modalModule } from "./modal.js";

export const cardModule = {
  isNotCard: false,
  isCard: true,

  // To Create and Set the card in the DOM
  createCard: function (cardData) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");

    Sortable.create(cardsContainer, {
      ghostClass: "ghost-card",
      chosenClass: "chosen-card",
      animation: 500,
      direction: "horizontal",
      // Element dragging ended
      onEnd: function (evt) {
        const cardIndex = evt.newIndex;

        cardModule.changeCardPosition(cardIndex);

        // cardDiv.style.order = cardIndex;
        // evt.item; // dragged HTMLElement
        // evt.to; // target list
        // evt.from; // previous list
        // evt.oldIndex; // element's old index within old parent
        // evt.newIndex; // element's new index within new parent
        // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
        // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
        // evt.clone; // the clone element
        // evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
        // console.log(
        //   evt.item,
        //   evt.to,
        //   evt.from,
        //   evt.oldIndex,
        //   evt.newIndex,
        //   evt.oldDraggableIndex,
        //   evt.newDraggableIndex,
        //   evt.clone,
        //   evt.pullMode
        // );
      },
    });

    const clone = document.importNode(template.content, true);

    const title = clone.querySelector("h2");

    const cardIdDiv = clone.querySelector(".card");
    const cardId = cardData.get("id");

    cardIdDiv.dataset.cardId = cardId;
    cardIdDiv.style.order = cardData.get("position");
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

  changeCardPosition: async function (direction) {
    e.preventDefault();

    try {
      const cardOptions = {
        method: "PATCH",
        body: {
          position: direction,
        },
      };

      const cardsOptions = {
        method: "PATCH",
      };

      const cardResponse = await fetch(
        `${apiFetcher.base_url}/${cardId}`,
        cardOptions
      );

      const json = await cardResponse.json();
      if (!cardResponse.ok) throw json;

      const cardsResponse = await fetch(
        `${apiFetcher.base_url}?dir=${direction}`,
        cardsOptions
      );

      const json2 = await cardsResponse.json();
      if (!cardsResponse.ok) throw json2;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
