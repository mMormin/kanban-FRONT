var app = {
  base_url: "http://localhost:3000/boards/1/cards",
  errorBox: document.querySelector(".error-box"),

  // Modal Strings
  modalConstants: {
    cardModalIdValue: "addCardModal",
    todoModalIdValue: "addTodoModal",
    formSufix: "Add",
    inputSufix: "Input",
    titlePrefix: "Ajouter une ",
    placeholderPrefix: "Ma nouvelle ",
  },

  // Executed functions after initialization
  init: function () {
    app.getCardsList();

    const newCardButton = document.getElementById("addCardButton");

    newCardButton.addEventListener("click", app.makeCardModal);
  },

  getCardsList: async function () {
    try {
      const response = await fetch(app.base_url);

      if (!response.ok) throw json;

      const json = await response.json();

      json.forEach((card) => {
        if (!card) {
          errorBox.classList.remove("is-hidden");
        }

        const cardsData = new FormData();

        for (const key in card) {
          cardsData.append(key, card[key]);
        }

        app.createCard(cardsData);

        card.todos.forEach((todo) => {
          const todosData = new FormData();

          for (const key in todo) {
            todosData.append(key, todo[key]);
          }

          const cardId = todosData.get("card_id");

          app.createTodo(todosData, cardId);
        });
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // Card Modal Initialization
  makeCardModal: function (e) {
    const nameEn = "card";
    const nameFr = "carte";
    const isCard = true;
    app.createModal(e, nameEn, nameFr, isCard);
  },

  // Todo Modal Initialization
  makeTodoModal: function (e) {
    const nameEn = "todo";
    const nameFr = "tâche";
    const isCard = false;
    app.createModal(e, nameEn, nameFr, isCard);
  },

  // Creating and adding the wanted modal to the DOM
  createModal: function (e, nameEn, nameFr, isCard) {
    const template = document.getElementById("modal");
    const section = document.querySelector(".section");

    // Clone selection
    const clone = document.importNode(template.content, true);

    // Clone Variables
    const form = clone.querySelector("form");
    const title = clone.querySelector(".modal-card-title");
    const label = clone.querySelector(".label");
    const input = clone.querySelector(".input");
    const modal = clone.querySelector(".modal");

    // Clone Values definiton
    const modalIdValue = isCard
      ? app.modalConstants.cardModalIdValue
      : app.modalConstants.cardTodoIdValue;
    const titleValue = `${app.modalConstants.titlePrefix}${nameFr}`;
    const formIdValue = `${nameEn}${app.modalConstants.formSufix}`;
    const inputIdValue = `${nameEn}${app.modalConstants.inputSufix}`;
    const placeholderValue = `${app.modalConstants.placeholderPrefix}${nameFr}`;

    // Clone Values setting
    modal.setAttribute("id", modalIdValue);
    form.setAttribute("id", formIdValue);
    title.textContent = titleValue;
    label.setAttribute("for", inputIdValue);
    input.setAttribute("id", inputIdValue);
    input.setAttribute("placeholder", placeholderValue);
    input.value = input.placeholder;

    // Getting cardId with data-card-id's value of HTML .panel element
    if (!isCard) {
      const idInput = clone.getElementById("todoId");
      const cardId = e.target.closest(".panel").dataset.cardId;
      idInput.value = cardId;
    }

    // Show Modal with class add
    modal.classList.add("is-active");

    // Insertion of the Modal clone after section div
    section.parentNode.insertBefore(clone, section.nextSibling);

    // Events listeners
    form.addEventListener("submit", (e) =>
      app.handleFormModalSubmission(e, isCard)
    );
    const closeModalButtons = document.querySelectorAll(".close");
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", app.hideModal);
    });
  },

  // Getting the new card form's data on submission
  handleFormModalSubmission: async function (e, isCard) {
    e.preventDefault();

    try {
      const form = e.target;

      const formData = new FormData(form);
      const title = formData.get("title");

      const options = {
        method: "POST",
        body: formData,
      };

      if (!title) {
        alert(
          `Impossible de créer une ${isCard ? "carte" : "todo"} sans nom !`
        );
        return;
      }

      if (isCard) {
        const response = await fetch(app.base_url, options);

        if (!response.ok) throw json;

        const json = await response.json();
        
        location.reload();
      } else {
        const response = await fetch(app.base_url, options);

        if (!response.ok) throw json;

        const json = await response.json();

        app.createTodo(formData, id);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },

  // Hide all opened modal
  hideModal: function () {
    const modals = document.querySelectorAll(".modal");

    modals.forEach((modal) => {
      modal.classList.remove("is-active");
    });
  },

  // Creating and adding the card to the DOM
  createCard: function (cardDatas) {
    const template = document.getElementById("card");
    const cardsContainer = document.querySelector(".cards-list");
    const clone = document.importNode(template.content, true);

    clone
      .getElementById("addTodoButton")
      .addEventListener("click", app.makeTodoModal);

    const title = clone.querySelector("h2");
    const cardId = clone.querySelector(".panel");


    cardId.dataset.cardId = cardDatas.get("id");
    title.textContent = cardDatas.get("title");

    cardsContainer.appendChild(clone);
    app.hideModal();
  },

  // Creating and adding the todo to the DOM
  createTodo: function (todoDatas, cardId) {
    const template = document.getElementById("todo");
    const todosContainer = document.querySelector(
      `[data-card-id="${cardId}"] .todos-list`
    );

    const clone = document.importNode(template.content, true);
    const title = clone.querySelector(".todo__title");
    title.textContent = todoDatas.get("title");

    todosContainer.appendChild(clone);
    app.hideModal();
  },
};

document.addEventListener("DOMContentLoaded", app.init);
