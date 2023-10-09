import { apiFetcher } from "./apiFetcher.js";

export const modalModule = {
  // Constants Strings
  constants: {
    cardNameEn: "card",
    sufixCardFr: "carte",
    todoNameEn: "todo",
    sufixTodoFr: "tâche",
    inputSufix: "Input",
  },

  // To Capitalize the first letter of the given string
  capzFirstLetter: function (value) {
    const upperIt = value.charAt(0).toUpperCase() + value.slice(1);
    return upperIt;
  },

  // To Initialize the New modal Attributes
  newModalAttributes: function (e, isCard) {
    const data = {
      isCard,
      method: "add",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Ajouter une ",
      placeholderValue: "Ma nouvelle ",
      submitValue: "Créer",
    };

    modalModule.fillModalWithAttributes(e, data);
  },

  // To Initialize the Edit modal Attributes
  editModalAttributes: function (e, isCard, cardId, todoId) {
    const data = {
      isCard,
      method: "edit",
      formValue: "",
      inputValue: "",
      idValue: "",
      titleValue: "Editer une ",
      submitValue: "Editer",
      placeholderValue: "edit",
      cardTodoIds: {
        cardId,
        todoId,
      },
    };

    modalModule.fillModalWithAttributes(e, data);
  },

  // To Fill the Modal with the Attributes
  fillModalWithAttributes: function (e, data) {
    if (data.isCard === true) {
      data.titleValue += modalModule.constants.sufixCardFr;
      data.placeholderValue += modalModule.constants.sufixCardFr;
      data.formValue =
        modalModule.constants.cardNameEn +
        modalModule.capzFirstLetter(data.method);
      data.inputValue = data.method + modalModule.constants.inputSufix;
      data.idValue =
        data.method +
        modalModule.capzFirstLetter(modalModule.constants.cardNameEn) +
        "Modal";
    } else {
      data.titleValue += modalModule.constants.sufixTodoFr;
      data.placeholderValue += modalModule.constants.sufixTodoFr;
      data.formValue =
        modalModule.constants.todoNameEn +
        modalModule.capzFirstLetter(data.method);
      data.inputValue = data.method + modalModule.constants.inputSufix;
      data.idValue =
        data.method +
        modalModule.capzFirstLetter(modalModule.constants.todoNameEn) +
        "Modal";
    }

    modalModule.createModal(e, data);
  },

  // To Create and Set the new Modal in the DOM
  createModal: function (e, data) {
    const { isCard } = data;
    const { cardTodoIds } = data;
    const template = document.getElementById("modal");
    const section = document.querySelector(".section");

    // Clone Selection
    const clone = document.importNode(template.content, true);

    // Clone Elements
    const form = clone.querySelector("form");
    const title = clone.querySelector(".modal-card-title");
    const label = clone.querySelector(".label");
    const input = clone.querySelector(".input");
    const modal = clone.querySelector(".modal");
    const submit = clone.querySelector(".is-success");
    const idInput = clone.querySelector(".input-card-id");
    const deleteCardButton = clone.querySelector(".card-delete-button");

    const closeModalButtons = form.querySelectorAll(".close");

    // Clone Values
    modal.setAttribute("id", data.idValue);
    form.setAttribute("id", data.formValue);
    title.textContent = data.titleValue;
    label.setAttribute("for", data.inputValue);
    input.setAttribute("id", data.inputValue);
    input.setAttribute("placeholder", data.placeholderValue);
    input.value = input.placeholder;
    submit.textContent = data.submitValue;

    // If TODO, set cardId with data-card-id's value
    if (!data.isCard) {
      const { cardId } = e.target.closest(".card").dataset;
      idInput.value = cardId;
    }

    // Events Listeners
    form.addEventListener("submit", (e) =>
      apiFetcher.submitCardOrTodoForm(e, isCard, cardTodoIds)
    );

    closeModalButtons.forEach((button) => {
      button.addEventListener("click", modalModule.hideModal);
    });

    // If CARD and EDIT, display the card delete button
    if (data.isCard && data.method === "edit") {
      const { cardId } = e.target.closest(".card").dataset;
      deleteCardButton.classList.remove("is-hidden");

      // Event Listener
      deleteCardButton.addEventListener("click", (ev) =>
        apiFetcher.deleteCardOrTodo(ev, cardId)
      );
    }

    // Show Modal
    modal.classList.add("is-active");

    // Insertion of the Modal clone after section div
    section.parentNode.insertBefore(clone, section.nextSibling);
  },

  // To Hide all modals
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },
};
